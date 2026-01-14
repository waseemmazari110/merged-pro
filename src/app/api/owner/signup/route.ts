import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, account } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, companyName } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with owner role
    const now = new Date();
    const newUser = await db
      .insert(user)
      .values({
        id: crypto.randomUUID(),
        name,
        email,
        role: "owner",
        phone: phone || null,
        companyName: companyName || null,
        emailVerified: false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    if (!newUser[0]) {
      throw new Error("Failed to create user");
    }

    // Create account entry with password
    await db.insert(account).values({
      id: crypto.randomUUID(),
      accountId: newUser[0].id,
      providerId: "credential",
      userId: newUser[0].id,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      message: "Owner account created successfully",
      user: {
        id: newUser[0].id,
        name: newUser[0].name,
        email: newUser[0].email,
        role: newUser[0].role,
      },
    });
  } catch (error) {
    console.error("Owner signup error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create owner account";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
