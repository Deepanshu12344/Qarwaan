export const ADMIN_PERMISSIONS = {
  VIEW_OVERVIEW: 'view_overview',
  MANAGE_TRIPS: 'manage_trips',
  MANAGE_CRM: 'manage_crm',
  VIEW_PAYMENTS: 'view_payments',
  ISSUE_REFUNDS: 'issue_refunds',
  TRIGGER_CRM_NOTIFICATIONS: 'trigger_crm_notifications',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  MANAGE_ADMIN_USERS: 'manage_admin_users',
};

const ALL_PERMISSIONS = Object.values(ADMIN_PERMISSIONS);

export function getRoleDefaultPermissions(role) {
  if (role === 'super_admin') {
    return ALL_PERMISSIONS;
  }

  if (role === 'manager') {
    return [
      ADMIN_PERMISSIONS.VIEW_OVERVIEW,
      ADMIN_PERMISSIONS.MANAGE_TRIPS,
      ADMIN_PERMISSIONS.MANAGE_CRM,
      ADMIN_PERMISSIONS.VIEW_PAYMENTS,
      ADMIN_PERMISSIONS.ISSUE_REFUNDS,
      ADMIN_PERMISSIONS.TRIGGER_CRM_NOTIFICATIONS,
      ADMIN_PERMISSIONS.VIEW_AUDIT_LOGS,
    ];
  }

  return [
    ADMIN_PERMISSIONS.VIEW_OVERVIEW,
    ADMIN_PERMISSIONS.MANAGE_CRM,
    ADMIN_PERMISSIONS.VIEW_PAYMENTS,
    ADMIN_PERMISSIONS.TRIGGER_CRM_NOTIFICATIONS,
  ];
}

export function normalizePermissions(inputPermissions = [], role = 'manager') {
  const source = inputPermissions.length > 0 ? inputPermissions : getRoleDefaultPermissions(role);
  return [...new Set(source)].filter((item) => ALL_PERMISSIONS.includes(item));
}
