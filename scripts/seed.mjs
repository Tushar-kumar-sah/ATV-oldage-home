import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load .env.local manually if not in process.env
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...rest] = trimmed.split('=');
      const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/old_age_home';
const SUPER_ADMIN_EMAIL = (process.env.SUPER_ADMIN_EMAIL || 'admin@ananddham.org').toLowerCase().trim();
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'AdminSecurePass123!';
const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME || 'Super Administrator';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

// Encryption helper
function getDerivedKey() {
  return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
}

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', getDerivedKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

async function runSeed() {
  console.log('🌱 Starting Anand Dham Database Seeding...');
  console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/:([^:@]+)@/, ':****@')}`);

  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB.');

  const db = mongoose.connection.db;

  // 1. Seed Super Admin
  const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
  const staffHashedPassword = await bcrypt.hash('StaffPass123!', 10);

  const usersCollection = db.collection('users');

  await usersCollection.updateOne(
    { email: SUPER_ADMIN_EMAIL },
    {
      $set: {
        name: SUPER_ADMIN_NAME,
        email: SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: 'super_admin',
        status: 'active',
        provider: 'credentials',
        phone: '+91 98765 00001',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
  console.log(`✅ Super Admin created: ${SUPER_ADMIN_EMAIL} (Password: ${SUPER_ADMIN_PASSWORD})`);

  // Seed sample staff member
  const sampleStaffEmail = 'staff@ananddham.org';
  await usersCollection.updateOne(
    { email: sampleStaffEmail },
    {
      $set: {
        name: 'Nurse Sneha Kulkarni',
        email: sampleStaffEmail,
        password: staffHashedPassword,
        role: 'staff',
        status: 'active',
        provider: 'credentials',
        phone: '+91 98765 00002',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
  console.log(`✅ Sample Staff created: ${sampleStaffEmail} (Password: StaffPass123!)`);

  const superAdminUser = await usersCollection.findOne({ email: SUPER_ADMIN_EMAIL });

  // 2. Seed Rooms
  const roomsCollection = db.collection('rooms');
  const sampleRooms = [
    {
      roomNumber: '101',
      floor: 1,
      roomType: 'Single',
      capacity: 1,
      occupiedBeds: 1,
      monthlyRate: 25000,
      amenities: ['Air Conditioning', 'Attached Bath', 'Wheelchair Ramp', 'Emergency Pull Cord'],
      status: 'Full',
      beds: [{ bedNumber: 'Bed 1', isOccupied: true, residentName: 'Shri V. K. Deshmukh' }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roomNumber: '102',
      floor: 1,
      roomType: 'Double Sharing',
      capacity: 2,
      occupiedBeds: 2,
      monthlyRate: 18000,
      amenities: ['Air Conditioning', 'Attached Bath', 'Garden Facing Balcony', 'Emergency Pull Cord'],
      status: 'Full',
      beds: [
        { bedNumber: 'Bed 1', isOccupied: true, residentName: 'Smt. Shanti Devi Verma' },
        { bedNumber: 'Bed 2', isOccupied: true, residentName: 'Smt. Kalyani Sundaram' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roomNumber: '103',
      floor: 1,
      roomType: 'Double Sharing',
      capacity: 2,
      occupiedBeds: 0,
      monthlyRate: 18000,
      amenities: ['Air Conditioning', 'Attached Bath', 'Emergency Call Alarm'],
      status: 'Available',
      beds: [
        { bedNumber: 'Bed 1', isOccupied: false },
        { bedNumber: 'Bed 2', isOccupied: false },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roomNumber: '201',
      floor: 2,
      roomType: 'Special Care',
      capacity: 2,
      occupiedBeds: 0,
      monthlyRate: 30000,
      amenities: ['24/7 Oxygen Supply', 'Padded Walls', 'Memory Stimulation Aids', 'Nurse Call Button'],
      status: 'Available',
      beds: [
        { bedNumber: 'Bed 1', isOccupied: false },
        { bedNumber: 'Bed 2', isOccupied: false },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roomNumber: '202',
      floor: 2,
      roomType: 'Triple Sharing',
      capacity: 3,
      occupiedBeds: 0,
      monthlyRate: 14000,
      amenities: ['Attached Bath', 'Ceiling Fan', 'Wheelchair Friendly Corridors'],
      status: 'Available',
      beds: [
        { bedNumber: 'Bed 1', isOccupied: false },
        { bedNumber: 'Bed 2', isOccupied: false },
        { bedNumber: 'Bed 3', isOccupied: false },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      roomNumber: '301',
      floor: 3,
      roomType: 'Single',
      capacity: 1,
      occupiedBeds: 0,
      monthlyRate: 28000,
      amenities: ['Private Terrace', 'Air Conditioning', 'Attached Bath', 'Mini Refrigerator'],
      status: 'Available',
      beds: [{ bedNumber: 'Bed 1', isOccupied: false }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const r of sampleRooms) {
    await roomsCollection.updateOne(
      { roomNumber: r.roomNumber },
      { $set: r },
      { upsert: true }
    );
  }
  console.log(`✅ ${sampleRooms.length} Sample rooms seeded across Floors 1, 2, and 3.`);

  const room101 = await roomsCollection.findOne({ roomNumber: '101' });
  const room102 = await roomsCollection.findOne({ roomNumber: '102' });

  // 3. Seed Sample Staff Directory
  const staffCollection = db.collection('staffs');
  const sampleStaffMembers = [
    {
      fullName: 'Sister Maria Joseph',
      email: 'maria.joseph@ananddham.org',
      phone: '+91 98765 11001',
      role: 'Nurse',
      shift: 'Morning (7 AM - 3 PM)',
      joiningDate: new Date('2023-01-15'),
      emergencyContact: { name: 'Peter Joseph', relation: 'Brother', phone: '+91 98765 11002' },
      address: 'Kalyani Nagar, Pune',
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: 'Dr. Arvind Sharma',
      email: 'dr.sharma@ananddham.org',
      phone: '+91 98765 11003',
      role: 'Doctor',
      shift: 'General (9 AM - 6 PM)',
      joiningDate: new Date('2022-06-01'),
      emergencyContact: { name: 'Meena Sharma', relation: 'Spouse', phone: '+91 98765 11004' },
      address: 'Aundh, Pune',
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: 'Ramesh Kulkarni',
      email: 'ramesh.k@ananddham.org',
      phone: '+91 98765 11005',
      role: 'Caregiver',
      shift: 'Evening (3 PM - 11 PM)',
      joiningDate: new Date('2024-02-10'),
      emergencyContact: { name: 'Savita Kulkarni', relation: 'Spouse', phone: '+91 98765 11006' },
      address: 'Kothrud, Pune',
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      fullName: 'Sunita Bai Shinde',
      email: 'sunita.kitchen@ananddham.org',
      phone: '+91 98765 11007',
      role: 'Cook',
      shift: 'Morning (7 AM - 3 PM)',
      joiningDate: new Date('2021-11-20'),
      emergencyContact: { name: 'Anil Shinde', relation: 'Son', phone: '+91 98765 11008' },
      address: 'Hadapsar, Pune',
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const s of sampleStaffMembers) {
    await staffCollection.updateOne(
      { email: s.email },
      { $set: s },
      { upsert: true }
    );
  }
  console.log(`✅ ${sampleStaffMembers.length} Staff directory profiles seeded.`);

  // 4. Seed Sample Residents
  const residentsCollection = db.collection('residents');

  const sampleResidents = [
    {
      fullName: 'Shri V. K. Deshmukh',
      admissionNumber: 'RES-2026-0001',
      dateOfBirth: new Date('1943-08-15'), // 83 years
      gender: 'Male',
      bloodGroup: 'O+',
      maritalStatus: 'Widowed',
      languages: ['Marathi', 'Hindi', 'English'],
      idType: 'Aadhaar',
      idNumberEncrypted: encrypt('4589 1234 5678'),
      idNumberMasked: 'XXXX-XXXX-5678',
      admissionDate: new Date('2025-04-10'),
      roomId: room101._id,
      roomNumber: '101',
      bedNumber: 'Bed 1',
      status: 'Active',
      emergencyContacts: [
        {
          name: 'Dr. Rajesh Deshmukh',
          relation: 'Son',
          phone: '+91 98220 12345',
          email: 'rajesh.deshmukh@gmail.com',
          address: 'Sunnyvale, CA, USA',
          isPrimary: true,
        },
      ],
      conditions: ['Type 2 Diabetes', 'Mild Memory Loss', 'Hypertension'],
      allergies: ['Dust', 'Sulfa Antibiotics'],
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', timing: 'Post breakfast & dinner' },
        { name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily', timing: 'Morning after breakfast' },
      ],
      primaryDoctor: {
        name: 'Dr. Arvind Sharma',
        phone: '+91 98765 11003',
        clinicOrHospital: 'City Geriatric Clinic',
      },
      insurance: { provider: 'Star Health Senior Red Carpet', policyNumber: 'SH-8829101' },
      dietaryNeeds: 'Diabetic satvik diet, low salt',
      mobilityLevel: 'Assisted Walking',
      monthlyFee: 25000,
      securityDeposit: 50000,
      medicalNotes: [
        {
          date: new Date('2026-10-10'),
          title: 'Routine Blood Glucose & Vitals Check',
          notes: 'Fasting sugar 118 mg/dL. BP 128/82 mmHg. Resident in high spirits after morning garden walk.',
          category: 'Routine Checkup',
          recordedBy: 'Sister Maria Joseph',
        },
      ],
      payments: [
        {
          date: new Date('2026-10-01'),
          amount: 25000,
          paymentMethod: 'Bank Transfer',
          receiptNumber: 'RCP-2026-1001',
          billingMonth: 'October 2026',
          recordedBy: 'Super Administrator',
        },
      ],
      documents: [
        {
          title: 'Aadhaar Card Copy',
          documentType: 'ID Proof',
          fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400',
          uploadedAt: new Date('2025-04-10'),
          uploadedBy: 'Super Administrator',
        },
      ],
      isDeleted: false,
      createdBy: superAdminUser._id,
      createdByName: SUPER_ADMIN_NAME,
      createdAt: new Date('2025-04-10'),
      updatedAt: new Date(),
    },
    {
      fullName: 'Smt. Shanti Devi Verma',
      admissionNumber: 'RES-2026-0002',
      dateOfBirth: new Date('1948-11-05'), // 77 years
      gender: 'Female',
      bloodGroup: 'B+',
      maritalStatus: 'Widowed',
      languages: ['Hindi'],
      idType: 'Aadhaar',
      idNumberEncrypted: encrypt('8976 5432 1098'),
      idNumberMasked: 'XXXX-XXXX-1098',
      admissionDate: new Date('2025-08-20'),
      roomId: room102._id,
      roomNumber: '102',
      bedNumber: 'Bed 1',
      status: 'Active',
      emergencyContacts: [
        {
          name: 'Vikas Verma',
          relation: 'Son',
          phone: '+91 98110 54321',
          email: 'vikas.verma@corp.in',
          address: 'Baner, Pune',
          isPrimary: true,
        },
      ],
      conditions: ['Osteoarthritis', 'Hypertension'],
      allergies: ['Penicillin'],
      medications: [
        { name: 'Calcium + Vit D3', dosage: '500mg', frequency: 'Once daily', timing: 'After lunch' },
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', timing: 'Morning' },
      ],
      primaryDoctor: {
        name: 'Dr. Arvind Sharma',
        phone: '+91 98765 11003',
        clinicOrHospital: 'City Geriatric Clinic',
      },
      insurance: { provider: 'HDFC ERGO My:Health Care', policyNumber: 'HE-9921783' },
      dietaryNeeds: 'Pure vegetarian, soft chewable food',
      mobilityLevel: 'Independent',
      monthlyFee: 18000,
      securityDeposit: 36000,
      medicalNotes: [
        {
          date: new Date('2026-10-12'),
          title: 'Physiotherapy Knee Mobility Session',
          notes: 'Completed 20 minutes gentle knee flexion exercises. Reported reduction in joint stiffness.',
          category: 'General Observation',
          recordedBy: 'Nurse Sneha Kulkarni',
        },
      ],
      payments: [
        {
          date: new Date('2026-10-02'),
          amount: 18000,
          paymentMethod: 'UPI',
          receiptNumber: 'RCP-2026-1002',
          billingMonth: 'October 2026',
          recordedBy: 'Super Administrator',
        },
      ],
      documents: [],
      isDeleted: false,
      createdBy: superAdminUser._id,
      createdByName: SUPER_ADMIN_NAME,
      createdAt: new Date('2025-08-20'),
      updatedAt: new Date(),
    },
    {
      fullName: 'Smt. Kalyani Sundaram',
      admissionNumber: 'RES-2026-0003',
      dateOfBirth: new Date('1952-10-28'), // Birthday coming up in ~14 days!
      gender: 'Female',
      bloodGroup: 'A+',
      maritalStatus: 'Widowed',
      languages: ['Tamil', 'English', 'Hindi'],
      idType: 'Aadhaar',
      idNumberEncrypted: encrypt('3321 8899 4455'),
      idNumberMasked: 'XXXX-XXXX-4455',
      admissionDate: new Date('2026-01-15'),
      roomId: room102._id,
      roomNumber: '102',
      bedNumber: 'Bed 2',
      status: 'Active',
      emergencyContacts: [
        {
          name: 'Meenakshi Narayanan',
          relation: 'Daughter',
          phone: '+91 98440 99887',
          email: 'meenakshi@gmail.com',
          address: 'Chennai, Tamil Nadu',
          isPrimary: true,
        },
      ],
      conditions: ['Mild Asthma'],
      allergies: ['Peanuts'],
      medications: [
        { name: 'Inhaler Budecort', dosage: '200mcg', frequency: 'As needed', timing: 'SOS' },
      ],
      primaryDoctor: {
        name: 'Dr. Arvind Sharma',
        phone: '+91 98765 11003',
        clinicOrHospital: 'City Geriatric Clinic',
      },
      insurance: { provider: 'Care Senior Health', policyNumber: 'CARE-190283' },
      dietaryNeeds: 'South Indian vegetarian, non-spicy',
      mobilityLevel: 'Independent',
      monthlyFee: 18000,
      securityDeposit: 36000,
      medicalNotes: [],
      payments: [
        {
          date: new Date('2026-10-05'),
          amount: 18000,
          paymentMethod: 'Bank Transfer',
          receiptNumber: 'RCP-2026-1003',
          billingMonth: 'October 2026',
          recordedBy: 'Super Administrator',
        },
      ],
      documents: [],
      isDeleted: false,
      createdBy: superAdminUser._id,
      createdByName: SUPER_ADMIN_NAME,
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date(),
    },
  ];

  for (const resData of sampleResidents) {
    await residentsCollection.updateOne(
      { admissionNumber: resData.admissionNumber },
      { $set: resData },
      { upsert: true }
    );
  }
  console.log(`✅ ${sampleResidents.length} Sample resident records seeded with encrypted IDs.`);

  // 5. Seed Sample Inquiries
  const inquiriesCollection = db.collection('inquiries');
  const sampleInquiries = [
    {
      name: 'Sunil Joshi',
      email: 'sunil.joshi@gmail.com',
      phone: '+91 98230 45678',
      relationshipToSenior: 'Son',
      careNeeded: 'Assisted Living',
      subject: 'Inquiry for 81-year-old Father with Parkinson’s',
      message: 'My father requires assisted mobility and daily medication supervision. Could we schedule a tour this Saturday?',
      status: 'New',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Ananya Roy',
      email: 'ananya.roy@gmail.com',
      phone: '+91 98300 11223',
      relationshipToSenior: 'Daughter',
      careNeeded: 'Memory / Dementia Care',
      subject: 'Dementia Care Availability',
      message: 'Looking for peaceful memory care accommodation for my mother who has early-stage Alzheimer’s.',
      status: 'In Review',
      notes: 'Sent brochure via email. Scheduled call on Thursday.',
      handledBy: 'Super Administrator',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];

  for (const inq of sampleInquiries) {
    await inquiriesCollection.updateOne(
      { email: inq.email, subject: inq.subject },
      { $set: inq },
      { upsert: true }
    );
  }
  console.log(`✅ ${sampleInquiries.length} Sample inquiries seeded.`);

  // 6. Seed Sample Visitor Log
  const visitorsCollection = db.collection('visitors');
  const res1 = await residentsCollection.findOne({ admissionNumber: 'RES-2026-0001' });

  if (res1) {
    await visitorsCollection.insertOne({
      visitorName: 'Sanjay Deshmukh',
      phone: '+91 98221 99887',
      residentId: res1._id,
      residentName: res1.fullName,
      relation: 'Nephew',
      checkIn: new Date(Date.now() - 2 * 60 * 60 * 1000),
      purpose: 'Brought homemade sweets and books',
      idProofType: 'Aadhaar / ID Card',
      idProofNumber: 'XXXX-5544',
      temperatureOrHealthNotes: 'Normal',
      loggedBy: 'Sister Maria Joseph',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ Sample visitor entry logged.');
  }

  console.log('\n=========================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log('=========================================');
  console.log(`Super Admin Email:    ${SUPER_ADMIN_EMAIL}`);
  console.log(`Super Admin Password: ${SUPER_ADMIN_PASSWORD}`);
  console.log(`Staff Email:          ${sampleStaffEmail}`);
  console.log(`Staff Password:       StaffPass123!`);
  console.log('=========================================\n');

  await mongoose.disconnect();
}

runSeed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
