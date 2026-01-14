import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET - Fetch owner profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));

    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      phone: userData.phone,
      companyName: userData.companyName,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT - Update owner profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, phone, companyName } = body;

    // Update user profile
    await db
      .update(user)
      .set({
        name: name || undefined,
        phone: phone || null,
        companyName: companyName || null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    // Fetch updated user data
    const [updatedUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, session.user.id));

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        phone: updatedUser.phone,
        companyName: updatedUser.companyName,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
