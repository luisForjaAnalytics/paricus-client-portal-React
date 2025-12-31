import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
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
        const { id: ticketId } = req.params;
        const { clientId } = req.user;
        const uploadPath = path.join(UPLOADS_DIR, clientId, ticketId);

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
        descriptions: {
          orderBy: { timestamp: 'asc' },
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

    res.json({ data: tickets });
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
        descriptions: {
          orderBy: { timestamp: 'asc' },
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

    res.json({ data: ticket });
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

    // Create ticket with initial description
    const ticket = await prisma.ticket.create({
      data: {
        clientId,
        userId,
        subject,
        priority,
        assignedTo,
        status: 'Open',
        descriptions: {
          create: {
            descriptionData: description,
          },
        },
      },
      include: {
        descriptions: true,
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

    res.status(201).json({ data: ticket });
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
        descriptions: {
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

    res.json({ data: ticket });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route   POST /api/tickets/:id/descriptions
 * @desc    Add a new description/comment to a ticket
 * @access  Private
 */
router.post('/:id/descriptions', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId } = req.user;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Check if ticket exists and belongs to user's client
    const existingTicket = await prisma.ticket.findFirst({
      where: { id, clientId },
    });

    if (!existingTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Add new description
    const ticketDescription = await prisma.ticketDescription.create({
      data: {
        ticketId: id,
        descriptionData: description,
      },
    });

    // Get updated ticket with all descriptions
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        descriptions: {
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

    res.status(201).json({ data: ticket });
  } catch (error) {
    console.error('Error adding description:', error);
    res.status(500).json({ error: error.message });
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
router.post('/:id/attachments', authenticateToken, upload.single('image'), async (req, res) => {
  let localFilePath = null;

  try {
    const { id: ticketId } = req.params;
    const { clientId } = req.user;

    // Validate file first
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Store local file path for cleanup if needed
    if (STORAGE_MODE === 'local' && req.file.path) {
      localFilePath = req.file.path;
    }

    // Check if ticket exists and belongs to user's client
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, clientId },
    });

    if (!ticket) {
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
        break; // Success, exit retry loop
      } catch (dbError) {
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
      console.error('Failed to save attachment to database after retries:', lastError);

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

    res.status(201).json({ data: attachment });
  } catch (error) {
    console.error('Error uploading attachment:', error);

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
 * @route   GET /api/tickets/:ticketId/attachments/:attachmentId/file
 * @desc    Serve local attachment file
 * @access  Private
 */
router.get('/:ticketId/attachments/:attachmentId/file', authenticateToken, async (req, res) => {
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

export default router;
