/**
 * Property Validation Schemas
 * 
 * Validation logic for property-related operations in the Owner Dashboard.
 * Uses Zod for runtime type checking and validation.
 */

import { z } from 'zod';

// ============================================
// Property Creation/Update Schemas
// ============================================

export const propertySchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must not exceed 200 characters'),
  
  location: z.string()
    .min(3, 'Location is required'),
  
  region: z.string()
    .min(2, 'Region is required'),
  
  sleepsMin: z.number()
    .int('Must be a whole number')
    .min(1, 'Minimum sleeps must be at least 1')
    .max(100, 'Minimum sleeps cannot exceed 100'),
  
  sleepsMax: z.number()
    .int('Must be a whole number')
    .min(1, 'Maximum sleeps must be at least 1')
    .max(100, 'Maximum sleeps cannot exceed 100'),
  
  bedrooms: z.number()
    .int('Must be a whole number')
    .min(1, 'Must have at least 1 bedroom')
    .max(50, 'Bedrooms cannot exceed 50'),
  
  bathrooms: z.number()
    .int('Must be a whole number')
    .min(1, 'Must have at least 1 bathroom')
    .max(50, 'Bathrooms cannot exceed 50'),
  
  priceFromMidweek: z.number()
    .min(0, 'Price cannot be negative')
    .max(100000, 'Price seems unreasonably high'),
  
  priceFromWeekend: z.number()
    .min(0, 'Price cannot be negative')
    .max(100000, 'Price seems unreasonably high'),
  
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  
  heroImage: z.string()
    .url('Hero image must be a valid URL'),
  
  heroVideo: z.string()
    .url('Hero video must be a valid URL')
    .optional(),
  
  floorplanURL: z.string()
    .url('Floorplan must be a valid URL')
    .optional(),
  
  houseRules: z.string()
    .max(2000, 'House rules must not exceed 2000 characters')
    .optional(),
  
  checkInOut: z.string()
    .max(500, 'Check-in/out info must not exceed 500 characters')
    .optional(),
  
  iCalURL: z.string()
    .url('iCal URL must be valid')
    .optional(),
  
  mapLat: z.number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude')
    .optional(),
  
  mapLng: z.number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude')
    .optional(),
  
  ownerContact: z.string()
    .email('Invalid email address')
    .optional(),
  
  featured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  
  // Status field (for admin use only - will be filtered in owner APIs)
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

// Partial schema for updates (all fields optional)
export const propertyUpdateSchema = propertySchema.partial();

// Schema for property creation (requires all mandatory fields)
export const propertyCreateSchema = propertySchema.refine(
  (data) => data.sleepsMax >= data.sleepsMin,
  {
    message: 'Maximum sleeps must be greater than or equal to minimum sleeps',
    path: ['sleepsMax'],
  }
);

// ============================================
// Property Feature Schemas
// ============================================

export const propertyFeatureSchema = z.object({
  featureName: z.string()
    .min(2, 'Feature name must be at least 2 characters')
    .max(100, 'Feature name must not exceed 100 characters'),
  propertyId: z.number().int().positive(),
});

export const bulkFeaturesSchema = z.object({
  propertyId: z.number().int().positive(),
  features: z.array(z.string().min(1).max(100))
    .min(1, 'At least one feature is required')
    .max(50, 'Cannot add more than 50 features at once'),
});

// ============================================
// Property Image Schemas
// ============================================

export const propertyImageSchema = z.object({
  propertyId: z.number().int().positive(),
  imageURL: z.string().url('Must be a valid URL'),
  caption: z.string()
    .max(200, 'Caption must not exceed 200 characters')
    .optional(),
  orderIndex: z.number()
    .int('Order must be a whole number')
    .min(0, 'Order cannot be negative')
    .optional(),
});

export const bulkImagesSchema = z.object({
  propertyId: z.number().int().positive(),
  images: z.array(z.object({
    imageURL: z.string().url(),
    caption: z.string().max(200).optional(),
    orderIndex: z.number().int().min(0).optional(),
  }))
    .min(1, 'At least one image is required')
    .max(30, 'Cannot add more than 30 images at once'),
});

export const reorderImagesSchema = z.object({
  propertyId: z.number().int().positive(),
  imageIds: z.array(z.number().int().positive())
    .min(1, 'At least one image ID is required'),
});

// ============================================
// Pricing Management Schemas
// ============================================

export const seasonalPricingSchema = z.object({
  propertyId: z.number().int().positive(),
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  seasonType: z.enum(['peak', 'high', 'mid', 'low', 'off-peak']),
  startDate: z.string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in DD/MM/YYYY format'),
  endDate: z.string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in DD/MM/YYYY format'),
  pricePerNight: z.number()
    .min(0, 'Price cannot be negative')
    .max(100000, 'Price seems unreasonably high'),
  minimumStay: z.number()
    .int('Must be a whole number')
    .min(1, 'Minimum stay must be at least 1 night')
    .max(365, 'Minimum stay cannot exceed 365 nights')
    .optional(),
  dayType: z.enum(['weekday', 'weekend', 'any']).default('any'),
  isActive: z.boolean().optional(),
  priority: z.number().int().min(0).optional(),
});

export const specialDatePricingSchema = z.object({
  propertyId: z.number().int().positive(),
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  date: z.string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in DD/MM/YYYY format'),
  endDate: z.string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in DD/MM/YYYY format')
    .optional(),
  pricePerNight: z.number()
    .min(0, 'Price cannot be negative')
    .max(100000, 'Price seems unreasonably high'),
  minimumStay: z.number()
    .int('Must be a whole number')
    .min(1, 'Minimum stay must be at least 1 night')
    .optional(),
  isAvailable: z.boolean().optional(),
});

// ============================================
// Validation Helper Functions
// ============================================

export type ValidationResult<T> = 
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

/**
 * Validate data against a schema and return typed result
 */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  const errors: Record<string, string[]> = {};
  
  result.error.issues.forEach((error) => {
    const path = error.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(error.message);
  });
  
  return { success: false, errors };
}

/**
 * Validate property ownership
 */
export function validateOwnership(
  propertyOwnerId: string | null,
  userId: string,
  isAdmin: boolean = false
): boolean {
  if (isAdmin) return true;
  return propertyOwnerId === userId;
}

/**
 * Check if user has reached property limit based on subscription
 */
export function canCreateProperty(
  currentPropertyCount: number,
  subscriptionTier: string
): { allowed: boolean; reason?: string } {
  const limits: Record<string, number> = {
    free: 1,
    basic: 3,
    premium: 10,
    enterprise: 100,
  };
  
  const limit = limits[subscriptionTier] || limits.free;
  
  if (currentPropertyCount >= limit) {
    return {
      allowed: false,
      reason: `Your ${subscriptionTier} plan allows up to ${limit} ${limit === 1 ? 'property' : 'properties'}. Please upgrade to add more.`,
    };
  }
  
  return { allowed: true };
}

/**
 * Validate date ranges
 */
export function validateDateRange(
  startDate: string,
  endDate: string
): { valid: boolean; message?: string } {
  const start = parseDDMMYYYY(startDate);
  const end = parseDDMMYYYY(endDate);
  
  if (!start || !end) {
    return { valid: false, message: 'Invalid date format' };
  }
  
  if (end < start) {
    return { valid: false, message: 'End date must be after start date' };
  }
  
  return { valid: true };
}

/**
 * Parse DD/MM/YYYY date string
 */
function parseDDMMYYYY(dateStr: string): Date | null {
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  
  const [, day, month, year] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  // Check if date is valid
  if (isNaN(date.getTime())) return null;
  
  return date;
}

// ============================================
// Property Status Management Schemas (Admin)
// ============================================

export const propertyStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).refine(
    (val) => ['pending', 'approved', 'rejected'].includes(val),
    { message: 'Status must be pending, approved, or rejected' }
  ),
  rejectionReason: z.string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(500, 'Rejection reason must not exceed 500 characters')
    .optional(),
});

export const approvePropertySchema = z.object({
  propertyId: z.number().int().positive('Property ID must be a positive integer'),
});

export const rejectPropertySchema = z.object({
  propertyId: z.number().int().positive('Property ID must be a positive integer'),
  reason: z.string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(500, 'Rejection reason must not exceed 500 characters'),
});
