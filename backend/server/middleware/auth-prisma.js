import jwt from 'jsonwebtoken';
import { prisma } from '../database/prisma.js';
import { getCachedUser, cacheUser, invalidateUserSession } from './cache.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try to get user from cache first
    let user = getCachedUser(decoded.userId);
    
    if (!user) {
      // Get user with role and permissions using Prisma
      user = await prisma.user.findUnique({
        where: { 
          id: decoded.userId,
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
      
      // Cache the user data if found
      if (user) {
        cacheUser(decoded.userId, user);
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Transform user data to match expected format with consistent naming
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      clientId: user.clientId,
      clientName: user.client.name,
      roleId: user.roleId,
      roleName: user.role?.roleName,
      permissions: user.role?.rolePermissions.map(rp => rp.permission.permissionName) || []
    };
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireRole = (roleName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.roleName !== roleName) {
      return res.status(403).json({ error: 'Insufficient role permissions' });
    }

    next();
  };
};