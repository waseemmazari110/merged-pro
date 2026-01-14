// Internal CRM Service - Phase 1
// Handles owner profiles, enquiries, activity logging, and notes

import { db } from "@/db";
import { 
  crmOwnerProfiles, 
  crmEnquiries, 
  crmActivityLog, 
  crmNotes,
  crmPropertyLinks 
} from "@/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export class InternalCRMService {
  // ============================================
  // OWNER PROFILE MANAGEMENT
  // ============================================

  async createOwnerProfile(data: {
    userId: string;
    businessName?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    alternatePhone?: string;
    alternateEmail?: string;
    taxId?: string;
    businessType?: string;
    registrationNumber?: string;
    preferredContactMethod?: string;
    notes?: string;
    tags?: string[];
    source?: string;
  }) {
    try {
      const [profile] = await db.insert(crmOwnerProfiles).values({
        ...data,
        tags: data.tags ? JSON.stringify(data.tags) : null,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).returning();

      // Log activity
      await this.logActivity({
        entityType: 'owner',
        entityId: data.userId,
        activityType: 'status_change',
        title: 'Owner Profile Created',
        description: `CRM profile created for owner`,
        performedBy: 'system',
      });

      return { success: true, profile };
    } catch (error: any) {
      console.error('Error creating owner profile:', error);
      return { success: false, error: error.message };
    }
  }

  async updateOwnerProfile(userId: string, data: Partial<typeof crmOwnerProfiles.$inferInsert>) {
    try {
      const [updated] = await db
        .update(crmOwnerProfiles)
        .set({
          ...data,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(crmOwnerProfiles.userId, userId))
        .returning();

      if (!updated) {
        return { success: false, error: 'Profile not found' };
      }

      await this.logActivity({
        entityType: 'owner',
        entityId: userId,
        activityType: 'note',
        title: 'Owner Profile Updated',
        description: `Profile information updated`,
        performedBy: 'system',
      });

      return { success: true, profile: updated };
    } catch (error: any) {
      console.error('Error updating owner profile:', error);
      return { success: false, error: error.message };
    }
  }

  async getOwnerProfile(userId: string) {
    try {
      const [profile] = await db
        .select()
        .from(crmOwnerProfiles)
        .where(eq(crmOwnerProfiles.userId, userId));

      return { success: true, profile: profile || null };
    } catch (error: any) {
      console.error('Error fetching owner profile:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // ENQUIRY MANAGEMENT
  // ============================================

  async createEnquiry(data: {
    ownerId?: string;
    propertyId?: number;
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    subject: string;
    message: string;
    enquiryType?: string;
    status?: string;
    priority?: string;
    source?: string;
    checkInDate?: string;
    checkOutDate?: string;
    numberOfGuests?: number;
    budget?: number;
    notes?: string;
  }) {
    try {
      const [enquiry] = await db.insert(crmEnquiries).values({
        ...data,
        status: data.status || 'new',
        priority: data.priority || 'medium',
        enquiryType: data.enquiryType || 'general',
        source: data.source || 'website',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).returning();

      // Log activity
      await this.logActivity({
        entityType: 'enquiry',
        entityId: enquiry.id.toString(),
        activityType: 'note',
        title: 'New Enquiry Created',
        description: `Enquiry from ${data.guestName} - ${data.subject}`,
        performedBy: 'system',
      });

      return { success: true, enquiry };
    } catch (error: any) {
      console.error('Error creating enquiry:', error);
      return { success: false, error: error.message };
    }
  }

  async updateEnquiry(enquiryId: number, data: Partial<typeof crmEnquiries.$inferInsert>) {
    try {
      const [updated] = await db
        .update(crmEnquiries)
        .set({
          ...data,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(crmEnquiries.id, enquiryId))
        .returning();

      if (!updated) {
        return { success: false, error: 'Enquiry not found' };
      }

      await this.logActivity({
        entityType: 'enquiry',
        entityId: enquiryId.toString(),
        activityType: 'status_change',
        title: 'Enquiry Updated',
        description: `Enquiry status or details updated`,
        performedBy: 'system',
      });

      return { success: true, enquiry: updated };
    } catch (error: any) {
      console.error('Error updating enquiry:', error);
      return { success: false, error: error.message };
    }
  }

  async getEnquiriesByOwner(ownerId: string, limit = 50) {
    try {
      const enquiries = await db
        .select()
        .from(crmEnquiries)
        .where(eq(crmEnquiries.ownerId, ownerId))
        .orderBy(desc(crmEnquiries.createdAt))
        .limit(limit);

      return { success: true, enquiries };
    } catch (error: any) {
      console.error('Error fetching enquiries:', error);
      return { success: false, error: error.message };
    }
  }

  async getEnquiriesByProperty(propertyId: number, limit = 50) {
    try {
      const enquiries = await db
        .select()
        .from(crmEnquiries)
        .where(eq(crmEnquiries.propertyId, propertyId))
        .orderBy(desc(crmEnquiries.createdAt))
        .limit(limit);

      return { success: true, enquiries };
    } catch (error: any) {
      console.error('Error fetching enquiries:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // ACTIVITY LOGGING
  // ============================================

  async logActivity(data: {
    entityType: 'owner' | 'enquiry' | 'property' | 'booking';
    entityId: string;
    activityType: 'email' | 'phone_call' | 'meeting' | 'note' | 'status_change' | 'document_upload';
    title: string;
    description?: string;
    outcome?: string;
    performedBy?: string;
    metadata?: any;
  }) {
    try {
      await db.insert(crmActivityLog).values({
        ...data,
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
        createdAt: new Date().toISOString(),
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error logging activity:', error);
      return { success: false, error: error.message };
    }
  }

  async getActivities(entityType: string, entityId: string, limit = 50) {
    try {
      const activities = await db
        .select()
        .from(crmActivityLog)
        .where(
          and(
            eq(crmActivityLog.entityType, entityType),
            eq(crmActivityLog.entityId, entityId)
          )
        )
        .orderBy(desc(crmActivityLog.createdAt))
        .limit(limit);

      return { success: true, activities };
    } catch (error: any) {
      console.error('Error fetching activities:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // NOTES & REMINDERS
  // ============================================

  async createNote(data: {
    entityType: 'owner' | 'enquiry' | 'property';
    entityId: string;
    noteType?: 'note' | 'reminder' | 'todo';
    title?: string;
    content: string;
    priority?: string;
    dueDate?: string;
    createdBy?: string;
    assignedTo?: string;
  }) {
    try {
      const [note] = await db.insert(crmNotes).values({
        ...data,
        noteType: data.noteType || 'note',
        priority: data.priority || 'normal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).returning();

      return { success: true, note };
    } catch (error: any) {
      console.error('Error creating note:', error);
      return { success: false, error: error.message };
    }
  }

  async updateNote(noteId: number, data: Partial<typeof crmNotes.$inferInsert>) {
    try {
      const [updated] = await db
        .update(crmNotes)
        .set({
          ...data,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(crmNotes.id, noteId))
        .returning();

      return { success: true, note: updated };
    } catch (error: any) {
      console.error('Error updating note:', error);
      return { success: false, error: error.message };
    }
  }

  async getNotes(entityType: string, entityId: string) {
    try {
      const notes = await db
        .select()
        .from(crmNotes)
        .where(
          and(
            eq(crmNotes.entityType, entityType),
            eq(crmNotes.entityId, entityId)
          )
        )
        .orderBy(desc(crmNotes.createdAt));

      return { success: true, notes };
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // PROPERTY LINKS
  // ============================================

  async linkPropertyToOwner(data: {
    ownerId: string;
    propertyId: number;
    linkStatus?: string;
    ownershipType?: string;
    commissionRate?: number;
    contractStartDate?: string;
    contractEndDate?: string;
    notes?: string;
  }) {
    try {
      const [link] = await db.insert(crmPropertyLinks).values({
        ...data,
        linkStatus: data.linkStatus || 'active',
        ownershipType: data.ownershipType || 'full',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).returning();

      await this.logActivity({
        entityType: 'owner',
        entityId: data.ownerId,
        activityType: 'note',
        title: 'Property Linked',
        description: `Property ID ${data.propertyId} linked to owner`,
        performedBy: 'system',
      });

      return { success: true, link };
    } catch (error: any) {
      console.error('Error linking property:', error);
      return { success: false, error: error.message };
    }
  }

  async getOwnerProperties(ownerId: string) {
    try {
      const links = await db
        .select()
        .from(crmPropertyLinks)
        .where(eq(crmPropertyLinks.ownerId, ownerId))
        .orderBy(desc(crmPropertyLinks.createdAt));

      return { success: true, properties: links };
    } catch (error: any) {
      console.error('Error fetching owner properties:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const crmService = new InternalCRMService();
