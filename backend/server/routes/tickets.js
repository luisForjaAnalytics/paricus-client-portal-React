import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth-prisma.js';

const router = express.Router();
const prisma = new PrismaClient();

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
    });

    if (!existingTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Delete ticket (descriptions will be cascade deleted)
    await prisma.ticket.delete({
      where: { id },
    });

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
