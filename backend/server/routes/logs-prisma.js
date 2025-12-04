import express from 'express';
import { prisma } from '../database/prisma.js';
import { authenticateToken, requirePermission } from '../middleware/auth-prisma.js';

const router = express.Router();

/**
 * GET /api/logs
 * Get all logs (Super Admin only)
 */
router.get('/',
  authenticateToken,
  async (req, res) => {
    try {
      // Check if user is super admin (clientId === null)
      if (req.user.clientId !== null) {
        return res.status(403).json({
          error: 'Access denied. Only super administrators can view logs.'
        });
      }

      const {
        page = 1,
        limit = 10,
        sortBy = 'timestamp',
        sortOrder = 'desc',
        search = '',
        eventType = '',
        entity = '',
        status = ''
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Build where clause for filtering
      const where = {};

      // Search across multiple fields
      if (search) {
        where.OR = [
          { id: { contains: search, mode: 'insensitive' } },
          { userId: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { entity: { contains: search, mode: 'insensitive' } },
        ];
      }

      // Filter by eventType
      if (eventType) {
        where.eventType = eventType;
      }

      // Filter by entity
      if (entity) {
        where.entity = entity;
      }

      // Filter by status
      if (status) {
        where.status = status;
      }

      // Get total count
      const totalCount = await prisma.log.count({ where });

      // Get logs with pagination
      const logs = await prisma.log.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: {
          [sortBy]: sortOrder.toLowerCase()
        }
      });

      res.json({
        data: logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      });

    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  }
);

/**
 * GET /api/logs/:id
 * Get a specific log by ID (Super Admin only)
 */
router.get('/:id',
  authenticateToken,
  async (req, res) => {
    try {
      // Check if user is super admin
      if (req.user.clientId !== null) {
        return res.status(403).json({
          error: 'Access denied. Only super administrators can view logs.'
        });
      }

      const { id } = req.params;

      const log = await prisma.log.findUnique({
        where: { id }
      });

      if (!log) {
        return res.status(404).json({ error: 'Log not found' });
      }

      res.json({ data: log });

    } catch (error) {
      console.error('Error fetching log:', error);
      res.status(500).json({ error: 'Failed to fetch log' });
    }
  }
);

/**
 * POST /api/logs
 * Create a new log entry
 */
router.post('/',
  authenticateToken,
  async (req, res) => {
    try {
      const { userId, eventType, entity, description, status = 'SUCCESS' } = req.body;

      // Validate required fields
      if (!userId || !eventType || !entity || !description) {
        return res.status(400).json({
          error: 'Missing required fields: userId, eventType, entity, description'
        });
      }

      const log = await prisma.log.create({
        data: {
          userId,
          eventType,
          entity,
          description,
          status
        }
      });

      res.status(201).json({ data: log });

    } catch (error) {
      console.error('Error creating log:', error);
      res.status(500).json({ error: 'Failed to create log' });
    }
  }
);

/**
 * DELETE /api/logs/:id
 * Delete a log entry (Super Admin only)
 */
router.delete('/:id',
  authenticateToken,
  async (req, res) => {
    try {
      // Check if user is super admin
      if (req.user.clientId !== null) {
        return res.status(403).json({
          error: 'Access denied. Only super administrators can delete logs.'
        });
      }

      const { id } = req.params;

      await prisma.log.delete({
        where: { id }
      });

      res.json({ message: 'Log deleted successfully' });

    } catch (error) {
      console.error('Error deleting log:', error);
      res.status(500).json({ error: 'Failed to delete log' });
    }
  }
);

export default router;
