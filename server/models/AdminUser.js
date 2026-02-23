import mongoose from 'mongoose';
import { normalizePermissions } from '../config/adminPermissions.js';

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'manager', 'crm_agent'],
      default: 'manager',
    },
    active: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    permissions: {
      type: [String],
      default: [],
      set: function setPermissions(input) {
        return normalizePermissions(Array.isArray(input) ? input : [], this.role);
      },
    },
  },
  { timestamps: true }
);

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
