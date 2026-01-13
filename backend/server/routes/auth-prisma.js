import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../database/prisma.js';
import { authenticateToken } from '../middleware/auth-prisma.js';
import { sendPasswordResetEmail } from '../utils/email.js';
import { authValidation, sanitizeInput } from '../middleware/validation.js';
import { logLogin, logLogout } from '../services/logger.js';
import config from '../config/environment.js';

const router = express.Router();

// Login endpoint
router.post('/login', 
  sanitizeInput(['email']), 
  authValidation.login, 
  async (req, res) => {
  try {

    const { email, password } = req.body;

    // Get user with role and permissions using Prisma
    const user = await prisma.user.findUnique({
      where: { 
        email: email,
        isActive: true
      },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        },
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: {
                  select: {
                    permissionName: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      console.log('❌ User not found for email:', email);
      // Log failed login attempt
      await logLogin(null, email, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ User found:', user.email);
    console.log('🔑 Password hash from DB:', user.passwordHash.substring(0, 20) + '...');

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    console.log('🔐 Password validation result:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', user.email);
      // Log failed login attempt
      await logLogin(user.id, email, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Login successful for:', user.email);

    // Update last login (disabled temporarily due to SQLite timeout issues)
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { lastLogin: new Date() }
    // });

    // Extract permissions
    const permissions = user.role?.rolePermissions.map(rp => rp.permission.permissionName) || [];

    // Generate JWT token with all necessary user data
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        clientId: user.clientId,
        roleId: user.roleId,
        permissions
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Log successful login
    await logLogin(user.id, email, true);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        clientId: user.clientId,
        clientName: user.client?.name || null,
        roleId: user.roleId,
        roleName: user.role?.roleName,
        permissions: permissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password endpoint
router.post('/forgot-password', 
  sanitizeInput(['email']), 
  authValidation.forgotPassword, 
  async (req, res) => {
  try {

    const { email } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { 
        email: email,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        firstName: true
      }
    });
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If the email exists, a password reset link has been sent.' });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetTokenExpires
      }
    });

    // Send password reset email
    await sendPasswordResetEmail(user.email, user.firstName, resetToken);

    res.json({ message: 'If the email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password endpoint
router.post('/reset-password', 
  authValidation.resetPassword, 
  async (req, res) => {
  try {

    const { token, password } = req.body;

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date()
        },
        isActive: true
      }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash new password with configurable rounds
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date()
      }
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        clientId: req.user.clientId,
        clientName: req.user.clientName,
        roleId: req.user.roleId,
        roleName: req.user.roleName,
        permissions: req.user.permissions || []
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
  // Log logout
  await logLogout(req.user.id, req.user.email);

  res.json({ message: 'Logged out successfully' });
});

export default router;