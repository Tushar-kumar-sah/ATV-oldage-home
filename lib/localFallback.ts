import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'fallbackStore.json');

export interface LoginRecord {
  _id: string;
  email: string;
  name: string;
  role: string;
  status: 'SUCCESS' | 'FAILED';
  method: 'credentials' | 'google';
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface ActivityRecord {
  _id: string;
  userName: string;
  userEmail: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

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
  loginRecords: Array<LoginRecord>;
  residents: Array<any>;
  rooms: Array<any>;
  staff: Array<any>;
  visitors: Array<any>;
  activityLogs: Array<ActivityRecord>;
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
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      _id: 'reg-user-2',
      name: 'Rajesh Kulkarni',
      email: 'rajesh.k@gmail.com',
      phone: '+91 98111 22334',
      password: '',
      authProvider: 'google',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      _id: 'reg-user-3',
      name: 'Meenakshi Iyer',
      email: 'meenakshi.iyer@outlook.com',
      phone: '+91 99201 44556',
      password: 'PassIyer@456',
      authProvider: 'credentials',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X)',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      _id: 'reg-user-4',
      name: 'Vikramaditya Roy',
      email: 'vikram.roy@yahoo.co.in',
      phone: '+91 98300 77889',
      password: 'RoySecure789!',
      authProvider: 'credentials',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      _id: 'reg-user-5',
      name: 'Ananya Deshmukh',
      email: 'ananya.desh@gmail.com',
      phone: '+91 97654 11229',
      password: '',
      authProvider: 'google',
      userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8)',
      createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    },
  ],
  inquiries: [
    {
      _id: 'inq-1',
      name: 'Amitabh Sengupta',
      email: 'amitabh.s@outlook.com',
      phone: '+91 70441 63518',
      relationshipToSenior: 'Son',
      careNeeded: 'Assisted Living',
      subject: 'Inquiry for 82yo Father with Knee Arthritis',
      message: 'Looking for a ground-floor deluxe suite with attached grab rails and daily physiotherapy.',
      status: 'New',
      priority: 'high',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      _id: 'inq-2',
      name: 'Sunita Mehra',
      email: 'sunita.m@gmail.com',
      phone: '+91 97654 33211',
      relationshipToSenior: 'Daughter',
      careNeeded: 'Memory / Dementia Care',
      subject: 'Admission inquiry for Mother with early Dementia',
      message: 'Please send brochures regarding sensory therapy, memory games, and 24/7 nursing supervision.',
      status: 'In Progress',
      priority: 'urgent',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      _id: 'inq-3',
      name: 'Col. Sanjeev Kapoor',
      email: 'col.kapoor@rediffmail.com',
      phone: '+91 98100 55443',
      relationshipToSenior: 'Self',
      careNeeded: 'General Retirement',
      subject: 'Retirement suite reservation for peaceful spiritual living',
      message: 'Seeking a single occupancy balcony room with satvik vegetarian dietary service and temple access.',
      status: 'Contacted',
      priority: 'normal',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      _id: 'inq-4',
      name: 'Dr. Harsh Vardhan',
      email: 'dr.vardhan@apollo.in',
      phone: '+91 98224 88776',
      relationshipToSenior: 'Son',
      careNeeded: 'Post-Surgery / Short Stay',
      subject: 'Post-hip replacement rehabilitation (3-month stay)',
      message: 'Need specialized nursing care, wheelchair accessibility, and daily orthopedic visits.',
      status: 'Tour Scheduled',
      priority: 'high',
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
    {
      _id: 'inq-5',
      name: 'Pooja Bhattacharya',
      email: 'pooja.bhatt@gmail.com',
      phone: '+91 98311 00223',
      relationshipToSenior: 'Granddaughter',
      careNeeded: 'Day Care',
      subject: 'Day Care & Senior Club Membership',
      message: 'Interested in day care facilities with engaging morning yoga and wholesome afternoon meals.',
      status: 'Resolved',
      priority: 'normal',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ],
  loginRecords: [
    {
      _id: 'log-1',
      email: 'admin@ananddham.org',
      name: 'Super Administrator',
      role: 'super_admin',
      status: 'SUCCESS',
      method: 'credentials',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0',
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    },
    {
      _id: 'log-2',
      email: 'priya.sharma@example.com',
      name: 'Priya Sharma',
      role: 'staff',
      status: 'SUCCESS',
      method: 'credentials',
      ipAddress: '192.168.1.14',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      _id: 'log-3',
      email: 'staff@ananddham.org',
      name: 'Sister Preeti Thomas',
      role: 'staff',
      status: 'SUCCESS',
      method: 'credentials',
      ipAddress: '192.168.1.18',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      _id: 'log-4',
      email: 'unknown.attempt@test.com',
      name: 'Unknown User',
      role: 'unknown',
      status: 'FAILED',
      method: 'credentials',
      ipAddress: '103.45.12.98',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  ],
  residents: [
    {
      _id: 'res-1',
      fullName: 'Rameshwar Nath Joshi',
      admissionNumber: 'ADM-2023-001',
      dateOfBirth: '1942-08-15',
      age: 84,
      gender: 'Male',
      bloodGroup: 'B+',
      maritalStatus: 'Widowed',
      languages: ['Hindi', 'Marathi', 'English'],
      status: 'Active',
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
      fullName: 'Sushila Devi Sharma',
      admissionNumber: 'ADM-2023-002',
      dateOfBirth: '1946-12-05',
      age: 79,
      gender: 'Female',
      bloodGroup: 'O+',
      maritalStatus: 'Widowed',
      languages: ['Hindi', 'Punjabi'],
      status: 'Active',
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
    {
      _id: 'res-3',
      fullName: 'Gopal Krishna Menon',
      admissionNumber: 'ADM-2024-003',
      dateOfBirth: '1948-03-22',
      age: 78,
      gender: 'Male',
      bloodGroup: 'A+',
      maritalStatus: 'Widowed',
      languages: ['Malayalam', 'English', 'Hindi'],
      status: 'Active',
      admissionDate: '2024-01-15',
      roomNumber: '201',
      bedNumber: 'A',
      aadhaarMasked: 'XXXX-XXXX-9912',
      medicalSummary: 'Cardiac Pacemaker, Regular Physiotherapy',
      monthlyFee: 38000,
      emergencyContacts: [
        { name: 'Deepa Menon', relation: 'Daughter', phone: '+91 98401 55667', isPrimary: true },
      ],
      medicalNotes: [],
      payments: [],
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    },
  ],
  rooms: [
    { _id: 'room-1', roomNumber: '101', floor: 1, type: 'double', capacity: 2, occupiedBeds: 1, availableBeds: 1, monthlyRate: 35000 },
    { _id: 'room-2', roomNumber: '102', floor: 1, type: 'single', capacity: 1, occupiedBeds: 1, availableBeds: 0, monthlyRate: 45000 },
    { _id: 'room-3', roomNumber: '201', floor: 2, type: 'double', capacity: 2, occupiedBeds: 1, availableBeds: 1, monthlyRate: 35000 },
    { _id: 'room-4', roomNumber: '202', floor: 2, type: 'single', capacity: 1, occupiedBeds: 0, availableBeds: 1, monthlyRate: 45000 },
  ],
  staff: [
    { _id: 'staff-1', name: 'Dr. Sunita Deshmukh', role: 'Visiting Geriatrician', phone: '+91 98221 33445', shift: 'Morning (7 AM - 3 PM)', joiningDate: '2022-01-15', status: 'Active' },
    { _id: 'staff-2', name: 'Sister Preeti Thomas', role: 'Senior Head Nurse', phone: '+91 98110 55667', shift: 'Morning (7 AM - 3 PM)', joiningDate: '2022-03-01', status: 'Active' },
    { _id: 'staff-3', name: 'Sister Anjali Shinde', role: 'Staff Nurse', phone: '+91 98770 11223', shift: 'Night (11 PM - 7 AM)', joiningDate: '2023-06-15', status: 'Active' },
    { _id: 'staff-4', name: 'Ramesh Verma', role: 'Physiotherapist', phone: '+91 98990 44332', shift: 'General (9 AM - 6 PM)', joiningDate: '2023-08-20', status: 'Active' },
  ],
  visitors: [
    { _id: 'vis-1', visitorName: 'Dr. Alok Joshi', residentName: 'Rameshwar Nath Joshi', relation: 'Son', checkInTime: new Date(Date.now() - 7200000).toISOString(), checkOutTime: new Date(Date.now() - 3600000).toISOString(), purpose: 'Weekly family visit' },
    { _id: 'vis-2', visitorName: 'Vikram Sharma', residentName: 'Sushila Devi Sharma', relation: 'Son', checkInTime: new Date(Date.now() - 1800000).toISOString(), purpose: 'Delivered fresh fruits and winter shawl' },
  ],
  activityLogs: [
    { _id: 'act-1', userName: 'Super Administrator', userEmail: 'admin@ananddham.org', userRole: 'super_admin', action: 'LOGIN_CREDENTIALS', entityType: 'Auth', details: 'Root administrator session authenticated with secure vault token', ipAddress: '127.0.0.1', createdAt: new Date(Date.now() - 3600000 * 1).toISOString() },
    { _id: 'act-2', userName: 'Amitabh Sengupta', userEmail: 'amitabh.s@outlook.com', userRole: 'visitor', action: 'PUBLIC_INQUIRY_SUBMITTED', entityType: 'Inquiry', details: 'New admission inquiry submitted for Assisted Living suite', ipAddress: '103.21.56.78', createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
    { _id: 'act-3', userName: 'Priya Sharma', userEmail: 'priya.sharma@example.com', userRole: 'visitor', action: 'USER_REGISTERED', entityType: 'User', details: 'Public visitor registered via portal auth modal', ipAddress: '192.168.1.14', createdAt: new Date(Date.now() - 3600000 * 3).toISOString() },
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
    const parsed = JSON.parse(content);
    // Ensure all arrays exist
    if (!parsed.loginRecords) parsed.loginRecords = DEFAULT_STORE.loginRecords;
    if (!parsed.registeredUsers) parsed.registeredUsers = DEFAULT_STORE.registeredUsers;
    if (!parsed.inquiries) parsed.inquiries = DEFAULT_STORE.inquiries;
    if (!parsed.residents) parsed.residents = DEFAULT_STORE.residents;
    if (!parsed.rooms) parsed.rooms = DEFAULT_STORE.rooms;
    if (!parsed.staff) parsed.staff = DEFAULT_STORE.staff;
    if (!parsed.activityLogs) parsed.activityLogs = DEFAULT_STORE.activityLogs;
    return parsed;
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

export function addLoginRecord(record: {
  email: string;
  name?: string;
  role?: string;
  status?: 'SUCCESS' | 'FAILED';
  method?: 'credentials' | 'google';
  ipAddress?: string;
  userAgent?: string;
}) {
  const store = ensureStore();
  const newRecord: LoginRecord = {
    _id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    email: record.email,
    name: record.name || 'User',
    role: record.role || 'staff',
    status: record.status || 'SUCCESS',
    method: record.method || 'credentials',
    ipAddress: record.ipAddress || '127.0.0.1',
    userAgent: record.userAgent || 'Web Client',
    timestamp: new Date().toISOString(),
  };
  store.loginRecords.unshift(newRecord);
  // Keep last 100 logins
  if (store.loginRecords.length > 100) store.loginRecords = store.loginRecords.slice(0, 100);
  saveFallbackData(store);
  return newRecord;
}

export function addActivityLog(log: {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const store = ensureStore();
  const newLog: ActivityRecord = {
    _id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userName: log.userName || 'System',
    userEmail: log.userEmail || 'system@internal',
    userRole: log.userRole || 'system',
    action: log.action,
    entityType: log.entityType,
    entityId: log.entityId || '',
    details: log.details,
    ipAddress: log.ipAddress || '127.0.0.1',
    userAgent: log.userAgent || 'Web Client',
    createdAt: new Date().toISOString(),
  };
  store.activityLogs.unshift(newLog);
  if (store.activityLogs.length > 150) store.activityLogs = store.activityLogs.slice(0, 150);
  saveFallbackData(store);
  return newLog;
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
    status: 'New',
    priority: 'high',
    createdAt: new Date().toISOString(),
    ...inquiry,
  };
  store.inquiries.unshift(newInq);
  saveFallbackData(store);
  return newInq;
}
