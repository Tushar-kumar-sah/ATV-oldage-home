import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import User from '@/models/User';
import { logActivity } from './audit';
import { LoginSchema } from './validators';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'staff@ananddham.org' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password.');
        }

        const validation = LoginSchema.safeParse(credentials);
        if (!validation.success) {
          throw new Error(validation.error.errors[0]?.message || 'Invalid credentials format');
        }

        const email = credentials.email.toLowerCase().trim();
        const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || 'admin@ananddham.org').toLowerCase().trim();
        const superAdminPass = process.env.SUPER_ADMIN_PASSWORD || 'AdminSecurePass123!';

        // Direct Super Admin instant authentication (guaranteed zero-hang login)
        if (email === superAdminEmail && credentials.password === superAdminPass) {
          try {
            await connectDB();
            let adminUser = await User.findOne({ email });
            if (!adminUser) {
              const hashedPassword = await bcrypt.hash(superAdminPass, 12);
              adminUser = await User.create({
                name: process.env.SUPER_ADMIN_NAME || 'Super Administrator',
                email: superAdminEmail,
                password: hashedPassword,
                role: 'super_admin',
                status: 'active',
                approvedAt: new Date(),
              });
            } else {
              adminUser.lastLogin = new Date();
              await adminUser.save();
            }
          } catch (dbErr) {
            console.warn('Database offline, authenticating Super Admin via root environment credentials.');
          }

          return {
            id: 'super-admin-root',
            name: process.env.SUPER_ADMIN_NAME || 'Super Administrator',
            email: superAdminEmail,
            role: 'super_admin',
            status: 'active',
          };
        }

        try {
          await connectDB();
        } catch (dbErr: any) {
          throw new Error('Database connection offline. Please use the default Super Admin credentials.');
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
          throw new Error('No user found with this email address.');
        }

        if (!user.password) {
          throw new Error('Please sign in using your assigned staff credentials.');
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) {
          throw new Error('Invalid email or password.');
        }

        // Check account approval / active status
        if (user.status === 'pending') {
          throw new Error('Your account is pending Super Admin approval. Please contact the administrator.');
        }

        if (user.status === 'rejected' || user.status === 'deactivated') {
          throw new Error('Your account has been deactivated or rejected by the Super Admin.');
        }

        // Record last login
        user.lastLogin = new Date();
        await user.save();

        // Audit log
        await logActivity({
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          userRole: user.role,
          action: 'LOGIN_CREDENTIALS',
          entityType: 'Auth',
          entityId: user._id.toString(),
          details: `User logged in successfully via credentials as ${user.role}`,
        });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          image: user.image || '',
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await connectDB();
        const email = user.email?.toLowerCase().trim();
        if (!email) return false;

        const superAdminEmail = (process.env.SUPER_ADMIN_EMAIL || '').toLowerCase().trim();
        const isSuperAdminEmail = email === superAdminEmail;

        let dbUser = await User.findOne({ email });

        if (!dbUser) {
          // Rule: signing in with Google must NOT automatically grant access.
          // New Google users are created with status "pending" until Super Admin approves them.
          // Only the email in SUPER_ADMIN_EMAIL becomes Super Admin on first login.
          dbUser = await User.create({
            name: user.name || 'Staff Member',
            email: email,
            provider: 'google',
            image: user.image || '',
            role: isSuperAdminEmail ? 'super_admin' : 'staff',
            status: isSuperAdminEmail ? 'active' : 'pending',
            lastLogin: new Date(),
          });

          await logActivity({
            userId: dbUser._id,
            userName: dbUser.name,
            userEmail: dbUser.email,
            userRole: dbUser.role,
            action: isSuperAdminEmail ? 'GOOGLE_SIGNUP_SUPER_ADMIN' : 'GOOGLE_SIGNUP_PENDING',
            entityType: 'Auth',
            entityId: dbUser._id.toString(),
            details: isSuperAdminEmail
              ? 'Super Admin initial Google signup verified and activated.'
              : 'New Google user signed up. Created with pending status awaiting approval.',
          });
        } else {
          // If user exists, check if email matches SUPER_ADMIN_EMAIL and elevate if needed
          if (isSuperAdminEmail && (dbUser.role !== 'super_admin' || dbUser.status !== 'active')) {
            dbUser.role = 'super_admin';
            dbUser.status = 'active';
          }
          dbUser.lastLogin = new Date();
          if (user.image && !dbUser.image) {
            dbUser.image = user.image;
          }
          await dbUser.save();

          await logActivity({
            userId: dbUser._id,
            userName: dbUser.name,
            userEmail: dbUser.email,
            userRole: dbUser.role,
            action: 'LOGIN_GOOGLE',
            entityType: 'Auth',
            entityId: dbUser._id.toString(),
            details: `Google login recorded. Current status: ${dbUser.status}`,
          });
        }

        // Attach DB id and role to user object so jwt callback gets it
        user.id = dbUser._id.toString();
        user.role = dbUser.role;
        user.status = dbUser.status;

        return true;
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }

      // If user status or role was updated in DB, refresh token data periodically
      if (token.id) {
        try {
          await connectDB();
          const freshUser = await User.findById(token.id).select('role status');
          if (freshUser) {
            token.role = freshUser.role;
            token.status = freshUser.status;
          }
        } catch (e) {
          // Fall back to existing token values
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'super_admin' | 'staff';
        session.user.status = token.status as 'active' | 'pending' | 'rejected' | 'deactivated';
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
