import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmergencyContact {
  _id?: mongoose.Types.ObjectId;
  name: string;
  relation: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

export interface IMedication {
  _id?: mongoose.Types.ObjectId;
  name: string;
  dosage: string;
  frequency: string;
  timing: string; // e.g. "After breakfast, After dinner"
  instructions?: string;
}

export interface IMedicalNote {
  _id?: mongoose.Types.ObjectId;
  date: Date;
  title: string;
  notes: string;
  category: 'Routine Checkup' | 'Doctor Visit' | 'Emergency' | 'Medication Change' | 'General Observation';
  recordedBy: string;
  recordedById?: mongoose.Types.ObjectId;
}

export interface IPaymentRecord {
  _id?: mongoose.Types.ObjectId;
  date: Date;
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'Cheque' | 'Card';
  receiptNumber: string;
  billingMonth: string; // e.g. "October 2026"
  recordedBy: string;
  remarks?: string;
}

export interface IDocumentRecord {
  _id?: mongoose.Types.ObjectId;
  title: string;
  documentType: 'ID Proof' | 'Medical Report' | 'Consent Form' | 'Legal Document' | 'Other';
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface IResident extends Document {
  _id: mongoose.Types.ObjectId;
  // Personal
  fullName: string;
  photoUrl?: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Unknown';
  maritalStatus: 'Single' | 'Married' | 'Widowed' | 'Divorced' | 'Other';
  languages: string[];

  // ID Details (Sensitive)
  idType: 'Aadhaar' | 'Passport' | 'Voter ID' | 'PAN' | 'Other';
  idNumberEncrypted: string;
  idNumberMasked: string;
  idDocumentUrl?: string;

  // Admission & Room
  admissionNumber: string;
  admissionDate: Date;
  roomId?: mongoose.Types.ObjectId;
  roomNumber?: string;
  bedNumber?: string;
  status: 'Active' | 'Discharged' | 'Deceased' | 'On Leave';
  dischargeDate?: Date;
  dischargeReason?: string;

  // Family & Contacts
  emergencyContacts: IEmergencyContact[];

  // Medical
  conditions: string[];
  allergies: string[];
  medications: IMedication[];
  primaryDoctor?: {
    name: string;
    phone: string;
    clinicOrHospital: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    validTill?: Date;
  };
  dietaryNeeds?: string;
  mobilityLevel: 'Independent' | 'Assisted Walking' | 'Wheelchair' | 'Bedridden';
  medicalNotes: IMedicalNote[];

  // Financial
  monthlyFee: number;
  securityDeposit?: number;
  payments: IPaymentRecord[];

  // Documents
  documents: IDocumentRecord[];

  // Soft Delete & Audit Trail
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdByName: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedByName?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtual for age
  age?: number;
}

const EmergencyContactSchema = new Schema<IEmergencyContact>(
  {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: true }
);

const MedicationSchema = new Schema<IMedication>(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    timing: { type: String, default: 'As prescribed' },
    instructions: { type: String, default: '' },
  },
  { _id: true }
);

const MedicalNoteSchema = new Schema<IMedicalNote>(
  {
    date: { type: Date, default: Date.now },
    title: { type: String, required: true },
    notes: { type: String, required: true },
    category: {
      type: String,
      enum: ['Routine Checkup', 'Doctor Visit', 'Emergency', 'Medication Change', 'General Observation'],
      default: 'General Observation',
    },
    recordedBy: { type: String, required: true },
    recordedById: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: true }
);

const PaymentRecordSchema = new Schema<IPaymentRecord>(
  {
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card'],
      default: 'Bank Transfer',
    },
    receiptNumber: { type: String, required: true },
    billingMonth: { type: String, required: true },
    recordedBy: { type: String, default: 'Staff' },
    remarks: { type: String, default: '' },
  },
  { _id: true }
);

const DocumentRecordSchema = new Schema<IDocumentRecord>(
  {
    title: { type: String, required: true },
    documentType: {
      type: String,
      enum: ['ID Proof', 'Medical Report', 'Consent Form', 'Legal Document', 'Other'],
      default: 'Medical Report',
    },
    fileUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: String, default: 'Staff' },
  },
  { _id: true }
);

const ResidentSchema = new Schema<IResident>(
  {
    // Personal
    fullName: { type: String, required: true, trim: true, index: true },
    photoUrl: { type: String, default: '' },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true, index: true },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
      default: 'Unknown',
    },
    maritalStatus: {
      type: String,
      enum: ['Single', 'Married', 'Widowed', 'Divorced', 'Other'],
      default: 'Widowed',
    },
    languages: [{ type: String }],

    // ID Details
    idType: {
      type: String,
      enum: ['Aadhaar', 'Passport', 'Voter ID', 'PAN', 'Other'],
      default: 'Aadhaar',
    },
    idNumberEncrypted: { type: String, required: true },
    idNumberMasked: { type: String, required: true },
    idDocumentUrl: { type: String, default: '' },

    // Admission
    admissionNumber: { type: String, required: true, unique: true, index: true },
    admissionDate: { type: Date, default: Date.now, index: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', index: true },
    roomNumber: { type: String, default: '' },
    bedNumber: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Active', 'Discharged', 'Deceased', 'On Leave'],
      default: 'Active',
      index: true,
    },
    dischargeDate: { type: Date },
    dischargeReason: { type: String, default: '' },

    // Emergency Contacts
    emergencyContacts: [EmergencyContactSchema],

    // Medical
    conditions: [{ type: String }],
    allergies: [{ type: String }],
    medications: [MedicationSchema],
    primaryDoctor: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      clinicOrHospital: { type: String, default: '' },
    },
    insurance: {
      provider: { type: String, default: '' },
      policyNumber: { type: String, default: '' },
      validTill: { type: Date },
    },
    dietaryNeeds: { type: String, default: 'Normal balanced diet' },
    mobilityLevel: {
      type: String,
      enum: ['Independent', 'Assisted Walking', 'Wheelchair', 'Bedridden'],
      default: 'Independent',
      index: true,
    },
    medicalNotes: [MedicalNoteSchema],

    // Financial
    monthlyFee: { type: Number, required: true, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    payments: [PaymentRecordSchema],

    // Documents
    documents: [DocumentRecordSchema],

    // Soft delete
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },

    // Audit Trail
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdByName: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedByName: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for auto calculating age
ResidentSchema.virtual('age').get(function (this: IResident) {
  if (!this.dateOfBirth) return 0;
  const today = new Date();
  const birth = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
});

// Compound indexes for performant search & filters
ResidentSchema.index({ fullName: 'text', admissionNumber: 'text' });
ResidentSchema.index({ isDeleted: 1, status: 1 });
ResidentSchema.index({ isDeleted: 1, roomId: 1 });

const Resident: Model<IResident> =
  mongoose.models.Resident || mongoose.model<IResident>('Resident', ResidentSchema);

export default Resident;
