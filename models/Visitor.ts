import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisitor extends Document {
  _id: mongoose.Types.ObjectId;
  visitorName: string;
  phone: string;
  residentId: mongoose.Types.ObjectId;
  residentName: string;
  relation: string;
  checkIn: Date;
  checkOut?: Date;
  purpose: string;
  idProofType?: string;
  idProofNumber?: string;
  temperatureOrHealthNotes?: string;
  notes?: string;
  loggedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorSchema = new Schema<IVisitor>(
  {
    visitorName: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    residentId: {
      type: Schema.Types.ObjectId,
      ref: 'Resident',
      required: [true, 'Resident reference is required'],
      index: true,
    },
    residentName: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: [true, 'Relation to resident is required'],
      default: 'Family',
    },
    checkIn: {
      type: Date,
      default: Date.now,
      index: true,
    },
    checkOut: {
      type: Date,
    },
    purpose: {
      type: String,
      default: 'Family Visit',
    },
    idProofType: {
      type: String,
      default: 'Aadhaar / ID Card',
    },
    idProofNumber: {
      type: String,
      default: '',
    },
    temperatureOrHealthNotes: {
      type: String,
      default: 'Normal',
    },
    notes: {
      type: String,
      default: '',
    },
    loggedBy: {
      type: String,
      default: 'Staff',
    },
  },
  {
    timestamps: true,
  }
);

VisitorSchema.index({ visitorName: 'text', residentName: 'text' });
VisitorSchema.index({ checkIn: -1 });

const Visitor: Model<IVisitor> =
  mongoose.models.Visitor || mongoose.model<IVisitor>('Visitor', VisitorSchema);

export default Visitor;
