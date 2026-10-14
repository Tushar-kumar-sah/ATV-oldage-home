import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInquiry extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  relationshipToSenior?: string;
  careNeeded?: 'Assisted Living' | 'Memory / Dementia Care' | 'Post-Surgery / Short Stay' | 'Day Care' | 'General Retirement';
  subject: string;
  message: string;
  status: 'New' | 'In Review' | 'Contacted' | 'Closed';
  notes?: string;
  handledBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    relationshipToSenior: {
      type: String,
      default: 'Son/Daughter',
    },
    careNeeded: {
      type: String,
      default: 'Assisted Living',
    },
    subject: {
      type: String,
      default: 'General Inquiry for Admission',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Contacted', 'Closed'],
      default: 'New',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
    handledBy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

InquirySchema.index({ status: 1, createdAt: -1 });

const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
