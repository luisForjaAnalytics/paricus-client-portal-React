import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { query } from '../database/init.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all admin routes
router.use(authenticateToken);

// Get all clients
router.get('/clients', requirePermission('admin_clients'), async (req, res) => {
  try {
    const result = await query(`
      SELECT id, name, is_active, is_prospect, created_at, updated_at
      FROM clients
      ORDER BY name
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new client
router.post('/clients', [
  requirePermission('admin_clients'),
  body('name').trim().isLength({ min: 1 }).withMessage('Client name is required'),
  body('is_prospect').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, is_prospect = false } = req.body;

    const result = await query(`
      INSERT INTO clients (name, is_prospect)
      VALUES ($1, $2)
      RETURNING id, name, is_active, is_prospect, created_at, updated_at
    `, [name, is_prospect]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create client error:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Client name already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update client
router.put('/clients/:id', [
  requirePermission('admin_clients'),
  body('name').trim().isLength({ min: 1 }).withMessage('Client name is required'),
  body('is_active').optional().isBoolean(),
  body('is_prospect').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, is_active, is_prospect } = req.body;

    const result = await query(`
      UPDATE clients 
      SET name = $1, is_active = COALESCE($2, is_active), is_prospect = COALESCE($3, is_prospect), updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, name, is_active, is_prospect, created_at, updated_at
    `, [name, is_active, is_prospect, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update client error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
router.get('/users', requirePermission('admin_users'), async (req, res) => {
  try {
    const { client_id } = req.query;
    
    let queryText = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.client_id, u.role_id, u.is_active, u.created_at, u.updated_at,
        c.name as client_name,
        r.role_name
      FROM users u
      LEFT JOIN clients c ON u.client_id = c.id
      LEFT JOIN roles r ON u.role_id = r.id
    `;
    
    let params = [];
    
    if (client_id) {
      queryText += ' WHERE u.client_id = $1';
      params.push(client_id);
    }
    
    queryText += ' ORDER BY u.created_at DESC';
    
    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new user
router.post('/users', [
  requirePermission('admin_users'),
  body('email').isEmail().normalizeEmail(),
  body('first_name').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('last_name').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('client_id').isInt({ min: 1 }).withMessage('Valid client ID is required'),
  body('role_id').optional().isInt({ min: 1 }),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, first_name, last_name, client_id, role_id, password } = req.body;

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await query(`
      INSERT INTO users (email, first_name, last_name, client_id, role_id, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, first_name, last_name, client_id, role_id, is_active, created_at, updated_at
    `, [email, first_name, last_name, client_id, role_id, password_hash]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Email already exists' });
    } else if (error.code === '23503') { // Foreign key violation
      res.status(400).json({ error: 'Invalid client or role ID' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Update user
router.put('/users/:id', [
  requirePermission('admin_users'),
  body('email').optional().isEmail().normalizeEmail(),
  body('first_name').optional().trim().isLength({ min: 1 }),
  body('last_name').optional().trim().isLength({ min: 1 }),
  body('role_id').optional().isInt({ min: 1 }),
  body('is_active').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { email, first_name, last_name, role_id, is_active } = req.body;

    const result = await query(`
      UPDATE users 
      SET 
        email = COALESCE($1, email),
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        role_id = COALESCE($4, role_id),
        is_active = COALESCE($5, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING id, email, first_name, last_name, client_id, role_id, is_active, created_at, updated_at
    `, [email, first_name, last_name, role_id, is_active, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Get all roles
router.get('/roles', requirePermission('admin_roles'), async (req, res) => {
  try {
    const { client_id } = req.query;
    
    let queryText = `
      SELECT 
        r.id, r.client_id, r.role_name, r.description, r.created_at, r.updated_at,
        c.name as client_name,
        ARRAY_AGG(p.permission_name) as permissions
      FROM roles r
      LEFT JOIN clients c ON r.client_id = c.id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
    `;
    
    let params = [];
    
    if (client_id) {
      queryText += ' WHERE r.client_id = $1';
      params.push(client_id);
    }
    
    queryText += ' GROUP BY r.id, c.name ORDER BY r.role_name';
    
    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all permissions
router.get('/permissions', requirePermission('admin_roles'), async (req, res) => {
  try {
    const result = await query(`
      SELECT id, permission_name, description
      FROM permissions
      ORDER BY permission_name
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new role
router.post('/roles', [
  requirePermission('admin_roles'),
  body('client_id').isInt({ min: 1 }).withMessage('Valid client ID is required'),
  body('role_name').trim().isLength({ min: 1 }).withMessage('Role name is required'),
  body('description').optional().trim(),
  body('permissions').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { client_id, role_name, description, permissions = [] } = req.body;

    // Start transaction
    const client = await query('BEGIN');

    try {
      // Create role
      const roleResult = await query(`
        INSERT INTO roles (client_id, role_name, description)
        VALUES ($1, $2, $3)
        RETURNING id, client_id, role_name, description, created_at, updated_at
      `, [client_id, role_name, description]);

      const role = roleResult.rows[0];

      // Assign permissions
      if (permissions.length > 0) {
        const permissionValues = permissions.map((permId, index) => 
          `($1, $${index + 2})`
        ).join(', ');
        
        await query(`
          INSERT INTO role_permissions (role_id, permission_id)
          VALUES ${permissionValues}
        `, [role.id, ...permissions]);
      }

      await query('COMMIT');
      res.status(201).json(role);
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Create role error:', error);
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Role name already exists for this client' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;

// Update role permissions endpoint
router.put('/roles/:id/permissions', [
  requirePermission('admin_roles'),
  body('permissions').isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { permissions } = req.body;

    // Start transaction
    const client = await query('BEGIN');

    try {
      // Remove existing permissions
      await query('DELETE FROM role_permissions WHERE role_id = $1', [id]);

      // Add new permissions
      if (permissions.length > 0) {
        const permissionValues = permissions.map((permId, index) => 
          `($1, $${index + 2})`
        ).join(', ');
        
        await query(`
          INSERT INTO role_permissions (role_id, permission_id)
          VALUES ${permissionValues}
        `, [id, ...permissions]);
      }

      await query('COMMIT');
      res.json({ message: 'Permissions updated successfully' });
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Update role permissions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});