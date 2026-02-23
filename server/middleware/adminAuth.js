import jwt from 'jsonwebtoken';
import { normalizePermissions } from '../config/adminPermissions.js';
import { AdminUser } from '../models/AdminUser.js';

export async function requireAdminAuth(request, response, next) {
  const authHeader = request.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return response.status(401).json({ message: 'Admin token missing' });
  }

  try {
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'admin_secret');

    if (!payload?.adminId) {
      return response.status(403).json({ message: 'Not authorized' });
    }

    const adminUser = await AdminUser.findById(payload.adminId);
    if (!adminUser || !adminUser.active) {
      return response.status(403).json({ message: 'Admin account is inactive' });
    }

    request.admin = {
      adminId: String(adminUser._id),
      username: adminUser.username,
      role: adminUser.role,
      permissions: normalizePermissions(adminUser.permissions, adminUser.role),
    };
    return next();
  } catch {
    return response.status(401).json({ message: 'Invalid or expired admin token' });
  }
}

export function requireAdminRoles(roles = []) {
  return (request, response, next) => {
    if (!request.admin || !roles.includes(request.admin.role)) {
      return response.status(403).json({ message: 'Insufficient admin role permissions' });
    }
    return next();
  };
}

export function requireAdminPermission(permission) {
  return (request, response, next) => {
    const granted = request.admin?.permissions || [];
    if (!granted.includes(permission)) {
      return response.status(403).json({ message: `Missing permission: ${permission}` });
    }
    return next();
  };
}
