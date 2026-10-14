import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'super_admin' | 'staff';
      status: 'active' | 'pending' | 'rejected' | 'deactivated';
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role: 'super_admin' | 'staff';
    status: 'active' | 'pending' | 'rejected' | 'deactivated';
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: 'super_admin' | 'staff';
    status: 'active' | 'pending' | 'rejected' | 'deactivated';
  }
}
