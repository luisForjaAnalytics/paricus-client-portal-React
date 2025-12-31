import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth-prisma.js';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from '../config/environment.js';

const router = express.Router();
const prisma = new PrismaClient();

// Configure S3 client
const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

const BUCKET_NAME = config.aws.bucketName || 'paricus-reports';

// Configure multer for image uploads (memory storage for S3)
const upload = multer({
  storage: multer.memoryStorage(),
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

    // Delete attachments from S3
    if (existingTicket.attachments.length > 0) {
      await Promise.all(
        existingTicket.attachments.map(async (attachment) => {
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: attachment.s3Bucket,
              Key: attachment.s3Key,
            });
            await s3Client.send(deleteCommand);
          } catch (error) {
            console.error('Error deleting S3 file:', error);
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
  try {
    const { id: ticketId } = req.params;
    const { clientId } = req.user;

    // Check if ticket exists and belongs to user's client
    const ticket = await prisma.ticket.findFirst({
      where: { id: ticketId, clientId },
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Validate file
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Generate S3 key for the image
    const timestamp = Date.now();
    const sanitizedFileName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const s3Key = `tickets/${clientId}/${ticketId}/${timestamp}-${sanitizedFileName}`;

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3Client.send(uploadCommand);

    // Save attachment record in database
    const attachment = await prisma.ticketAttachment.create({
      data: {
        ticketId,
        fileName: req.file.originalname,
        s3Key,
        s3Bucket: BUCKET_NAME,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      },
    });

    res.status(201).json({ data: attachment });
  } catch (error) {
    console.error('Error uploading attachment:', error);
    res.status(500).json({ error: error.message });
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

    // Generate pre-signed URL
    const command = new GetObjectCommand({
      Bucket: attachment.s3Bucket,
      Key: attachment.s3Key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour

    res.json({ url });
  } catch (error) {
    console.error('Error generating attachment URL:', error);
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
