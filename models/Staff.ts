import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStaff extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  role: 'Caregiver' | 'Nurse' | 'Doctor' | 'Cook' | 'Manager' | 'Admin' | 'Security' | 'Physiotherapist';
  shift: 'Morning (7 AM - 3 PM)' | 'Evening (3 PM - 11 PM)' | 'Night (11 PM - 7 AM)' | 'General (9 AM - 6 PM)';
  joiningDate: Date;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  address?: string;
  salary?: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
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
    role: {
      type: String,
      enum: ['Caregiver', 'Nurse', 'Doctor', 'Cook', 'Manager', 'Admin', 'Security', 'Physiotherapist'],
      default: 'Caregiver',
      index: true,
    },
    shift: {
      type: String,
      enum: [
        'Morning (7 AM - 3 PM)',
        'Evening (3 PM - 11 PM)',
        'Night (11 PM - 7 AM)',
        'General (9 AM - 6 PM)',
      ],
      default: 'General (9 AM - 6 PM)',
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    emergencyContact: {
      name: { type: String, default: '' },
      relation: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    address: {
      type: String,
      default: '',
    },
    salary: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

StaffSchema.index({ fullName: 'text', role: 1 });

const Staff: Model<IStaff> = mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);

export default Staff;
