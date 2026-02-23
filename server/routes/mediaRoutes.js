import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import multer from 'multer';
import { MediaAsset } from '../models/MediaAsset.js';
import { requireAdminAuth, requireAdminPermission } from '../middleware/adminAuth.js';

const router = express.Router();
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.resolve(currentDir, '..', '..', process.env.MEDIA_UPLOAD_DIR || 'uploads');
const mediaUploadDir = path.join(uploadsRoot, 'media');

fs.mkdirSync(mediaUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, mediaUploadDir);
  },
  filename: (_request, file, callback) => {
    const ext = path.extname(file.originalname || '');
    const safeExt = ext.toLowerCase().replace(/[^a-z0-9.]/g, '');
    const name = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${safeExt}`;
    callback(null, name);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MEDIA_UPLOAD_MAX_BYTES || 15 * 1024 * 1024),
  },
  fileFilter: (_request, file, callback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      callback(null, true);
      return;
    }
    callback(new Error('Only image/video uploads are supported'));
  },
});

function getOptimizedUrl(url) {
  if (!url) return '';
  if (url.includes('images.pexels.com')) {
    return `${url}${url.includes('?') ? '&' : '?'}auto=compress&cs=tinysrgb&w=1400`;
  }
  if (url.startsWith('/uploads/')) {
    return `${url}?w=1400&fit=cover&auto=format`;
  }
  return url;
}

function splitTags(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value !== 'string') return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getChecksum(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

router.get('/', async (_request, response) => {
  try {
    const media = await MediaAsset.find({ active: true }).sort({ createdAt: -1 });
    return response.status(200).json({ media });
  } catch {
    return response.status(500).json({ message: 'Failed to fetch media assets' });
  }
});

router.get('/admin', requireAdminAuth, requireAdminPermission('manage_trips'), async (_request, response) => {
  const media = await MediaAsset.find().sort({ createdAt: -1 });
  return response.status(200).json({ media });
});

router.post('/admin', requireAdminAuth, requireAdminPermission('manage_trips'), async (request, response) => {
  try {
    const payload = request.body;
    const asset = await MediaAsset.create({
      ...payload,
      storageType: payload.storageType || 'url',
      tags: splitTags(payload.tags),
      optimizedUrl: payload.optimizedUrl || getOptimizedUrl(payload.url),
      cacheControl: payload.cacheControl || 'public, max-age=300',
    });
    return response.status(201).json({ asset });
  } catch {
    return response.status(400).json({ message: 'Failed to create media asset' });
  }
});

router.post(
  '/admin/upload',
  requireAdminAuth,
  requireAdminPermission('manage_trips'),
  upload.single('file'),
  async (request, response) => {
    try {
      if (!request.file) {
        return response.status(400).json({ message: 'file is required' });
      }

      const publicPath = `/uploads/media/${request.file.filename}`;
      const checksum = getChecksum(request.file.path);
      const tags = splitTags(request.body.tags);

      const asset = await MediaAsset.create({
        title: request.body.title || request.file.originalname,
        storageType: 'upload',
        url: publicPath,
        optimizedUrl: getOptimizedUrl(publicPath),
        cdnUrl: request.body.cdnUrl || '',
        cacheControl: request.body.cacheControl || 'public, max-age=31536000, immutable',
        fileName: request.file.filename,
        mimeType: request.file.mimetype,
        sizeBytes: request.file.size,
        checksumSha256: checksum,
        type: request.body.type || 'gallery',
        altText: request.body.altText || '',
        tags,
        active: request.body.active !== 'false',
        variants: {
          original: publicPath,
          optimized: getOptimizedUrl(publicPath),
        },
      });

      return response.status(201).json({ asset });
    } catch (error) {
      return response.status(400).json({ message: error instanceof Error ? error.message : 'Upload failed' });
    }
  }
);

router.patch('/admin/:id', requireAdminAuth, requireAdminPermission('manage_trips'), async (request, response) => {
  try {
    const payload = request.body;
    const asset = await MediaAsset.findByIdAndUpdate(
      request.params.id,
      {
        ...payload,
        tags: 'tags' in payload ? splitTags(payload.tags) : undefined,
        optimizedUrl: payload.optimizedUrl || (payload.url ? getOptimizedUrl(payload.url) : undefined),
      },
      { new: true }
    );
    if (!asset) {
      return response.status(404).json({ message: 'Media asset not found' });
    }
    return response.status(200).json({ asset });
  } catch {
    return response.status(400).json({ message: 'Failed to update media asset' });
  }
});

export default router;
