import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'fallbackStore.json');

export interface FallbackData {
  registeredUsers: Array<{
    _id: string;
    name: string;
    email: string;
    phone: string;
    password?: string;
    authProvider: string;
    userAgent?: string;
    createdAt: string;
  }>;
  inquiries: Array<{
    _id: string;
    name: string;
    email: string;
    phone: string;
    relationshipToSenior: string;
    careNeeded: string;
    subject: string;
    message: string;
    status: string;
    priority: string;
    createdAt: string;
  }>;
  residents: Array<any>;
  rooms: Array<any>;
  staff: Array<any>;
  visitors: Array<any>;
  activityLogs: Array<any>;
}

const DEFAULT_STORE: FallbackData = {
  registeredUsers: [
    {
      _id: 'reg-user-1',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98234 56789',
      password: 'UserPass@123',
      authProvider: 'credentials',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0',
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      _id: 'reg-user-2',
      name: 'Rajesh Kulkarni',
      email: 'rajesh.k@gmail.com',
      phone: '+91 98111 22334',
      password: '',
      authProvider: 'google',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ],
  inquiries: [
    {
      _id: 'inq-1',
      name: 'Amitabh Sengupta',
      email: 'amitabh.s@outlook.com',
      phone: '+91 98450 11223',
      relationshipToSenior: 'Son',
      careNeeded: 'Assisted Living',
      subject: 'Inquiry for 82yo Father with Knee Arthritis',
      message: 'Looking for a ground-floor suite with attached grab rails and daily physiotherapy.',
      status: 'new',
      priority: 'high',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: 'inq-2',
      name: 'Sunita Mehra',
      email: 'sunita.m@gmail.com',
      phone: '+91 97654 33211',
      relationshipToSenior: 'Daughter',
      careNeeded: 'Memory Care',
      subject: 'Admission inquiry for Mother with early Dementia',
      message: 'Please send brochures regarding sensory therapy and 24/7 nursing supervision.',
      status: 'contacted',
      priority: 'urgent',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
  residents: [
    {
      _id: 'res-1',
      name: 'Rameshwar Nath Joshi',
      dateOfBirth: '1942-08-15',
      age: 84,
      gender: 'male',
      bloodGroup: 'B+',
      maritalStatus: 'widowed',
      languages: ['Hindi', 'Marathi', 'English'],
      status: 'active',
      admissionDate: '2023-04-10',
      roomNumber: '101',
      bedNumber: 'A',
      aadhaarMasked: 'XXXX-XXXX-8921',
      medicalSummary: 'Hypertension, Mild Osteoarthritis',
      monthlyFee: 35000,
      emergencyContacts: [
        { name: 'Dr. Alok Joshi', relation: 'Son', phone: '+91 98220 11223', isPrimary: true },
      ],
      medicalNotes: [
        { date: '2026-10-10', doctorName: 'Dr. Deshmukh', notes: 'BP steady at 128/82. Walking without assistance.' },
      ],
      payments: [
        { date: '2026-10-01', amount: 35000, mode: 'Bank Transfer', receiptNo: 'REC-2026-1001' },
      ],
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      _id: 'res-2',
      name: 'Sushila Devi Sharma',
      dateOfBirth: '1946-12-05',
      age: 79,
      gender: 'female',
      bloodGroup: 'O+',
      maritalStatus: 'widowed',
      languages: ['Hindi', 'Punjabi'],
      status: 'active',
      admissionDate: '2023-09-01',
      roomNumber: '102',
      bedNumber: 'A',
      aadhaarMasked: 'XXXX-XXXX-4312',
      medicalSummary: 'Type 2 Diabetes, Glaucoma',
      monthlyFee: 32000,
      emergencyContacts: [
        { name: 'Vikram Sharma', relation: 'Son', phone: '+91 98450 99887', isPrimary: true },
      ],
      medicalNotes: [
        { date: '2026-10-12', doctorName: 'Dr. Deshmukh', notes: 'Fasting sugar 112 mg/dL. Eye drops administered.' },
      ],
      payments: [
        { date: '2026-10-02', amount: 32000, mode: 'UPI', receiptNo: 'REC-2026-1002' },
      ],
      createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    },
  ],
  rooms: [
    { _id: 'room-1', roomNumber: '101', floor: 1, type: 'double', capacity: 2, occupiedBeds: 1, availableBeds: 1, monthlyRate: 35000 },
    { _id: 'room-2', roomNumber: '102', floor: 1, type: 'single', capacity: 1, occupiedBeds: 1, availableBeds: 0, monthlyRate: 45000 },
    { _id: 'room-3', roomNumber: '201', floor: 2, type: 'double', capacity: 2, occupiedBeds: 0, availableBeds: 2, monthlyRate: 35000 },
  ],
  staff: [
    { _id: 'staff-1', name: 'Dr. Sunita Deshmukh', role: 'Visiting Geriatrician', phone: '+91 98221 33445', shift: 'morning', joiningDate: '2022-01-15' },
    { _id: 'staff-2', name: 'Sister Preeti Thomas', role: 'Senior Head Nurse', phone: '+91 98110 55667', shift: 'morning', joiningDate: '2022-03-01' },
    { _id: 'staff-3', name: 'Sister Anjali Shinde', role: 'Staff Nurse', phone: '+91 98770 11223', shift: 'night', joiningDate: '2023-06-15' },
  ],
  visitors: [
    { _id: 'vis-1', visitorName: 'Dr. Alok Joshi', residentName: 'Rameshwar Nath Joshi', relation: 'Son', checkInTime: new Date(Date.now() - 7200000).toISOString(), checkOutTime: new Date(Date.now() - 3600000).toISOString(), purpose: 'Weekly family visit' },
    { _id: 'vis-2', visitorName: 'Vikram Sharma', residentName: 'Sushila Devi Sharma', relation: 'Son', checkInTime: new Date(Date.now() - 1800000).toISOString(), purpose: 'Delivered fresh fruits and winter shawl' },
  ],
  activityLogs: [
    { _id: 'log-1', action: 'SUPER_ADMIN_INIT', details: 'System initialized with secure vault protocols', createdAt: new Date().toISOString() },
  ],
};

function ensureStore(): FallbackData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
      return DEFAULT_STORE;
    }
    const content = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    return DEFAULT_STORE;
  }
}

export function getFallbackData(): FallbackData {
  return ensureStore();
}

export function saveFallbackData(data: FallbackData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving fallback data:', err);
  }
}

export function addRegisteredUser(user: {
  name: string;
  email: string;
  phone: string;
  password?: string;
  authProvider: string;
  userAgent?: string;
}) {
  const store = ensureStore();
  const newUser = {
    _id: `reg-${Date.now()}`,
    ...user,
    createdAt: new Date().toISOString(),
  };
  store.registeredUsers.unshift(newUser);
  saveFallbackData(store);
  return newUser;
}

export function addInquiry(inquiry: {
  name: string;
  email: string;
  phone: string;
  relationshipToSenior?: string;
  careNeeded?: string;
  subject?: string;
  message: string;
}) {
  const store = ensureStore();
  const newInq = {
    _id: `inq-${Date.now()}`,
    relationshipToSenior: inquiry.relationshipToSenior || 'Family Member',
    careNeeded: inquiry.careNeeded || 'General Assisted Living',
    subject: inquiry.subject || 'Admission Inquiry',
    status: 'new',
    priority: 'normal',
    createdAt: new Date().toISOString(),
    ...inquiry,
  };
  store.inquiries.unshift(newInq);
  saveFallbackData(store);
  return newInq;
}
