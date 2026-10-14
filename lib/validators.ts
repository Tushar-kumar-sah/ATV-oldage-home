import { z } from 'zod';

// Login Validation Schema
export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

// Public Inquiry Form Schema
export const InquirySchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  email: z.string().email('Please provide a valid email address'),
  phone: z.string().min(6, 'Please provide a valid contact number'),
  relationshipToSenior: z.string().optional().default('Son / Daughter'),
  careNeeded: z.string().optional().default('Assisted Living'),
  subject: z.string().optional().default('General Inquiry for Admission'),
  message: z.string().min(1, 'Please enter a message or health conditions').default('Inquiry regarding elder admission'),
});

export type InquiryInput = z.infer<typeof InquirySchema>;

// Emergency Contact Schema
export const EmergencyContactSchema = z.object({
  name: z.string().min(2, 'Contact name is required'),
  relation: z.string().min(2, 'Relation is required (e.g. Son, Daughter, Guardian)'),
  phone: z.string().min(8, 'Valid phone number is required'),
  alternatePhone: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional().default(''),
  isPrimary: z.boolean().default(false),
});

// Medication Schema
export const MedicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required (e.g. 5mg, 1 tablet)'),
  frequency: z.string().min(1, 'Frequency is required (e.g. Twice daily, Once daily)'),
  timing: z.string().default('After meals'),
  instructions: z.string().optional().default(''),
});

// Medical Note Schema
export const MedicalNoteSchema = z.object({
  date: z.string().optional(),
  title: z.string().min(2, 'Title is required'),
  notes: z.string().min(5, 'Notes must have details'),
  category: z.enum([
    'Routine Checkup',
    'Doctor Visit',
    'Emergency',
    'Medication Change',
    'General Observation',
  ]),
});

// Payment Record Schema
export const PaymentSchema = z.object({
  date: z.string().optional(),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Card']),
  receiptNumber: z.string().min(2, 'Receipt number is required'),
  billingMonth: z.string().min(2, 'Billing month is required'),
  remarks: z.string().optional().default(''),
});

// Full Resident Schema for Creation and Editing
export const ResidentSchema = z.object({
  // Personal
  fullName: z.string().min(2, 'Full name is required'),
  photoUrl: z.string().optional().default(''),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']).default('Unknown'),
  maritalStatus: z.enum(['Single', 'Married', 'Widowed', 'Divorced', 'Other']).default('Widowed'),
  languages: z.array(z.string()).default([]),

  // ID Details
  idType: z.enum(['Aadhaar', 'Passport', 'Voter ID', 'PAN', 'Other']).default('Aadhaar'),
  idNumber: z.string().min(4, 'ID / Aadhaar number is required'),
  idDocumentUrl: z.string().optional().default(''),

  // Admission & Room
  admissionDate: z.string().min(1, 'Admission date is required'),
  roomId: z.string().optional().nullable(),
  roomNumber: z.string().optional().default(''),
  bedNumber: z.string().optional().default(''),
  status: z.enum(['Active', 'Discharged', 'Deceased', 'On Leave']).default('Active'),
  dischargeDate: z.string().optional().nullable(),
  dischargeReason: z.string().optional().default(''),

  // Emergency Contacts
  emergencyContacts: z.array(EmergencyContactSchema).min(1, 'At least one emergency contact is required'),

  // Medical
  conditions: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  medications: z.array(MedicationSchema).default([]),
  primaryDoctor: z
    .object({
      name: z.string().default(''),
      phone: z.string().default(''),
      clinicOrHospital: z.string().default(''),
    })
    .default({ name: '', phone: '', clinicOrHospital: '' }),
  insurance: z
    .object({
      provider: z.string().default(''),
      policyNumber: z.string().default(''),
      validTill: z.string().optional().nullable(),
    })
    .optional(),
  dietaryNeeds: z.string().default('Normal balanced diet'),
  mobilityLevel: z.enum(['Independent', 'Assisted Walking', 'Wheelchair', 'Bedridden']).default('Independent'),

  // Financial
  monthlyFee: z.number().min(0, 'Monthly fee cannot be negative').default(15000),
  securityDeposit: z.number().min(0).default(0),
});

export type ResidentInput = z.infer<typeof ResidentSchema>;

// Room Schema
export const RoomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  floor: z.number().min(0, 'Floor must be 0 or higher'),
  roomType: z.enum(['Single', 'Double Sharing', 'Triple Sharing', 'Special Care']),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  monthlyRate: z.number().min(0, 'Monthly rate cannot be negative'),
  amenities: z.array(z.string()).default([]),
  status: z.enum(['Available', 'Full', 'Maintenance']).default('Available'),
  notes: z.string().optional().default(''),
});

export type RoomInput = z.infer<typeof RoomSchema>;

// Staff Schema
export const StaffSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Phone number is required'),
  role: z.enum(['Caregiver', 'Nurse', 'Doctor', 'Cook', 'Manager', 'Admin', 'Security', 'Physiotherapist']),
  shift: z.enum([
    'Morning (7 AM - 3 PM)',
    'Evening (3 PM - 11 PM)',
    'Night (11 PM - 7 AM)',
    'General (9 AM - 6 PM)',
  ]),
  joiningDate: z.string().min(1, 'Joining date is required'),
  emergencyContact: z.object({
    name: z.string().default(''),
    relation: z.string().default(''),
    phone: z.string().default(''),
  }),
  address: z.string().optional().default(''),
  salary: z.number().min(0).default(0),
  status: z.enum(['Active', 'On Leave', 'Inactive']).default('Active'),
  notes: z.string().optional().default(''),
});

export type StaffInput = z.infer<typeof StaffSchema>;

// Visitor Schema
export const VisitorSchema = z.object({
  visitorName: z.string().min(2, 'Visitor name is required'),
  phone: z.string().min(8, 'Phone number is required'),
  residentId: z.string().min(1, 'Please select a resident'),
  residentName: z.string().optional().default(''),
  relation: z.string().min(2, 'Relation to resident is required'),
  purpose: z.string().min(2, 'Purpose is required'),
  idProofType: z.string().default('Aadhaar / ID Card'),
  idProofNumber: z.string().optional().default(''),
  temperatureOrHealthNotes: z.string().default('Normal'),
  notes: z.string().optional().default(''),
});

export type VisitorInput = z.infer<typeof VisitorSchema>;

// User Approval / Update Schema
export const UserUpdateSchema = z.object({
  role: z.enum(['super_admin', 'staff']),
  status: z.enum(['active', 'pending', 'rejected', 'deactivated']),
});
