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
  registeredUsers: [],
  inquiries: [],
  loginRecords: [],
  residents: [],
  rooms: [],
  staff: [],
  visitors: [],
  activityLogs: [],
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
    if (!Array.isArray(parsed.loginRecords)) parsed.loginRecords = [];
    if (!Array.isArray(parsed.registeredUsers)) parsed.registeredUsers = [];
    if (!Array.isArray(parsed.inquiries)) parsed.inquiries = [];
    if (!Array.isArray(parsed.residents)) parsed.residents = [];
    if (!Array.isArray(parsed.rooms)) parsed.rooms = [];
    if (!Array.isArray(parsed.staff)) parsed.staff = [];
    if (!Array.isArray(parsed.visitors)) parsed.visitors = [];
    if (!Array.isArray(parsed.activityLogs)) parsed.activityLogs = [];
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
  const existingIdx = store.registeredUsers.findIndex(
    (u) =>
      (user.email && u.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
      (user.phone && u.phone && u.phone === user.phone)
  );

  if (existingIdx >= 0) {
    store.registeredUsers[existingIdx] = {
      ...store.registeredUsers[existingIdx],
      name: user.name || store.registeredUsers[existingIdx].name,
      email: user.email || store.registeredUsers[existingIdx].email,
      phone: user.phone || store.registeredUsers[existingIdx].phone,
      password: user.password !== undefined ? user.password : store.registeredUsers[existingIdx].password,
      authProvider: user.authProvider || store.registeredUsers[existingIdx].authProvider,
      userAgent: user.userAgent || store.registeredUsers[existingIdx].userAgent,
    };
    saveFallbackData(store);
    return store.registeredUsers[existingIdx];
  }

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

export function addRoom(room: any) {
  const store = ensureStore();
  const newRoom = {
    _id: `room-${Date.now()}`,
    occupiedBeds: 0,
    status: 'Available',
    createdAt: new Date().toISOString(),
    ...room,
  };
  store.rooms.push(newRoom);
  saveFallbackData(store);
  return newRoom;
}

export function addStaff(staff: any) {
  const store = ensureStore();
  const newStaff = {
    _id: `staff-${Date.now()}`,
    status: 'Active',
    createdAt: new Date().toISOString(),
    ...staff,
  };
  store.staff.push(newStaff);
  saveFallbackData(store);
  return newStaff;
}

export function addVisitor(visitor: any) {
  const store = ensureStore();
  const newVisitor = {
    _id: `vis-${Date.now()}`,
    checkIn: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    ...visitor,
  };
  store.visitors.unshift(newVisitor);
  saveFallbackData(store);
  return newVisitor;
}

