import { AuditLog } from '../models/AuditLog.js';

export async function createAuditLog({ admin, action, entityType, entityId, details, ip }) {
  try {
    await AuditLog.create({
      adminId: admin?.adminId,
      adminUsername: admin?.username,
      role: admin?.role,
      action,
      entityType,
      entityId: entityId ? String(entityId) : undefined,
      details: details || {},
      ip,
    });
  } catch {
    // avoid blocking core flow if logging fails
  }
}
