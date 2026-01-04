import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth-prisma.js';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '../config/environment.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

const STORAGE_MODE = config.storageMode || 'local';
const BUCKET_NAME = config.aws.bucketName || 'paricus-reports';

// Configure S3 client (only if using S3)
let s3Client;
if (STORAGE_MODE === 's3') {
  s3Client = new S3Client({
    region: config.aws.region,
    credentials: {
      accessKeyId: config.aws.accessKeyId,
      secretAccessKey: config.aws.secretAccessKey,
    },
  });
}

// Local storage path
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'tickets');

// Configure multer based on storage mode
const storage = STORAGE_MODE === 'local'
  ? multer.diskStorage({
      destination: async (req, file, cb) => {
        // Handle both ticket attachment routes (/:id/attachments) and detail attachment routes (/:ticketId/details/:detailId/attachments)
        const ticketId = req.params.id || req.params.ticketId;
        const { clientId } = req.user;
        // Convert clientId to string for path.join
        const uploadPath = path.join(UPLOADS_DIR, String(clientId), ticketId);

        try {
          await fs.mkdir(uploadPath, { recursive: true });
          cb(null, uploadPath);
        } catch (error) {
          cb(error);
        }
      },
      filename: (req, file, cb) => {
        const timestamp = Date.now();
        const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${timestamp}-${sanitizedFileName}`);
      },
    })
  : multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for images
  },
  fileFilter: (req, file, cb) => {
    // Allow common image formats
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WEBP) are allowed'), false);
    }
  }
});

/**
 * Helper function to sanitize filename - prevents path traversal attacks
 */
function sanitizeFileName(filename) {
  // Remove path separators and special characters
  return filename
    .replace(/^.*[\\\/]/, '') // Remove directory path
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
    .substring(0, 255); // Limit length to prevent buffer overflow
}

/**
 * Helper function to add URL to attachment object
 * NOTE: URLs don't include token here - token will be added on client side
 */
function addUrlToAttachment(attachment, ticketId, detailId = null) {
  const urlPath = detailId
    ? `/api/tickets/${ticketId}/details/${detailId}/attachments/${attachment.id}/file`
    : `/api/tickets/${ticketId}/attachments/${attachment.id}/file`;

  return {
    ...attachment,
    url: urlPath,
  };
}

/**
 * Helper function to process ticket and add URLs to all attachments
 */
function processTicketWithUrls(ticket) {
  const processed = {
    ...ticket,
    description: ticket.description ? JSON.parse(ticket.description) : null,
  };

  // Add URLs to ticket attachments
  if (processed.attachments) {
    processed.attachments = processed.attachments.map(att =>
      addUrlToAttachment(att, ticket.id)
    );
  }

  // Add URLs to detail attachments
  if (processed.details) {
    processed.details = processed.details.map(detail => ({
      ...detail,
      attachments: detail.attachments?.map(att =>
        addUrlToAttachment(att, ticket.id, detail.id)
      ) || [],
    }));
  }

  return processed;
}

/**
 * @route   GET /api/tickets
 * @desc    Get all tickets for the authenticated user's client
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { clientId, id: userId } = req.user;  // Fix: req.user.id not req.user.userId

    const tickets = await prisma.ticket.findMany({
      where: { clientId },
      include: {
        details: {
          orderBy: { timestamp: 'asc' },
          include: {
            attachments: {
              orderBy: { uploadedAt: 'desc' },
            },
          },
        },
        attachments: {
          orderBy: { uploadedAt: 'desc' },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Process tickets: parse description and add URLs to attachments
    const processedTickets = tickets.map(processTicketWithUrls);

    res.json({ data: processedTickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/tickets/:id
 * @desc    Get a single ticket by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId } = req.user;

    const ticket = await prisma.ticket.findFirst({
      where: {
        id,
        clientId, // Ensure user can only access their client's tickets
      },
      include: {
        details: {
          orderBy: { timestamp: 'asc' },
          include: {
            attachments: {
              orderBy: { uploadedAt: 'desc' },
            },
          },
        },
        attachments: {
          orderBy: { uploadedAt: 'desc' },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Process ticket: parse description and add URLs to attachments
    const processedTicket = processTicketWithUrls(ticket);

    res.json({ data: processedTicket });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/tickets
 * @desc    Create a new ticket
 * @access  Private
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { clientId, id: userId } = req.user;  // Fix: req.user.id not req.user.userId
    const { subject, priority, assignedTo, description } = req.body;

    // Validation
    if (!subject || !priority || !description) {
      return res.status(400).json({
        error: 'Subject, priority, and description are required',
      });
    }

    // Create description JSON object
    const descriptionJson = JSON.stringify({
      descriptionData: description,
      attachmentIds: [], // Changed from attachmentId to attachmentIds (array)
      url: null,
    });

    // Create ticket with initial description
    const ticket = await prisma.ticket.create({
      data: {
        clientId,
        userId,
        subject,
        priority,
        assignedTo,
        status: 'Open',
        description: descriptionJson,
      },
      include: {
        details: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Parse description JSON for response
    const ticketWithParsedDescription = {
      ...ticket,
      description: JSON.parse(ticket.description),
    };

    res.status(201).json({ data: ticketWithParsedDescription });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   PUT /api/tickets/:id
 * @desc    Update a ticket
 * @access  Private
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId } = req.user;
    const { subject, priority, status, assignedTo } = req.body;

    // Check if ticket exists and belongs to user's client
    const existingTicket = await prisma.ticket.findFirst({
      where: { id, clientId },
    });

    if (!existingTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Update ticket
    const ticket = await prisma.ticket.update({
      where: { id },
      data: {
        subject,
        priority,
        status,
        assignedTo,
      },
      include: {
        details: {
          orderBy: { timestamp: 'asc' },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Parse description JSON
    const ticketWithParsedDescription = {
      ...ticket,
      description: ticket.description ? JSON.parse(ticket.description) : null,
    };

    res.json({ data: ticketWithParsedDescription });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/tickets/:id/details
 * @desc    Add a new detail/update to a ticket
 * @access  Private
 */
router.post('/:id/details', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId } = req.user;
    const { detail } = req.body;

    console.log('📝 Adding ticket detail:', { ticketId: id, clientId, hasDetail: !!detail });

    if (!detail) {
      console.error('❌ Detail validation failed: Detail is required');
      return res.status(400).json({ error: 'Detail is required' });
    }

    // Check if ticket exists and belongs to user's client
    const existingTicket = await prisma.ticket.findFirst({
      where: { id, clientId },
    });

    if (!existingTicket) {
      console.error('❌ Ticket not found:', { ticketId: id, clientId });
      return res.status(404).json({ error: 'Ticket not found' });
    }

    console.log('✅ Ticket found, creating detail...');

    // Add new detail
    const ticketDetail = await prisma.ticketDetail.create({
      data: {
        ticketId: id,
        detailData: detail,
      },
    });

    console.log('✅ Detail created:', ticketDetail.id);

    // Get updated ticket with all details
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        details: {
          orderBy: { timestamp: 'asc' },
          include: {
            attachments: {
              orderBy: { uploadedAt: 'desc' },
            },
          },
        },
        attachments: {
          orderBy: { uploadedAt: 'desc' },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Process ticket: parse description and add URLs to attachments
    const processedTicket = processTicketWithUrls(ticket);

    console.log('✅ Ticket detail added successfully');
    res.status(201).json({ data: processedTicket });
  } catch (error) {
    console.error('❌ Error adding detail:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message || 'Failed to add ticket detail' });
  }
});

/**
 * @route   DELETE /api/tickets/:id
 * @desc    Delete a ticket
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId } = req.user;

    // Check if ticket exists and belongs to user's client
    const existingTicket = await prisma.ticket.findFirst({
      where: { id, clientId },
      include: { attachments: true },
    });

    if (!existingTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Delete attachments from storage
    if (existingTicket.attachments.length > 0) {
      await Promise.all(
        existingTicket.attachments.map(async (attachment) => {
          try {
            if (STORAGE_MODE === 's3') {
              const deleteCommand = new DeleteObjectCommand({
                Bucket: attachment.s3Bucket,
                Key: attachment.s3Key,
              });
              await s3Client.send(deleteCommand);
            } else {
              const filePath = path.join(UPLOADS_DIR, attachment.s3Key);
              await fs.unlink(filePath);
            }
          } catch (error) {
            console.error('Error deleting attachment file:', error);
          }
        })
      );
    }

    // Delete ticket (descriptions and attachments will be cascade deleted)
    await prisma.ticket.delete({
      where: { id },
    });

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/tickets/:id/attachments
 * @desc    Upload an image attachment to a ticket
 * @access  Private
 */
router.post('/:id/attachments', authenticateToken, (req, res, next) => {
  console.log('🚀 Starting file upload...');
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size too large. Maximum 10MB allowed.' });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(500).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  let localFilePath = null;

  try {
    const { id: ticketId } = req.params;
    const { clientId } = req.user;

    console.log('📎 Upload attachment request:', { ticketId, clientId, hasFile: !!req.file });

    // Validate file first
    if (!req.file) {
      console.error('❌ No file in request');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('📁 File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });

    // Store local file path for cleanup if needed
    if (STORAGE_MODE === 'local' && req.file.path) {
      localFilePath = req.file.path;
    }

    // Check if ticket exists and belongs to user's client
    console.log('🔍 Looking for ticket:', { ticketId, clientId });
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, clientId },
    });

    if (!ticket) {
      console.error('❌ Ticket not found:', { ticketId, clientId });
      // Clean up uploaded file if ticket doesn't exist
      if (localFilePath) {
        try {
          await fs.unlink(localFilePath);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }
      return res.status(404).json({ error: 'Ticket not found' });
    }

    console.log('✅ Ticket found, proceeding with attachment save');

    let s3Key, s3Bucket;

    if (STORAGE_MODE === 's3') {
      // Generate S3 key for the image
      const timestamp = Date.now();
      const sanitizedFileName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      s3Key = `tickets/${clientId}/${ticketId}/${timestamp}-${sanitizedFileName}`;
      s3Bucket = BUCKET_NAME;

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: s3Bucket,
        Key: s3Key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(uploadCommand);
    } else {
      // Local storage - file already saved by multer
      // Store relative path from uploads directory
      s3Key = path.relative(UPLOADS_DIR, req.file.path).replace(/\\/g, '/');
      s3Bucket = 'local';
    }

    // Save attachment record in database with retry logic for SQLite
    let attachment;
    let retries = 3;
    let lastError;

    while (retries > 0) {
      try {
        console.log(`💾 Saving attachment to database (attempt ${4 - retries}/3)...`);
        attachment = await prisma.ticketAttachment.create({
          data: {
            ticketId,
            fileName: req.file.originalname,
            s3Key,
            s3Bucket,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
          },
        });
        console.log('✅ Attachment saved to database:', attachment.id);
        break; // Success, exit retry loop
      } catch (dbError) {
        console.error(`❌ Database error (attempt ${4 - retries}/3):`, dbError.message);
        lastError = dbError;
        retries--;

        if (retries > 0) {
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 100 * (4 - retries)));
        }
      }
    }

    if (!attachment) {
      // Database save failed after retries
      console.error('❌ Failed to save attachment to database after retries:', lastError);

      // Clean up uploaded file
      if (localFilePath) {
        try {
          await fs.unlink(localFilePath);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }

      throw new Error('Failed to save attachment to database. Please try again.');
    }

    console.log('✅ Attachment upload complete');
    res.status(201).json({ data: attachment });
  } catch (error) {
    console.error('❌ Error uploading attachment:', error);
    console.error('Error stack:', error.stack);

    // Clean up file on error if in local mode
    if (localFilePath) {
      try {
        await fs.unlink(localFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up file on error:', cleanupError);
      }
    }

    res.status(500).json({
      error: error.message || 'Failed to upload attachment. Please try again.'
    });
  }
});

/**
 * @route   GET /api/tickets/:ticketId/attachments/:attachmentId/url
 * @desc    Get a pre-signed URL to download/view an attachment
 * @access  Private
 */
router.get('/:ticketId/attachments/:attachmentId/url', authenticateToken, async (req, res) => {
  try {
    const { ticketId, attachmentId } = req.params;
    const { clientId } = req.user;

    // Check if ticket exists and belongs to user's client
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, clientId },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Get attachment
    const attachment = await prisma.ticketAttachment.findFirst({
      where: {
        id: parseInt(attachmentId),
        ticketId,
      },
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    let url;

    if (STORAGE_MODE === 's3') {
      // Generate pre-signed URL for S3
      const command = new GetObjectCommand({
        Bucket: attachment.s3Bucket,
        Key: attachment.s3Key,
      });

      url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    } else {
      // For local storage, generate a URL to serve the file
      url = `/api/tickets/${ticketId}/attachments/${attachmentId}/file`;
    }

    res.json({ url });
  } catch (error) {
    console.error('Error generating attachment URL:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Helper function to verify token from query parameter or header
 */
function authenticateTokenFlexible(req, res, next) {
  // Try to get token from query parameter first (for <img> tags)
  let token = req.query.token;

  // If not in query, try Authorization header (for API calls)
  if (!token) {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = {
      userId: decoded.userId,
      clientId: decoded.clientId,
      roleId: decoded.roleId,
      permissions: decoded.permissions || []
    };
    next();
  });
}

/**
 * @route   GET /api/tickets/:ticketId/attachments/:attachmentId/file
 * @desc    Serve local attachment file
 * @access  Private (supports token in query param for <img> tags)
 */
router.get('/:ticketId/attachments/:attachmentId/file', authenticateTokenFlexible, async (req, res) => {
  try {
    const { ticketId, attachmentId } = req.params;
    const { clientId } = req.user;

    // Check if ticket exists and belongs to user's client
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, clientId },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Get attachment
    const attachment = await prisma.ticketAttachment.findFirst({
      where: {
        id: parseInt(attachmentId),
        ticketId,
      },
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    if (attachment.s3Bucket !== 'local') {
      return res.status(400).json({ error: 'This endpoint is only for local files' });
    }

    // Build file path
    const filePath = path.join(UPLOADS_DIR, attachment.s3Key);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${attachment.fileName}"`);

    // Stream the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving attachment file:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   DELETE /api/tickets/:ticketId/attachments/:attachmentId
 * @desc    Delete an attachment
 * @access  Private
 */
router.delete('/:ticketId/attachments/:attachmentId', authenticateToken, async (req, res) => {
  try {
    const { ticketId, attachmentId } = req.params;
    const { clientId } = req.user;

    // Check if ticket exists and belongs to user's client
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, clientId },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Get attachment
    const attachment = await prisma.ticketAttachment.findFirst({
      where: {
        id: parseInt(attachmentId),
        ticketId,
      },
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    // Delete file based on storage mode
    if (STORAGE_MODE === 's3') {
      // Delete from S3
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: attachment.s3Bucket,
          Key: attachment.s3Key,
        });
        await s3Client.send(deleteCommand);
      } catch (error) {
        console.error('Error deleting from S3:', error);
      }
    } else {
      // Delete from local storage
      try {
        const filePath = path.join(UPLOADS_DIR, attachment.s3Key);
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting local file:', error);
      }
    }

    // Delete from database
    await prisma.ticketAttachment.delete({
      where: { id: parseInt(attachmentId) },
    });

    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/tickets/:ticketId/details/:detailId/attachments
 * @desc    Upload attachment for a ticket detail
 * @access  Private
 */
router.post('/:ticketId/details/:detailId/attachments', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { ticketId, detailId } = req.params;
    const { clientId } = req.user;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // SECURITY: Validate file size (additional check beyond multer)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File size exceeds 10MB limit' });
    }

    // Check if ticket exists and belongs to user's client
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, clientId },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // SECURITY: Check if detail exists AND belongs to the ticket
    const detail = await prisma.ticketDetail.findFirst({
      where: {
        id: parseInt(detailId),
        ticketId, // CRITICAL: Verify detail belongs to this ticket
      },
    });

    if (!detail) {
      return res.status(404).json({ error: 'Ticket detail not found or does not belong to this ticket' });
    }

    // SECURITY: Sanitize filename to prevent path traversal attacks
    const sanitizedFileName = sanitizeFileName(req.file.originalname);

    let s3Key, s3Bucket;

    if (STORAGE_MODE === 's3') {
      // Upload to S3 - use sanitized filename
      const fileKey = `tickets/${clientId}/${ticketId}/details/${detailId}/${Date.now()}-${sanitizedFileName}`;
      const uploadCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      });

      await s3Client.send(uploadCommand);

      s3Key = fileKey;
      s3Bucket = BUCKET_NAME;
    } else {
      // Local storage - file already saved by multer
      const relativePath = path.relative(UPLOADS_DIR, req.file.path);

      // SECURITY: Validate path doesn't escape UPLOADS_DIR
      const absolutePath = path.resolve(UPLOADS_DIR, relativePath);
      if (!absolutePath.startsWith(path.resolve(UPLOADS_DIR))) {
        throw new Error('Invalid file path detected');
      }

      s3Key = relativePath.replace(/\\/g, '/');
      s3Bucket = 'local';
    }

    // Create attachment record with sanitized filename
    const attachment = await prisma.ticketDetailAttachment.create({
      data: {
        ticketDetailId: parseInt(detailId),
        fileName: sanitizedFileName, // Use sanitized filename
        s3Key,
        s3Bucket,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      },
    });

    res.status(201).json({ data: attachment });
  } catch (error) {
    console.error('Error uploading detail attachment:', error);

    // SECURITY: Don't expose internal error details in production
    const errorMessage = process.env.NODE_ENV === 'production'
      ? 'Failed to upload attachment'
      : error.message;

    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route   GET /api/tickets/:ticketId/details/:detailId/attachments/:attachmentId/url
 * @desc    Get a pre-signed URL to download/view a detail attachment
 * @access  Private
 */
router.get('/:ticketId/details/:detailId/attachments/:attachmentId/url', authenticateToken, async (req, res) => {
  try {
    const { ticketId, detailId, attachmentId } = req.params;
    const { clientId } = req.user;

    // Check if ticket exists and belongs to user's client
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, clientId },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Get attachment
    const attachment = await prisma.ticketDetailAttachment.findFirst({
      where: {
        id: parseInt(attachmentId),
        ticketDetailId: parseInt(detailId),
      },
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    let url;

    if (STORAGE_MODE === 's3') {
      // Generate pre-signed URL for S3
      const command = new GetObjectCommand({
        Bucket: attachment.s3Bucket,
        Key: attachment.s3Key,
      });

      url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
    } else {
      // For local storage, generate a URL to serve the file
      url = `/api/tickets/${ticketId}/details/${detailId}/attachments/${attachmentId}/file`;
    }

    res.json({ url });
  } catch (error) {
    console.error('Error generating detail attachment URL:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   GET /api/tickets/:ticketId/details/:detailId/attachments/:attachmentId/file
 * @desc    Serve local detail attachment file
 * @access  Private (supports token in query param for <img> tags)
 */
router.get('/:ticketId/details/:detailId/attachments/:attachmentId/file', authenticateTokenFlexible, async (req, res) => {
  try {
    const { ticketId, detailId, attachmentId } = req.params;
    const { clientId } = req.user;

    // Check if ticket exists and belongs to user's client
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, clientId },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // SECURITY: Verify detail belongs to ticket
    const detail = await prisma.ticketDetail.findFirst({
      where: {
        id: parseInt(detailId),
        ticketId, // Ensure detail belongs to this ticket
      },
    });

    if (!detail) {
      return res.status(404).json({ error: 'Ticket detail not found or does not belong to this ticket' });
    }

    // Get attachment and verify it belongs to the detail
    const attachment = await prisma.ticketDetailAttachment.findFirst({
      where: {
        id: parseInt(attachmentId),
        ticketDetailId: parseInt(detailId),
      },
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    if (attachment.s3Bucket !== 'local') {
      return res.status(400).json({ error: 'This endpoint is only for local files' });
    }

    // Build file path
    const filePath = path.join(UPLOADS_DIR, attachment.s3Key);

    // SECURITY: Validate the resolved path is within UPLOADS_DIR
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadsDir = path.resolve(UPLOADS_DIR);
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      console.error('Path traversal attempt detected:', { filePath, resolvedPath, resolvedUploadsDir });
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    try {
      await fs.access(resolvedPath);
    } catch {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    // SECURITY: Sanitize filename for Content-Disposition header
    const safeFileName = attachment.fileName.replace(/["\r\n]/g, '');

    // Set appropriate headers
    res.setHeader('Content-Type', attachment.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${safeFileName}"`);
    res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME type sniffing
    res.setHeader('Cache-Control', 'private, max-age=3600'); // Cache for 1 hour

    // Stream the file
    res.sendFile(resolvedPath);
  } catch (error) {
    console.error('Error serving detail attachment file:', error);

    // SECURITY: Don't expose internal error details in production
    const errorMessage = process.env.NODE_ENV === 'production'
      ? 'Failed to serve file'
      : error.message;

    res.status(500).json({ error: errorMessage });
  }
});

/**
 * @route   DELETE /api/tickets/:ticketId/details/:detailId/attachments/:attachmentId
 * @desc    Delete a detail attachment
 * @access  Private
 */
router.delete('/:ticketId/details/:detailId/attachments/:attachmentId', authenticateToken, async (req, res) => {
  try {
    const { ticketId, detailId, attachmentId } = req.params;
    const { clientId } = req.user;

    // Check if ticket exists and belongs to user's client
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, clientId },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Get attachment
    const attachment = await prisma.ticketDetailAttachment.findFirst({
      where: {
        id: parseInt(attachmentId),
        ticketDetailId: parseInt(detailId),
      },
    });

    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    // Delete file based on storage mode
    if (STORAGE_MODE === 's3') {
      // Delete from S3
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: attachment.s3Bucket,
          Key: attachment.s3Key,
        });
        await s3Client.send(deleteCommand);
      } catch (error) {
        console.error('Error deleting from S3:', error);
      }
    } else {
      // Delete from local storage
      try {
        const filePath = path.join(UPLOADS_DIR, attachment.s3Key);
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting local file:', error);
      }
    }

    // Delete from database
    await prisma.ticketDetailAttachment.delete({
      where: { id: parseInt(attachmentId) },
    });

    res.json({ message: 'Detail attachment deleted successfully' });
  } catch (error) {
    console.error('Error deleting detail attachment:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
