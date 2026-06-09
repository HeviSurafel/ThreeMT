// lib/models/Inquiry.ts
import mongoose from 'mongoose';

export interface IInquiry {
  name: string;
  email: string;
  phone: string;
  company: string;
  category: string;
  subject: string;
  message: string;
  preferredContact: string;
  status: 'pending' | 'reviewed' | 'responded' | 'closed';
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new mongoose.Schema<IInquiry>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: true,
    },
    preferredContact: {
      type: String,
      default: 'email',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'responded', 'closed'],
      default: 'pending',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', inquirySchema);