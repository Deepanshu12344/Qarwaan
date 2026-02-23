import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    tripName: { type: String, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    travelMonth: { type: String, trim: true },
    durationDays: { type: Number, min: 1 },
    travelers: { type: Number, required: true, min: 1 },
    budget: { type: Number, min: 0 },
    notes: { type: String, trim: true },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    crmStage: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'proposal_sent', 'negotiation', 'won', 'lost', 'closed'],
      default: 'new',
    },
    assignedAgent: { type: String, trim: true },
    followUpAt: { type: Date },
    followUpNote: { type: String, trim: true },
    followUpQueuedAt: { type: Date },
    followUpNotifiedAt: { type: Date },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
