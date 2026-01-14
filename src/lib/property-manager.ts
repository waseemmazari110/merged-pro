/**
 * Property Management Service
 * Complete CRUD operations for property listings
 * Includes photo management, amenities, and pricing
 */

import { db } from '@/db';
import { properties, propertyImages, propertyFeatures, seasonalPricing, specialDatePricing } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';

export interface CreatePropertyParams {
  ownerId: string;
  title: string;
  slug: string;
  location: string;
  region: string;
  sleepsMin: number;
  sleepsMax: number;
  bedrooms: number;
  bathrooms: number;
  priceFromMidweek: number;
  priceFromWeekend: number;
  description: string;
  houseRules?: string;
  checkInOut?: string;
  heroImage: string;
  heroVideo?: string;
  mapLat?: number;
  mapLng?: number;
  ownerContact?: string;
  iCalURL?: string;
}

export interface UpdatePropertyParams extends Partial<CreatePropertyParams> {
  id: number;
}

export interface PropertyImage {
  imageURL: string;
  caption?: string;
  orderIndex?: number;
}

export interface PropertyFeature {
  featureName: string;
}

/**
 * Log property action with UK timestamp
 */
function logPropertyAction(action: string, details?: any) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] Property Manager: ${action}`, details || '');
}

// ============================================
// PROPERTY CRUD OPERATIONS
// ============================================

/**
 * Create a new property listing
 */
export async function createProperty(params: CreatePropertyParams) {
  try {
    logPropertyAction('Creating property', { title: params.title, ownerId: params.ownerId });

    const timestamp = nowUKFormatted();

    const [property] = await db.insert(properties).values({
      ownerId: params.ownerId,
      title: params.title,
      slug: params.slug,
      location: params.location,
      region: params.region,
      sleepsMin: params.sleepsMin,
      sleepsMax: params.sleepsMax,
      bedrooms: params.bedrooms,
      bathrooms: params.bathrooms,
      priceFromMidweek: params.priceFromMidweek,
      priceFromWeekend: params.priceFromWeekend,
      description: params.description,
      houseRules: params.houseRules || '',
      checkInOut: params.checkInOut || 'Check-in: 4:00 PM | Check-out: 10:00 AM',
      heroImage: params.heroImage,
      heroVideo: params.heroVideo || '',
      mapLat: params.mapLat,
      mapLng: params.mapLng,
      ownerContact: params.ownerContact,
      iCalURL: params.iCalURL,
      status: 'pending', // Requires admin approval
      isPublished: false,
      featured: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    }).returning();

    logPropertyAction('Property created successfully', { propertyId: property.id });

    return { success: true, property };

  } catch (error) {
    logPropertyAction('Property creation failed', { error: (error as Error).message });
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Update existing property
 */
export async function updateProperty(params: UpdatePropertyParams) {
  try {
    logPropertyAction('Updating property', { id: params.id });

    const { id, ...updateData } = params;

    const [updated] = await db
      .update(properties)
      .set({
        ...updateData,
        updatedAt: nowUKFormatted(),
      })
      .where(eq(properties.id, id))
      .returning();

    logPropertyAction('Property updated successfully', { propertyId: id });

    return { success: true, property: updated };

  } catch (error) {
    logPropertyAction('Property update failed', { error: (error as Error).message });
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Delete property (soft delete by unpublishing)
 */
export async function deleteProperty(propertyId: number, ownerId: string) {
  try {
    logPropertyAction('Deleting property', { propertyId, ownerId });

    // Verify ownership
    const [property] = await db
      .select()
      .from(properties)
      .where(and(
        eq(properties.id, propertyId),
        eq(properties.ownerId, ownerId)
      ));

    if (!property) {
      return { success: false, error: 'Property not found or unauthorized' };
    }

    // Soft delete by unpublishing
    await db
      .update(properties)
      .set({
        isPublished: false,
        status: 'rejected',
        updatedAt: nowUKFormatted(),
      })
      .where(eq(properties.id, propertyId));

    logPropertyAction('Property deleted successfully', { propertyId });

    return { success: true };

  } catch (error) {
    logPropertyAction('Property deletion failed', { error: (error as Error).message });
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get property by ID
 */
export async function getPropertyById(propertyId: number) {
  try {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId));

    if (!property) {
      return { success: false, error: 'Property not found' };
    }

    // Get related data
    const images = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyId))
      .orderBy(propertyImages.orderIndex);

    const features = await db
      .select()
      .from(propertyFeatures)
      .where(eq(propertyFeatures.propertyId, propertyId));

    return {
      success: true,
      property: {
        ...property,
        images,
        features: features.map(f => f.featureName),
      },
    };

  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get all properties for an owner
 */
export async function getOwnerProperties(ownerId: string) {
  try {
    const ownerProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, ownerId))
      .orderBy(desc(properties.createdAt));

    // Get images count for each property
    const propertiesWithDetails = await Promise.all(
      ownerProperties.map(async (property) => {
        const images = await db
          .select()
          .from(propertyImages)
          .where(eq(propertyImages.propertyId, property.id));

        const features = await db
          .select()
          .from(propertyFeatures)
          .where(eq(propertyFeatures.propertyId, property.id));

        return {
          ...property,
          imageCount: images.length,
          featureCount: features.length,
        };
      })
    );

    return { success: true, properties: propertiesWithDetails };

  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================
// PHOTO MANAGEMENT
// ============================================

/**
 * Add images to property
 */
export async function addPropertyImages(
  propertyId: number,
  images: PropertyImage[]
) {
  try {
    logPropertyAction('Adding images to property', { propertyId, count: images.length });

    const timestamp = nowUKFormatted();

    const insertValues = images.map((img, index) => ({
      propertyId,
      imageURL: img.imageURL,
      caption: img.caption || '',
      orderIndex: img.orderIndex ?? index,
      createdAt: timestamp,
    }));

    await db.insert(propertyImages).values(insertValues);

    logPropertyAction('Images added successfully', { propertyId, count: images.length });

    return { success: true };

  } catch (error) {
    logPropertyAction('Image addition failed', { error: (error as Error).message });
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Remove image from property
 */
export async function removePropertyImage(imageId: number) {
  try {
    logPropertyAction('Removing image', { imageId });

    await db.delete(propertyImages).where(eq(propertyImages.id, imageId));

    logPropertyAction('Image removed successfully', { imageId });

    return { success: true };

  } catch (error) {
    logPropertyAction('Image removal failed', { error: (error as Error).message });
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Reorder property images
 */
export async function reorderPropertyImages(
  propertyId: number,
  imageOrders: { id: number; orderIndex: number }[]
) {
  try {
    logPropertyAction('Reordering images', { propertyId });

    for (const { id, orderIndex } of imageOrders) {
      await db
        .update(propertyImages)
        .set({ orderIndex })
        .where(and(
          eq(propertyImages.id, id),
          eq(propertyImages.propertyId, propertyId)
        ));
    }

    logPropertyAction('Images reordered successfully', { propertyId });

    return { success: true };

  } catch (error) {
    logPropertyAction('Image reordering failed', { error: (error as Error).message });
    return { success: false, error: (error as Error).message };
  }
}

// ============================================
// AMENITIES/FEATURES MANAGEMENT
// ============================================

/**
 * Add features/amenities to property
 */
export async function addPropertyFeatures(
  propertyId: number,
  features: string[]
) {
  try {
    logPropertyAction('Adding features to property', { propertyId, count: features.length });

    const timestamp = nowUKFormatted();

    // Remove existing features first
    await db.delete(propertyFeatures).where(eq(propertyFeatures.propertyId, propertyId));

    // Add new features
    if (features.length > 0) {
      const insertValues = features.map(feature => ({
        propertyId,
        featureName: feature,
        createdAt: timestamp,
      }));

      await db.insert(propertyFeatures).values(insertValues);
    }

    logPropertyAction('Features added successfully', { propertyId, count: features.length });

    return { success: true };

  } catch (error) {
    logPropertyAction('Feature addition failed', { error: (error as Error).message });
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get property features
 */
export async function getPropertyFeatures(propertyId: number) {
  try {
    const features = await db
      .select()
      .from(propertyFeatures)
      .where(eq(propertyFeatures.propertyId, propertyId));

    return { success: true, features: features.map(f => f.featureName) };

  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================
// PRICING MANAGEMENT
// ============================================

/**
 * Add seasonal pricing rule
 */
export async function addSeasonalPricing(params: {
  propertyId: number;
  name: string;
  seasonType: string;
  startDate: string;
  endDate: string;
  pricePerNight: number;
  dayType: string;
  minimumStay?: number;
  priority?: number;
}) {
  try {
    logPropertyAction('Adding seasonal pricing', { propertyId: params.propertyId });

    const timestamp = nowUKFormatted();

    const [pricing] = await db.insert(seasonalPricing).values({
      ...params,
      createdAt: timestamp,
      updatedAt: timestamp,
    }).returning();

    logPropertyAction('Seasonal pricing added', { id: pricing.id });

    return { success: true, pricing };

  } catch (error) {
    logPropertyAction('Seasonal pricing addition failed', { error: (error as Error).message });
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Add special date pricing (holidays, events)
 */
export async function addSpecialDatePricing(params: {
  propertyId: number;
  name: string;
  date: string;
  endDate?: string;
  pricePerNight: number;
  isAvailable?: boolean;
}) {
  try {
    logPropertyAction('Adding special date pricing', { propertyId: params.propertyId });

    const timestamp = nowUKFormatted();

    const [pricing] = await db.insert(specialDatePricing).values({
      ...params,
      isAvailable: params.isAvailable ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    }).returning();

    logPropertyAction('Special date pricing added', { id: pricing.id });

    return { success: true, pricing };

  } catch (error) {
    logPropertyAction('Special date pricing addition failed', { error: (error as Error).message });
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get all pricing rules for a property
 */
export async function getPropertyPricing(propertyId: number) {
  try {
    const seasonal = await db
      .select()
      .from(seasonalPricing)
      .where(eq(seasonalPricing.propertyId, propertyId));

    const special = await db
      .select()
      .from(specialDatePricing)
      .where(eq(specialDatePricing.propertyId, propertyId));

    return { success: true, seasonal, special };

  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================
// SUBMISSION & APPROVAL
// ============================================

/**
 * Submit property for approval
 */
export async function submitPropertyForApproval(propertyId: number, ownerId: string) {
  try {
    logPropertyAction('Submitting property for approval', { propertyId, ownerId });

    // Verify ownership
    const [property] = await db
      .select()
      .from(properties)
      .where(and(
        eq(properties.id, propertyId),
        eq(properties.ownerId, ownerId)
      ));

    if (!property) {
      return { success: false, error: 'Property not found or unauthorized' };
    }

    // Update status to pending
    await db
      .update(properties)
      .set({
        status: 'pending',
        updatedAt: nowUKFormatted(),
      })
      .where(eq(properties.id, propertyId));

    logPropertyAction('Property submitted for approval', { propertyId });

    return { success: true };

  } catch (error) {
    logPropertyAction('Property submission failed', { error: (error as Error).message });
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Generate unique slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if slug is unique
 */
export async function isSlugUnique(slug: string, excludeId?: number): Promise<boolean> {
  try {
    const existing = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, slug));

    if (excludeId) {
      return existing.length === 0 || (existing.length === 1 && existing[0].id === excludeId);
    }

    return existing.length === 0;

  } catch (error) {
    return false;
  }
}
