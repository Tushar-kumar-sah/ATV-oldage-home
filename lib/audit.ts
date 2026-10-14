import { connectDB } from './db';
import ActivityLog from '@/models/ActivityLog';

interface LogOptions {
  userId?: any;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  action: string;
  entityType: 'Resident' | 'User' | 'Room' | 'Staff' | 'Visitor' | 'Inquiry' | 'Auth' | 'System';
  entityId?: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity(options: LogOptions): Promise<void> {
  try {
    await connectDB();
    await ActivityLog.create({
      userId: options.userId,
      userName: options.userName || 'System',
      userEmail: options.userEmail || 'system@internal',
      userRole: options.userRole || 'system',
      action: options.action,
      entityType: options.entityType,
      entityId: options.entityId || '',
      details: options.details,
      ipAddress: options.ipAddress || '',
      userAgent: options.userAgent || '',
    });
  } catch (error) {
    // Fail silently so activity logging doesn't block critical database actions
    console.error('Failed to log activity:', error);
  }
}
