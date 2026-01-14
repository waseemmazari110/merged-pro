import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { crmService } from "@/lib/crm-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, email, phone, propertyName, propertyAddress, companyName, role } = body;

    // Use either userId or email to find the user
    let userIdentifier;
    if (userId) {
      userIdentifier = eq(user.id, userId);
    } else if (email) {
      userIdentifier = eq(user.email, email);
    } else {
      return NextResponse.json(
        { error: "User ID or email is required" },
        { status: 400 }
      );
    }

    // Update user with additional owner information
    await db
      .update(user)
      .set({
        role: role || "owner",
        phone: phone || null,
        companyName: companyName || propertyName || null,
        updatedAt: new Date(),
      })
      .where(userIdentifier);

    // Fetch updated user data
    const [updatedUser] = await db
      .select()
      .from(user)
      .where(userIdentifier);

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found after update" },
        { status: 404 }
      );
    }

    // Auto-create CRM owner profile
    const crmResult = await crmService.createOwnerProfile({
      userId: updatedUser.id,
      businessName: companyName || propertyName || undefined,
      address: propertyAddress || undefined,
      alternatePhone: phone || undefined,
      source: 'website_signup',
    });

    if (!crmResult.success) {
      console.error("Failed to create CRM profile:", crmResult.error);
      // Don't fail the signup, just log the error
    }

    return NextResponse.json({
      success: true,
      message: "Owner profile completed successfully",
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
    console.error("Complete signup error:", error);
    return NextResponse.json(
      { error: "Failed to complete signup" },
      { status: 500 }
    );
  }
}

