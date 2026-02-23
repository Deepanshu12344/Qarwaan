import mongoose from 'mongoose';

const mediaAssetSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    storageType: { type: String, enum: ['url', 'upload'], default: 'url' },
    url: { type: String, required: true, trim: true },
    optimizedUrl: { type: String, trim: true },
    cdnUrl: { type: String, trim: true },
    cacheControl: { type: String, trim: true },
    fileName: { type: String, trim: true },
    mimeType: { type: String, trim: true },
    sizeBytes: { type: Number, min: 0 },
    checksumSha256: { type: String, trim: true },
    variants: { type: Object, default: {} },
    type: { type: String, enum: ['hero', 'gallery', 'banner', 'logo'], default: 'gallery' },
    altText: { type: String, trim: true },
    tags: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MediaAsset = mongoose.model('MediaAsset', mediaAssetSchema);
