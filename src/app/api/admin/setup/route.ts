/**
 * Admin Setup Endpoint
 * Creates or updates the default admin user
 * Should only be accessible with a secret token
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user as userTable, account as accountTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import crypto from 'crypto';

const ADMIN_EMAIL = 'cswaseem110@gmail.com';
const ADMIN_PASSWORD = 'Admin123';
const ADMIN_NAME = 'Admin User';
const SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || 'admin-setup-secret-123';

async function createOrUpdateAdmin() {
  try {
    // Check if admin user already exists
    let adminUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, ADMIN_EMAIL))
      .get();

    if (!adminUser) {
      // Create new admin user
      const adminId = crypto.randomUUID();
      
      await db.insert(userTable).values({
        id: adminId,
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        emailVerified: true,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      adminUser = {
        id: adminId,
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        emailVerified: true,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        image: null,
        phoneNumber: null,
        propertyName: null,
        propertyWebsite: null,
        planId: null,
        paymentStatus: null,
      };
    } else if (adminUser.role !== 'admin') {
      // Update existing user to be admin
      await db
        .update(userTable)
        .set({ role: 'admin', updatedAt: new Date() })
        .where(eq(userTable.email, ADMIN_EMAIL));
    }

    // Hash the password
    const hashedPassword = await hashPassword({
      password: ADMIN_PASSWORD,
      salt: crypto.randomBytes(16).toString('hex'),
    });

    // Check if account record exists
    const existingAccount = await db
      .select()
      .from(accountTable)
      .where(eq(accountTable.accountId, ADMIN_EMAIL))
      .get();

    if (!existingAccount) {
      // Create account record with password
      await db.insert(accountTable).values({
        id: crypto.randomUUID(),
        accountId: ADMIN_EMAIL,
        providerId: 'credential',
        userId: adminUser.id,
        password: hashedPassword,
      });
    } else {
      // Update existing account with new password hash
      await db
        .update(accountTable)
        .set({ password: hashedPassword })
        .where(eq(accountTable.accountId, ADMIN_EMAIL));
    }

    return {
      success: true,
      message: 'Admin user setup completed successfully',
      email: ADMIN_EMAIL,
      userId: adminUser.id,
      role: 'admin',
    };
  } catch (error) {
    console.error('Admin creation error:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify the request has the correct secret
    const authHeader = request.headers.get('authorization');
    const providedSecret = authHeader?.replace('Bearer ', '');

    if (providedSecret !== SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid setup secret' },
        { status: 401 }
      );
    }

    const result = await createOrUpdateAdmin();

    return NextResponse.json({
      success: true,
      ...result,
      credentials: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify the request has the correct secret
    const authHeader = request.headers.get('authorization');
    const providedSecret = authHeader?.replace('Bearer ', '');

    if (providedSecret !== SETUP_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid setup secret' },
        { status: 401 }
      );
    }

    // Check if admin user exists
    const adminUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, ADMIN_EMAIL))
      .get();

    const adminAccount = adminUser ? await db
      .select()
      .from(accountTable)
      .where(eq(accountTable.accountId, ADMIN_EMAIL))
      .get() : null;

    if (!adminUser) {
      return NextResponse.json({
        exists: false,
        message: 'Admin user does not exist',
        setupRequired: true,
      });
    }

    return NextResponse.json({
      exists: true,
      email: adminUser.email,
      role: adminUser.role,
      name: adminUser.name,
      isAdmin: adminUser.role === 'admin',
      hasPassword: !!adminAccount?.password,
      message: adminUser.role === 'admin' 
        ? 'Admin user exists with admin role' 
        : 'User exists but is not admin',
    });
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json(
      { error: 'Check failed', details: String(error) },
      { status: 500 }
    );
  }
}
