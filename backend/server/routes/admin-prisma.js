import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { prisma } from '../database/prisma.js';
import { authenticateToken } from '../middleware/auth-prisma.js';
import { generateDownloadUrl, generateUploadUrl, generateReportKey, getBucketName } from '../services/s3.js';
import { 
  userValidation, 
  clientValidation, 
  roleValidation, 
  validateId,
  validateClientQuery,
  sanitizeInput 
} from '../middleware/validation.js';
import { cache, CACHE_TYPES, invalidateClientCache, invalidatePatternCache } from '../middleware/cache.js';

const router = express.Router();

// Middleware to check if user has admin permissions for clients
const requireAdminClients = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!req.user.permissions || !req.user.permissions.includes('admin_clients')) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

// Middleware to check if user has admin permissions for users
const requireAdminUsers = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!req.user.permissions ||
      !(req.user.permissions.includes('admin_users') || req.user.permissions.includes('admin_clients'))) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};

// Apply authentication to all admin routes
router.use(authenticateToken);

// ============================================
// CLIENT MANAGEMENT ENDPOINTS
// ============================================

// GET /api/admin/clients - List all clients
router.get('/clients', requireAdminClients, cache({ type: CACHE_TYPES.MEDIUM, keyPrefix: 'clients' }), async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      include: {
        _count: {
          select: {
            users: true,
            roles: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      clients: clients.map(client => ({
        id: client.id,
        name: client.name,
        isActive: client.isActive,
        isProspect: client.isProspect,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        userCount: client._count.users,
        roleCount: client._count.roles
      }))
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/clients/:id - Get single client
router.get('/clients/:id', requireAdminClients, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            isActive: true
          }
        },
        roles: {
          select: {
            id: true,
            roleName: true,
            description: true
          }
        }
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ client });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/clients - Create new client
router.post('/clients',
  requireAdminClients,
  sanitizeInput(['name']),
  clientValidation.create,
  async (req, res) => {
  try {

    const { name, isProspect } = req.body;

    const client = await prisma.client.create({
      data: {
        name,
        isProspect: isProspect || false,
        isActive: true
      }
    });

    // Invalidate clients cache
    invalidatePatternCache('clients');

    res.status(201).json({ 
      message: 'Client created successfully',
      client 
    });
  } catch (error) {
    console.error('Create client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/clients/:id - Update client
router.put('/clients/:id',
  requireAdminClients,
  sanitizeInput(['name']),
  clientValidation.update,
  async (req, res) => {
  try {

    const { id } = req.params;
    const { name, isActive, isProspect } = req.body;

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        name,
        isActive,
        isProspect
      }
    });

    res.json({ 
      message: 'Client updated successfully',
      client 
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client not found' });
    }
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/clients/:id - Deactivate client
router.delete('/clients/:id', requireAdminClients, validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });

    res.json({ 
      message: 'Client deactivated successfully',
      client 
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Client not found' });
    }
    console.error('Deactivate client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// USER MANAGEMENT ENDPOINTS
// ============================================

// GET /api/admin/users - List users with filters
router.get('/users', requireAdminUsers, validateClientQuery, async (req, res) => {
  try {
    const { clientId } = req.query;

    const where = {};

    // Check if user is BPO Admin (has admin_clients permission)
    const isBPOAdmin = req.user.permissions?.includes('admin_clients');

    if (isBPOAdmin) {
      // BPO Admin can filter by clientId or see all
      if (clientId) {
        where.clientId = parseInt(clientId);
      }
    } else {
      // Client Admin can only see users from their own client
      where.clientId = req.user.clientId;
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        },
        role: {
          select: {
            id: true,
            roleName: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        is_active: user.isActive,
        client_id: user.clientId,
        client_name: user.client.name,
        role_id: user.roleId,
        role_name: user.role?.roleName,
        created_at: user.createdAt,
        last_login: user.lastLogin
      }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/users - Create new user
router.post('/users',
  requireAdminUsers,
  sanitizeInput(['firstName', 'lastName', 'email']),
  userValidation.create,
  async (req, res) => {
  try {

    const { clientId, client_id, email, firstName, lastName, first_name, last_name, roleId, role_id, password } = req.body;

    // Support both camelCase and snake_case field names
    const finalClientId = clientId || client_id;
    const finalFirstName = firstName || first_name;
    const finalLastName = lastName || last_name;
    const finalRoleId = roleId || role_id;

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: parseInt(finalClientId) }
    });
    if (!client) {
      return res.status(400).json({ error: 'Client not found' });
    }

    // Check if role exists and belongs to the client (role is optional)
    let role = null;
    if (finalRoleId) {
      role = await prisma.role.findFirst({
        where: {
          id: parseInt(finalRoleId),
          clientId: parseInt(finalClientId)
        }
      });
      if (!role) {
        return res.status(400).json({ error: 'Role not found or does not belong to this client' });
      }
    }

    // Hash password with configurable rounds
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        clientId: parseInt(finalClientId),
        email,
        firstName: finalFirstName,
        lastName: finalLastName,
        roleId: finalRoleId ? parseInt(finalRoleId) : null,
        passwordHash,
        isActive: true
      },
      include: {
        client: {
          select: {
            name: true
          }
        },
        role: {
          select: {
            roleName: true
          }
        }
      }
    });

    // Remove password hash from response
    const { passwordHash: _, ...userResponse } = user;

    res.status(201).json({ 
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/users/:id - Update user
router.put('/users/:id',
  requireAdminUsers,
  sanitizeInput(['firstName', 'lastName', 'email']),
  userValidation.update,
  async (req, res) => {
  try {

    const { id } = req.params;
    const { firstName, lastName, first_name, last_name, roleId, role_id, isActive, is_active, clientId, client_id, email } = req.body;

    // Build update data object dynamically, accepting both camelCase and snake_case
    const updateData = {};
    if (firstName !== undefined || first_name !== undefined) updateData.firstName = firstName || first_name;
    if (lastName !== undefined || last_name !== undefined) updateData.lastName = lastName || last_name;
    if (roleId !== undefined || role_id !== undefined) updateData.roleId = roleId ? parseInt(roleId) : (role_id ? parseInt(role_id) : null);
    if (isActive !== undefined || is_active !== undefined) updateData.isActive = isActive !== undefined ? isActive : is_active;
    if (clientId !== undefined || client_id !== undefined) updateData.clientId = clientId ? parseInt(clientId) : parseInt(client_id);
    if (email !== undefined) updateData.email = email;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        client: {
          select: {
            name: true
          }
        },
        role: {
          select: {
            roleName: true
          }
        }
      }
    });

    // Remove password hash from response
    const { passwordHash: _, ...userResponse } = user;

    res.json({ 
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/users/:id - Deactivate user
router.delete('/users/:id', requireAdminUsers, validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isActive: false }
    });

    res.json({ 
      message: 'User deactivated successfully'
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    console.error('Deactivate user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// ROLE MANAGEMENT ENDPOINTS
// ============================================

// GET /api/admin/roles - List roles by client
router.get('/roles', requireAdminUsers, async (req, res) => {
  try {
    const { clientId } = req.query;

    const where = {};

    // Check if user is BPO Admin (has admin_clients permission)
    const isBPOAdmin = req.user.permissions?.includes('admin_clients');

    if (isBPOAdmin) {
      // BPO Admin can filter by clientId or see all
      if (clientId) {
        where.clientId = parseInt(clientId);
      }
    } else {
      // Client Admin can only see roles from their own client
      where.clientId = req.user.clientId;
    }

    const roles = await prisma.role.findMany({
      where,
      include: {
        client: {
          select: {
            name: true
          }
        },
        rolePermissions: {
          include: {
            permission: {
              select: {
                id: true,
                permissionName: true,
                description: true
              }
            }
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      roles: roles.map(role => ({
        id: role.id,
        clientId: role.clientId,
        clientName: role.client.name,
        roleName: role.roleName,
        description: role.description,
        permissions: role.rolePermissions.map(rp => rp.permission),
        userCount: role._count.users,
        createdAt: role.createdAt
      }))
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/roles - Create new role
router.post('/roles', 
  sanitizeInput(['roleName', 'description']), 
  roleValidation.create, 
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, roleName, description, permissionIds } = req.body;

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: parseInt(clientId) }
    });
    if (!client) {
      return res.status(400).json({ error: 'Client not found' });
    }

    // Create role and assign permissions in a transaction
    const role = await prisma.$transaction(async (tx) => {
      // Create role
      const newRole = await tx.role.create({
        data: {
          clientId: parseInt(clientId),
          roleName,
          description: description || null
        }
      });

      // Assign permissions if provided
      if (permissionIds && permissionIds.length > 0) {
        const rolePermissions = permissionIds.map(permissionId => ({
          roleId: newRole.id,
          permissionId: parseInt(permissionId)
        }));

        await tx.rolePermission.createMany({
          data: rolePermissions
        });
      }

      return newRole;
    });

    res.status(201).json({ 
      message: 'Role created successfully',
      role 
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Role name already exists for this client' });
    }
    console.error('Create role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/roles/:id - Update role information (name, description)
router.put('/roles/:id', [
  body('roleName').optional().trim().isLength({ min: 1 }).withMessage('Role name is required'),
  body('description').optional().trim(),
  body('clientId').optional().isInt({ min: 1 }).withMessage('Valid client ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { roleName, description, clientId } = req.body;

    // Build update data dynamically
    const updateData = {};
    if (roleName !== undefined) updateData.roleName = roleName;
    if (description !== undefined) updateData.description = description;
    if (clientId !== undefined) updateData.clientId = parseInt(clientId);

    const updatedRole = await prisma.role.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            users: true,
            rolePermissions: true
          }
        }
      }
    });

    res.json({
      id: updatedRole.id,
      roleName: updatedRole.roleName,
      description: updatedRole.description,
      clientId: updatedRole.clientId,
      clientName: updatedRole.client.name,
      permissionsCount: updatedRole._count.rolePermissions,
      createdAt: updatedRole.createdAt
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Role not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Role name already exists for this client' });
    }
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/roles/:id/permissions - Get permissions for a specific role
router.get('/roles/:id/permissions', async (req, res) => {
  try {
    const { id } = req.params;

    // Get role with its permissions
    const role = await prisma.role.findUnique({
      where: { id: parseInt(id) },
      include: {
        rolePermissions: {
          include: {
            permission: {
              select: {
                id: true,
                permissionName: true,
                description: true
              }
            }
          }
        }
      }
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json({
      permissions: role.rolePermissions.map(rp => ({
        permissionId: rp.permission.id,
        permissionName: rp.permission.permissionName,
        description: rp.permission.description
      }))
    });
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/roles/:id/permissions - Update role permissions
router.put('/roles/:id/permissions', [
  body('permissions').isArray().withMessage('Permission IDs must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { permissions: permissionIds } = req.body;

    console.log('Updating permissions for role ID:', id);
    console.log('Permission IDs:', permissionIds);

    await prisma.$transaction(async (tx) => {
      // Remove existing permissions
      await tx.rolePermission.deleteMany({
        where: { roleId: parseInt(id) }
      });

      // Add new permissions
      if (permissionIds && permissionIds.length > 0) {
        const rolePermissions = permissionIds.map(permissionId => ({
          roleId: parseInt(id),
          permissionId: parseInt(permissionId)
        }));

        console.log('Creating role permissions:', rolePermissions);

        await tx.rolePermission.createMany({
          data: rolePermissions
        });
      }
    });

    res.json({
      message: 'Role permissions updated successfully'
    });
  } catch (error) {
    console.error('Update role permissions error:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// DELETE /api/admin/roles/:id - Delete a role
router.delete('/roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if role exists
    const role = await prisma.role.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Prevent deletion if role has users assigned
    if (role._count.users > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete role with assigned users. Please reassign users first.' 
      });
    }

    // Prevent deletion of system roles
    if (role.roleName === 'BPO Admin' || role.roleName === 'Client Admin') {
      return res.status(400).json({ 
        error: 'Cannot delete system roles' 
      });
    }

    // Delete role (this will cascade delete role permissions)
    await prisma.role.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Role not found' });
    }
    console.error('Delete role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/permissions - List all available permissions
router.get('/permissions', cache({ type: CACHE_TYPES.LONG, keyPrefix: 'permissions' }), async (req, res) => {
  try {
    const permissions = await prisma.permission.findMany({
      orderBy: {
        permissionName: 'asc'
      }
    });

    res.json({ permissions });
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================
// REPORTS MANAGEMENT ENDPOINTS
// ============================================

// GET /api/admin/reports - List reports for a client
router.get('/reports', async (req, res) => {
  try {
    const { clientId } = req.query;
    const where = {};
    
    // If user is not BPO Admin, filter by their client
    if (!req.user.permissions.includes('admin_clients')) {
      where.clientId = req.user.clientId;
    } else if (clientId) {
      where.clientId = parseInt(clientId);
    }

    const reports = await prisma.report.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        generatedAt: 'desc'
      }
    });

    res.json({ 
      reports: reports.map(report => ({
        id: report.id,
        name: report.name,
        description: report.description,
        type: report.type,
        clientId: report.clientId,
        clientName: report.client.name,
        fileSize: report.fileSize,
        mimeType: report.mimeType,
        generatedAt: report.generatedAt,
        createdAt: report.createdAt
      }))
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/reports - Create a new report record
router.post('/reports', [
  body('clientId').isInt({ min: 1 }).withMessage('Valid client ID is required'),
  body('name').trim().isLength({ min: 1 }).withMessage('Report name is required'),
  body('type').isIn(['daily', 'weekly', 'monthly', 'custom']).withMessage('Valid report type is required'),
  body('generatedAt').isISO8601().withMessage('Valid generation date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, name, description, type, generatedAt } = req.body;

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: parseInt(clientId) }
    });
    if (!client) {
      return res.status(400).json({ error: 'Client not found' });
    }

    // Generate S3 key
    const date = new Date(generatedAt).toISOString().split('T')[0]; // YYYY-MM-DD
    const s3Key = generateReportKey(clientId, name, date);
    const s3Bucket = getBucketName();

    // Create report record
    const report = await prisma.report.create({
      data: {
        clientId: parseInt(clientId),
        name,
        description: description || null,
        type,
        s3Key,
        s3Bucket,
        generatedAt: new Date(generatedAt)
      },
      include: {
        client: {
          select: {
            name: true
          }
        }
      }
    });

    // Generate upload URL for the frontend to upload the file
    const uploadUrl = await generateUploadUrl(s3Key, 'application/pdf');

    res.status(201).json({
      message: 'Report record created successfully',
      report: {
        id: report.id,
        name: report.name,
        description: report.description,
        type: report.type,
        clientId: report.clientId,
        clientName: report.client.name,
        s3Key: report.s3Key,
        uploadUrl // Frontend can use this to upload the file
      }
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/reports/:id/download - Generate download URL
router.get('/reports/:id/download', async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id: parseInt(id) },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Check permissions: users can only download reports from their own client
    if (!req.user.permissions.includes('admin_clients') && report.clientId !== req.user.clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if user has download_reports permission
    if (!req.user.permissions.includes('download_reports')) {
      return res.status(403).json({ error: 'Download permission required' });
    }

    // Generate pre-signed download URL
    const downloadUrl = await generateDownloadUrl(report.s3Key, report.s3Bucket);

    res.json({
      downloadUrl,
      expiresIn: 3600, // 1 hour
      fileName: `${report.name}.pdf`
    });
  } catch (error) {
    console.error('Generate download URL error:', error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

// DELETE /api/admin/reports/:id - Delete a report
router.delete('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const report = await prisma.report.findUnique({
      where: { id: parseInt(id) }
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    // Check permissions
    if (!req.user.permissions.includes('admin_clients') && report.clientId !== req.user.clientId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete from database
    await prisma.report.delete({
      where: { id: parseInt(id) }
    });

    // Note: For production, you might want to also delete the S3 object
    // const deleteCommand = new DeleteObjectCommand({
    //   Bucket: report.s3Bucket,
    //   Key: report.s3Key,
    // });
    // await s3Client.send(deleteCommand);

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;