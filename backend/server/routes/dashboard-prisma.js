import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { authenticateToken, requirePermission } from '../middleware/auth-prisma.js';
import { prisma } from '../database/prisma.js';

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for local file storage (temporary, until S3 is set up)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/announcements');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /pdf|doc|docx|xls|xlsx|ppt|pptx|txt|jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Office docs, images, and text files are allowed.'));
    }
  }
});

/**
 * Helper function to verify token from query parameter or header
 */
function authenticateTokenFlexible(req, res, next) {
  try {
    // Try to get token from query parameter first (for direct file access)
    let token = req.query.token;

    // If not in query, try Authorization header (for API calls)
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1];
    }

    if (!token) {
      console.log('❌ No token provided in request');
      return res.status(401).json({ error: 'No token provided' });
    }

    console.log('🔑 Token received, verifying...');

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('❌ Token verification error:', err.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      console.log('✅ Token verified successfully');
      req.user = {
        userId: decoded.userId,
        clientId: decoded.clientId,
        roleId: decoded.roleId,
        permissions: decoded.permissions || []
      };

      next();
    });
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}

/**
 * GET /api/dashboard/stats
 * Returns aggregated statistics for the main dashboard
 *
 * Authorization:
 * - BPO Admin: sees ALL data across all clients
 * - Client Admin/User: sees only THEIR client's data
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { clientId, permissions } = req.user;

    // Determine if user is BPO Admin
    const isBPOAdmin = permissions.includes('admin_clients');

    // Where clause for filtering by client
    const whereClause = isBPOAdmin ? {} : { clientId };

    // ==================== PARALLEL QUERIES ====================
    const [
      // 1. Financial stats (invoices)
      invoiceStats,
      previousMonthInvoices,

      // 2. Ticket stats
      allTickets,
      ticketsByClient,

      // 3. Client count
      activeClientCount,

      // 4. Knowledge base articles
      articleCount,
      recentArticles,
    ] = await Promise.all([
      // 1a. Current invoices total
      prisma.invoice.aggregate({
        where: {
          ...whereClause,
          createdAt: {
            gte: new Date(new Date().getFullYear(), 0, 1), // This year
          },
        },
        _sum: { amount: true },
        _count: true,
      }),

      // 1b. Previous month invoices (for percentage change)
      prisma.invoice.aggregate({
        where: {
          ...whereClause,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { amount: true },
      }),

      // 2a. All tickets for status breakdown
      prisma.ticket.findMany({
        where: whereClause,
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      // 2b. Tickets grouped by client
      prisma.ticket.groupBy({
        by: ['clientId'],
        where: isBPOAdmin ? {} : whereClause,
        _count: true,
      }),

      // 3. Active client count
      isBPOAdmin
        ? prisma.client.count({ where: { isActive: true } })
        : 1, // Client users only see their own client

      // 4a. Total articles
      prisma.knowledgeBase.count({
        where: {
          ...whereClause,
          isActive: true,
        },
      }),

      // 4b. Recent articles (last 7 days) for badge
      prisma.knowledgeBase.count({
        where: {
          ...whereClause,
          isActive: true,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    // ==================== CALCULATE METRICS ====================

    // Financial metrics
    const portfolioRevenue = invoiceStats._sum.amount || 0;
    const previousRevenue = previousMonthInvoices._sum.amount || 0;
    const revenueChange =
      previousRevenue > 0
        ? ((portfolioRevenue - previousRevenue) / previousRevenue) * 100
        : portfolioRevenue > 0
        ? 100
        : 0;

    // Ticket metrics
    const totalTickets = allTickets.length;
    const urgentTickets = allTickets.filter(
      (t) => t.priority === 'High' || t.priority === 'Urgent'
    ).length;

    // Ticket status breakdown
    const ticketLifecycle = {
      open: allTickets.filter((t) => t.status === 'Open').length,
      inProgress: allTickets.filter((t) => t.status === 'In Progress').length,
      resolved: allTickets.filter((t) => t.status === 'Resolved').length,
      closed: allTickets.filter((t) => t.status === 'Closed').length,
    };

    // Get client information for ticket distribution
    const clients = await prisma.client.findMany({
      where: isBPOAdmin ? { isActive: true } : { id: clientId },
      select: { id: true, name: true },
    });

    // Map tickets by client
    const ticketsBySegment = clients.map((client) => {
      const clientTickets = allTickets.filter((t) => t.clientId === client.id);
      return {
        clientId: client.id,
        clientName: client.name,
        count: clientTickets.length,
        percentage:
          totalTickets > 0
            ? Math.round((clientTickets.length / totalTickets) * 100)
            : 0,
      };
    });

    // Articles badge
    const articlesBadge = recentArticles > 0 ? `+${recentArticles} NEW` : null;

    // ==================== RESPONSE ====================
    res.json({
      success: true,
      data: {
        // Top cards
        portfolioRevenue: parseFloat(portfolioRevenue.toFixed(2)),
        revenueChange: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%`,
        totalArticles: articleCount,
        articlesBadge: articlesBadge,
        urgentAlerts: urgentTickets,
        activeClients: activeClientCount,

        // Tickets distribution by client
        ticketsBySegment,
        totalTickets,

        // Ticket lifecycle
        ticketLifecycle,

        // Recent invoices count
        recentInvoicesCount: invoiceStats._count,

        // Metadata
        lastUpdated: new Date().toISOString(),
        isBPOAdmin,
      },
    });
  } catch (error) {
    console.error('❌ Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching dashboard statistics',
      message: error.message,
    });
  }
});

/**
 * DEPRECATED: This endpoint is no longer used
 * Articles are now fetched from external API in frontend using articlesApi
 *
 * GET /api/dashboard/recent-articles
 * Returns last 3 knowledge base articles
 *
 * Authorization:
 * - Returns public articles or articles from user's client
 */
/*
router.get('/recent-articles', authenticateToken, async (req, res) => {
  try {
    const { clientId, permissions } = req.user;
    const isBPOAdmin = permissions.includes('admin_clients');

    // Build where clause based on role
    const whereClause = {
      isActive: true,
      OR: [
        { isPublic: true },
        ...(isBPOAdmin ? [{}] : [{ clientId }])
      ]
    };

    const articles = await prisma.knowledgeBase.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
        viewCount: true,
      }
    });

    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error('❌ Recent articles error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching recent articles',
      message: error.message,
    });
  }
});
*/

/**
 * GET /api/dashboard/recent-recordings
 * Returns last 3 recordings based on user role
 *
 * Authorization:
 * - BPO Admin: last 3 recordings from ALL companies
 * - Client Admin/User: last 3 recordings from THEIR company
 */
router.get('/recent-recordings', authenticateToken, async (req, res) => {
  try {
    const { clientId, permissions } = req.user;

    // Determine if user is BPO Admin
    const isBPOAdmin = permissions.includes('admin_clients');

    // Get company name for filtering (null for BPO Admin)
    let companyFilter = null;
    if (!isBPOAdmin && clientId) {
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        select: { name: true }
      });

      if (client) {
        // Map client names to company filter names used in MSSQL
        const clientNameMap = {
          'Flex Mobile': 'Flex Mobile',
          'IM Telecom': 'IM Telecom',
          'North American Local': 'Tempo Wireless',
        };
        companyFilter = clientNameMap[client.name] || null;
      }
    }

    // Import the MSSQL service function
    const { getCallRecordings } = await import('../services/mssql.js');

    // Build filters object
    const filters = {};
    if (companyFilter) {
      filters.company = companyFilter;
    }

    // Query last 3 recordings from MSSQL
    // Function signature: getCallRecordings(filters = {}, limit = 100, offset = 0)
    const result = await getCallRecordings(filters, 3, 0);

    res.json({
      success: true,
      data: result.recordings || [],
    });
  } catch (error) {
    console.error('❌ Recent recordings error:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching recent recordings',
      message: error.message,
    });
  }
});

// ========================================
// CREATE ANNOUNCEMENT (BPO Admin Only)
// ========================================
router.post(
  '/announcements',
  authenticateToken,
  requirePermission('admin_dashboard_config'),
  async (req, res) => {
    try {
      const { title, content, priority, clientIds } = req.body;

      // Validation
      if (!title || !content || !priority) {
        return res.status(400).json({
          error: 'Title, content, and priority are required'
        });
      }

      if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
        return res.status(400).json({
          error: 'At least one client must be selected'
        });
      }

      if (!['low', 'medium', 'high'].includes(priority)) {
        return res.status(400).json({
          error: 'Priority must be low, medium, or high'
        });
      }

      // Create announcement with recipients
      // Note: attachments will be added separately via the upload endpoint
      const announcement = await prisma.announcement.create({
        data: {
          title,
          content,
          priority,
          recipients: {
            create: clientIds.map(clientId => ({
              clientId: parseInt(clientId)
            }))
          }
        },
        include: {
          recipients: {
            include: {
              client: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Announcement created successfully',
        data: announcement
      });
    } catch (error) {
      console.error('❌ Error creating announcement:', error);
      res.status(500).json({
        success: false,
        error: 'Error creating announcement',
        message: error.message
      });
    }
  }
);

// ========================================
// GET ANNOUNCEMENTS
// ========================================
router.get(
  '/announcements',
  authenticateToken,
  async (req, res) => {
    try {
      const { clientId, permissions } = req.user;
      const isBPOAdmin = permissions.includes('admin_clients');

      let announcements;

      if (isBPOAdmin) {
        // BPO Admin can see ALL announcements
        announcements = await prisma.announcement.findMany({
          include: {
            recipients: {
              include: {
                client: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            attachments: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      } else {
        // Client users (Admin or regular) can only see announcements for their client
        announcements = await prisma.announcement.findMany({
          where: {
            recipients: {
              some: {
                clientId: clientId
              }
            }
          },
          include: {
            recipients: {
              include: {
                client: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            attachments: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
      }

      // Add URLs to attachments
      // NOTE: URL must include /api prefix (same pattern as tickets)
      const announcementsWithUrls = announcements.map(announcement => ({
        ...announcement,
        attachments: announcement.attachments.map(att => ({
          ...att,
          url: `/api/dashboard/announcements/${announcement.id}/attachments/${att.id}/file`
        }))
      }));

      res.json({
        success: true,
        data: announcementsWithUrls,
        count: announcementsWithUrls.length
      });
    } catch (error) {
      console.error('❌ Error fetching announcements:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching announcements',
        message: error.message
      });
    }
  }
);

// ========================================
// GET SINGLE ANNOUNCEMENT
// ========================================
router.get(
  '/announcements/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { clientId, permissions } = req.user;
      const isBPOAdmin = permissions.includes('admin_clients');

      const announcement = await prisma.announcement.findUnique({
        where: { id },
        include: {
          recipients: {
            include: {
              client: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          attachments: true
        }
      });

      if (!announcement) {
        return res.status(404).json({
          success: false,
          error: 'Announcement not found'
        });
      }

      // Check if user has access to this announcement
      if (!isBPOAdmin) {
        const hasAccess = announcement.recipients.some(
          recipient => recipient.clientId === clientId
        );

        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            error: 'You do not have access to this announcement'
          });
        }
      }

      // Add URLs to attachments
      // NOTE: URL must include /api prefix (same pattern as tickets)
      const announcementWithUrls = {
        ...announcement,
        attachments: announcement.attachments.map(att => ({
          ...att,
          url: `/api/dashboard/announcements/${announcement.id}/attachments/${att.id}/file`
        }))
      };

      res.json({
        success: true,
        data: announcementWithUrls
      });
    } catch (error) {
      console.error('❌ Error fetching announcement:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching announcement',
        message: error.message
      });
    }
  }
);

// ========================================
// DELETE ANNOUNCEMENT (BPO Admin Only)
// ========================================
router.delete(
  '/announcements/:id',
  authenticateToken,
  requirePermission('admin_dashboard_config'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const announcement = await prisma.announcement.findUnique({
        where: { id }
      });

      if (!announcement) {
        return res.status(404).json({
          success: false,
          error: 'Announcement not found'
        });
      }

      await prisma.announcement.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Announcement deleted successfully',
        data: announcement
      });
    } catch (error) {
      console.error('❌ Error deleting announcement:', error);
      res.status(500).json({
        success: false,
        error: 'Error deleting announcement',
        message: error.message
      });
    }
  }
);

// ========================================
// UPLOAD ANNOUNCEMENT ATTACHMENT (BPO Admin Only)
// ========================================
router.post(
  '/announcements/:announcementId/attachments',
  authenticateToken,
  requirePermission('admin_dashboard_config'),
  upload.single('file'),
  async (req, res) => {
    try {
      const { announcementId } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Check if announcement exists
      const announcement = await prisma.announcement.findUnique({
        where: { id: announcementId }
      });

      if (!announcement) {
        // Delete uploaded file
        fs.unlinkSync(file.path);
        return res.status(404).json({
          success: false,
          error: 'Announcement not found'
        });
      }

      // Create attachment record
      const attachment = await prisma.announcementAttachment.create({
        data: {
          announcementId,
          fileName: file.originalname,
          s3Key: file.filename, // For now, store local filename
          s3Bucket: 'local', // Mark as local storage
          fileSize: file.size,
          mimeType: file.mimetype,
        }
      });

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: attachment
      });
    } catch (error) {
      console.error('❌ Error uploading attachment:', error);
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({
        success: false,
        error: 'Error uploading attachment',
        message: error.message
      });
    }
  }
);

// ========================================
// GET ANNOUNCEMENT ATTACHMENTS
// ========================================
router.get(
  '/announcements/:announcementId/attachments',
  authenticateToken,
  async (req, res) => {
    try {
      const { announcementId } = req.params;
      const { clientId, permissions } = req.user;
      const isBPOAdmin = permissions.includes('admin_clients');

      // Check if user has access to this announcement
      const announcement = await prisma.announcement.findUnique({
        where: { id: announcementId },
        include: {
          recipients: true,
          attachments: true
        }
      });

      if (!announcement) {
        return res.status(404).json({
          success: false,
          error: 'Announcement not found'
        });
      }

      // Check access
      if (!isBPOAdmin) {
        const hasAccess = announcement.recipients.some(
          recipient => recipient.clientId === clientId
        );
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            error: 'You do not have access to this announcement'
          });
        }
      }

      // Add URLs to attachments
      // NOTE: URL must include /api prefix (same pattern as tickets)
      const attachmentsWithUrls = announcement.attachments.map(att => ({
        ...att,
        url: `/api/dashboard/announcements/${announcementId}/attachments/${att.id}/file`
      }));

      res.json({
        success: true,
        data: attachmentsWithUrls
      });
    } catch (error) {
      console.error('❌ Error fetching attachments:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching attachments',
        message: error.message
      });
    }
  }
);

// ========================================
// SERVE ANNOUNCEMENT ATTACHMENT FILE
// ========================================
router.get(
  '/announcements/:announcementId/attachments/:attachmentId/file',
  authenticateTokenFlexible,
  async (req, res) => {
    try {
      const { announcementId, attachmentId } = req.params;
      const { clientId, permissions } = req.user;
      const isBPOAdmin = permissions.includes('admin_clients');

      console.log('🔍 File access request:');
      console.log('   User clientId:', clientId, 'type:', typeof clientId);
      console.log('   User permissions:', permissions);
      console.log('   Is BPO Admin:', isBPOAdmin);

      // Check if user has access to this announcement
      const announcement = await prisma.announcement.findUnique({
        where: { id: announcementId },
        include: {
          recipients: true
        }
      });

      if (!announcement) {
        return res.status(404).json({
          success: false,
          error: 'Announcement not found'
        });
      }

      console.log('   Announcement recipients:', announcement.recipients.map(r => ({
        clientId: r.clientId,
        type: typeof r.clientId
      })));

      // Check access
      if (!isBPOAdmin) {
        // Ensure both values are numbers for comparison
        const userClientId = typeof clientId === 'string' ? parseInt(clientId) : clientId;
        const hasAccess = announcement.recipients.some(
          recipient => recipient.clientId === userClientId
        );

        console.log('   User clientId (normalized):', userClientId);
        console.log('   Has access:', hasAccess);

        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            error: 'You do not have access to this announcement'
          });
        }
      }

      // Get attachment
      const attachment = await prisma.announcementAttachment.findFirst({
        where: {
          id: parseInt(attachmentId),
          announcementId
        }
      });

      if (!attachment) {
        return res.status(404).json({
          success: false,
          error: 'Attachment not found'
        });
      }

      // Serve file from local storage
      const filePath = path.join(__dirname, '../uploads/announcements', attachment.s3Key);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          error: 'File not found on disk'
        });
      }

      // Set headers and send file
      res.setHeader('Content-Type', attachment.mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${attachment.fileName}"`);
      res.sendFile(filePath);
    } catch (error) {
      console.error('❌ Error serving attachment:', error);
      res.status(500).json({
        success: false,
        error: 'Error serving attachment',
        message: error.message
      });
    }
  }
);

// ========================================
// DELETE ANNOUNCEMENT ATTACHMENT (BPO Admin Only)
// ========================================
router.delete(
  '/announcements/:announcementId/attachments/:attachmentId',
  authenticateToken,
  requirePermission('admin_dashboard_config'),
  async (req, res) => {
    try {
      const { announcementId, attachmentId } = req.params;

      // Get attachment
      const attachment = await prisma.announcementAttachment.findFirst({
        where: {
          id: parseInt(attachmentId),
          announcementId
        }
      });

      if (!attachment) {
        return res.status(404).json({
          success: false,
          error: 'Attachment not found'
        });
      }

      // Delete file from disk
      const filePath = path.join(__dirname, '../uploads/announcements', attachment.s3Key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete database record
      await prisma.announcementAttachment.delete({
        where: { id: parseInt(attachmentId) }
      });

      res.json({
        success: true,
        message: 'Attachment deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting attachment:', error);
      res.status(500).json({
        success: false,
        error: 'Error deleting attachment',
        message: error.message
      });
    }
  }
);

export default router;
