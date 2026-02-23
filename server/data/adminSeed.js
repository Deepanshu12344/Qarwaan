import bcrypt from 'bcryptjs';
import { AdminUser } from '../models/AdminUser.js';

export async function seedAdminIfNeeded() {
  const count = await AdminUser.countDocuments();
  if (count > 0) return;

  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
  const rawPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  await AdminUser.create({
    username,
    passwordHash,
    role: 'super_admin',
    active: true,
  });

  console.log('Seeded default admin user');
}
