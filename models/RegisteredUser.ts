import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRegisteredUser extends Document {
  name: string;
  email: string;
  phone: string;
  password?: string;
  authProvider: 'credentials' | 'google' | 'email' | 'phone' | 'early-checker' | 'early-access' | 'scan-lead' | 'visitor-lead';
  userAgent?: string;
  lastSeenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RegisteredUserSchema = new Schema<IRegisteredUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    authProvider: {
      type: String,
      enum: ['credentials', 'google', 'email', 'phone', 'early-checker', 'early-access', 'scan-lead', 'visitor-lead'],
      default: 'email',
    },
    userAgent: {
      type: String,
      default: '',
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const RegisteredUser: Model<IRegisteredUser> =
  (mongoose.models.RegisteredUser as Model<IRegisteredUser>) ||
  mongoose.model<IRegisteredUser>('RegisteredUser', RegisteredUserSchema);

export default RegisteredUser;
