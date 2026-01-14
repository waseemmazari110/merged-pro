/**
 * Amenities Management System
 * 
 * Manages property amenities/features with categorization,
 * icons, and availability tracking.
 * 
 * Features:
 * - Predefined amenity categories
 * - Icon support
 * - Property-amenity linking
 * - Availability tracking
 * - UK timestamp format
 */

import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { nowUKFormatted } from './date-utils';

// ============================================
// TYPES & INTERFACES
// ============================================

export type AmenityCategory = 
  | 'essentials'
  | 'kitchen'
  | 'bathroom'
  | 'bedroom'
  | 'entertainment'
  | 'outdoor'
  | 'family'
  | 'safety'
  | 'accessibility'
  | 'parking'
  | 'other';

export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategory;
  icon?: string;
  description?: string;
  isPremium?: boolean;
}

export interface PropertyAmenity {
  propertyId: number;
  amenityId: string;
  available: boolean;
  notes?: string;
  addedAt: string; // UK format: DD/MM/YYYY HH:mm:ss
}

// ============================================
// PREDEFINED AMENITIES
// ============================================

export const STANDARD_AMENITIES: Record<string, Amenity> = {
  // Essentials
  'wifi': {
    id: 'wifi',
    name: 'WiFi',
    category: 'essentials',
    icon: 'wifi',
    description: 'High-speed wireless internet',
  },
  'heating': {
    id: 'heating',
    name: 'Heating',
    category: 'essentials',
    icon: 'thermometer',
    description: 'Central heating throughout',
  },
  'air-conditioning': {
    id: 'air-conditioning',
    name: 'Air Conditioning',
    category: 'essentials',
    icon: 'wind',
    description: 'Climate control',
  },
  'hot-water': {
    id: 'hot-water',
    name: 'Hot Water',
    category: 'essentials',
    icon: 'droplet',
    description: 'Unlimited hot water',
  },
  'towels': {
    id: 'towels',
    name: 'Towels',
    category: 'essentials',
    icon: 'package',
    description: 'Fresh towels provided',
  },
  'bed-linens': {
    id: 'bed-linens',
    name: 'Bed Linens',
    category: 'essentials',
    icon: 'home',
    description: 'Clean bed linens provided',
  },

  // Kitchen
  'kitchen': {
    id: 'kitchen',
    name: 'Full Kitchen',
    category: 'kitchen',
    icon: 'utensils',
    description: 'Fully equipped kitchen',
  },
  'refrigerator': {
    id: 'refrigerator',
    name: 'Refrigerator',
    category: 'kitchen',
    icon: 'archive',
    description: 'Full-size refrigerator',
  },
  'microwave': {
    id: 'microwave',
    name: 'Microwave',
    category: 'kitchen',
    icon: 'box',
    description: 'Microwave oven',
  },
  'dishwasher': {
    id: 'dishwasher',
    name: 'Dishwasher',
    category: 'kitchen',
    icon: 'droplets',
    description: 'Automatic dishwasher',
  },
  'coffee-maker': {
    id: 'coffee-maker',
    name: 'Coffee Maker',
    category: 'kitchen',
    icon: 'coffee',
    description: 'Coffee machine',
  },
  'oven': {
    id: 'oven',
    name: 'Oven',
    category: 'kitchen',
    icon: 'square',
    description: 'Full oven',
  },
  'stove': {
    id: 'stove',
    name: 'Stove',
    category: 'kitchen',
    icon: 'flame',
    description: 'Gas or electric stove',
  },

  // Bathroom
  'hair-dryer': {
    id: 'hair-dryer',
    name: 'Hair Dryer',
    category: 'bathroom',
    icon: 'wind',
    description: 'Hair dryer provided',
  },
  'shampoo': {
    id: 'shampoo',
    name: 'Shampoo',
    category: 'bathroom',
    icon: 'droplet',
    description: 'Toiletries provided',
  },
  'bathtub': {
    id: 'bathtub',
    name: 'Bathtub',
    category: 'bathroom',
    icon: 'inbox',
    description: 'Full bathtub',
  },
  'shower': {
    id: 'shower',
    name: 'Shower',
    category: 'bathroom',
    icon: 'droplets',
    description: 'Separate shower',
  },

  // Bedroom
  'king-bed': {
    id: 'king-bed',
    name: 'King Bed',
    category: 'bedroom',
    icon: 'bed',
    description: 'King-size bed',
  },
  'queen-bed': {
    id: 'queen-bed',
    name: 'Queen Bed',
    category: 'bedroom',
    icon: 'bed',
    description: 'Queen-size bed',
  },
  'single-bed': {
    id: 'single-bed',
    name: 'Single Bed',
    category: 'bedroom',
    icon: 'bed',
    description: 'Single bed',
  },
  'wardrobe': {
    id: 'wardrobe',
    name: 'Wardrobe',
    category: 'bedroom',
    icon: 'archive',
    description: 'Clothing storage',
  },

  // Entertainment
  'tv': {
    id: 'tv',
    name: 'TV',
    category: 'entertainment',
    icon: 'tv',
    description: 'Flat-screen TV',
  },
  'streaming': {
    id: 'streaming',
    name: 'Streaming Services',
    category: 'entertainment',
    icon: 'video',
    description: 'Netflix, Prime, etc.',
    isPremium: true,
  },
  'sound-system': {
    id: 'sound-system',
    name: 'Sound System',
    category: 'entertainment',
    icon: 'music',
    description: 'Audio system',
    isPremium: true,
  },
  'board-games': {
    id: 'board-games',
    name: 'Board Games',
    category: 'entertainment',
    icon: 'grid',
    description: 'Board games and puzzles',
  },

  // Outdoor
  'garden': {
    id: 'garden',
    name: 'Private Garden',
    category: 'outdoor',
    icon: 'leaf',
    description: 'Private outdoor garden',
    isPremium: true,
  },
  'balcony': {
    id: 'balcony',
    name: 'Balcony',
    category: 'outdoor',
    icon: 'layout',
    description: 'Private balcony',
  },
  'patio': {
    id: 'patio',
    name: 'Patio',
    category: 'outdoor',
    icon: 'square',
    description: 'Outdoor patio area',
  },
  'bbq': {
    id: 'bbq',
    name: 'BBQ Grill',
    category: 'outdoor',
    icon: 'flame',
    description: 'Barbecue grill',
  },
  'outdoor-furniture': {
    id: 'outdoor-furniture',
    name: 'Outdoor Furniture',
    category: 'outdoor',
    icon: 'sun',
    description: 'Outdoor seating',
  },
  'hot-tub': {
    id: 'hot-tub',
    name: 'Hot Tub',
    category: 'outdoor',
    icon: 'droplets',
    description: 'Private hot tub',
    isPremium: true,
  },
  'pool': {
    id: 'pool',
    name: 'Swimming Pool',
    category: 'outdoor',
    icon: 'waves',
    description: 'Private pool',
    isPremium: true,
  },

  // Family
  'crib': {
    id: 'crib',
    name: 'Baby Crib',
    category: 'family',
    icon: 'baby',
    description: 'Baby crib available',
  },
  'high-chair': {
    id: 'high-chair',
    name: 'High Chair',
    category: 'family',
    icon: 'chair',
    description: 'Baby high chair',
  },
  'toys': {
    id: 'toys',
    name: 'Toys',
    category: 'family',
    icon: 'gift',
    description: 'Toys for children',
  },
  'playground': {
    id: 'playground',
    name: 'Playground',
    category: 'family',
    icon: 'sun',
    description: 'Children\'s playground',
  },

  // Safety
  'smoke-alarm': {
    id: 'smoke-alarm',
    name: 'Smoke Alarm',
    category: 'safety',
    icon: 'alert-circle',
    description: 'Smoke detector',
  },
  'carbon-monoxide': {
    id: 'carbon-monoxide',
    name: 'Carbon Monoxide Alarm',
    category: 'safety',
    icon: 'alert-triangle',
    description: 'CO detector',
  },
  'fire-extinguisher': {
    id: 'fire-extinguisher',
    name: 'Fire Extinguisher',
    category: 'safety',
    icon: 'alert-octagon',
    description: 'Fire extinguisher',
  },
  'first-aid': {
    id: 'first-aid',
    name: 'First Aid Kit',
    category: 'safety',
    icon: 'plus-circle',
    description: 'First aid kit',
  },
  'security-cameras': {
    id: 'security-cameras',
    name: 'Security Cameras',
    category: 'safety',
    icon: 'camera',
    description: 'External cameras only',
  },

  // Accessibility
  'wheelchair-accessible': {
    id: 'wheelchair-accessible',
    name: 'Wheelchair Accessible',
    category: 'accessibility',
    icon: 'accessibility',
    description: 'Fully wheelchair accessible',
  },
  'step-free': {
    id: 'step-free',
    name: 'Step-Free Entry',
    category: 'accessibility',
    icon: 'minus-circle',
    description: 'No steps to enter',
  },
  'grab-bars': {
    id: 'grab-bars',
    name: 'Grab Bars',
    category: 'accessibility',
    icon: 'columns',
    description: 'Bathroom grab bars',
  },

  // Parking
  'free-parking': {
    id: 'free-parking',
    name: 'Free Parking',
    category: 'parking',
    icon: 'car',
    description: 'Free on-site parking',
  },
  'paid-parking': {
    id: 'paid-parking',
    name: 'Paid Parking',
    category: 'parking',
    icon: 'credit-card',
    description: 'Paid parking available',
  },
  'ev-charger': {
    id: 'ev-charger',
    name: 'EV Charger',
    category: 'parking',
    icon: 'zap',
    description: 'Electric vehicle charger',
    isPremium: true,
  },
  'garage': {
    id: 'garage',
    name: 'Garage',
    category: 'parking',
    icon: 'home',
    description: 'Private garage',
    isPremium: true,
  },

  // Other
  'washer': {
    id: 'washer',
    name: 'Washer',
    category: 'other',
    icon: 'refresh-cw',
    description: 'Washing machine',
  },
  'dryer': {
    id: 'dryer',
    name: 'Dryer',
    category: 'other',
    icon: 'sun',
    description: 'Tumble dryer',
  },
  'iron': {
    id: 'iron',
    name: 'Iron',
    category: 'other',
    icon: 'droplet',
    description: 'Iron and ironing board',
  },
  'workspace': {
    id: 'workspace',
    name: 'Dedicated Workspace',
    category: 'other',
    icon: 'briefcase',
    description: 'Desk and chair for work',
  },
  'pet-friendly': {
    id: 'pet-friendly',
    name: 'Pet Friendly',
    category: 'other',
    icon: 'paw',
    description: 'Pets allowed',
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all amenities by category
 */
export function getAmenitiesByCategory(category: AmenityCategory): Amenity[] {
  return Object.values(STANDARD_AMENITIES).filter(a => a.category === category);
}

/**
 * Get all categories with amenity counts
 */
export function getCategoriesWithCounts(): Array<{
  category: AmenityCategory;
  count: number;
  amenities: Amenity[];
}> {
  const categories: AmenityCategory[] = [
    'essentials',
    'kitchen',
    'bathroom',
    'bedroom',
    'entertainment',
    'outdoor',
    'family',
    'safety',
    'accessibility',
    'parking',
    'other',
  ];

  return categories.map(category => ({
    category,
    count: getAmenitiesByCategory(category).length,
    amenities: getAmenitiesByCategory(category),
  }));
}

/**
 * Get premium amenities
 */
export function getPremiumAmenities(): Amenity[] {
  return Object.values(STANDARD_AMENITIES).filter(a => a.isPremium);
}

/**
 * Get amenity by ID
 */
export function getAmenityById(id: string): Amenity | undefined {
  return STANDARD_AMENITIES[id];
}

/**
 * Search amenities
 */
export function searchAmenities(query: string): Amenity[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(STANDARD_AMENITIES).filter(
    a =>
      a.name.toLowerCase().includes(lowerQuery) ||
      a.description?.toLowerCase().includes(lowerQuery) ||
      a.category.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: AmenityCategory): string {
  const names: Record<AmenityCategory, string> = {
    essentials: 'Essentials',
    kitchen: 'Kitchen & Dining',
    bathroom: 'Bathroom',
    bedroom: 'Bedroom & Laundry',
    entertainment: 'Entertainment',
    outdoor: 'Outdoor',
    family: 'Family',
    safety: 'Safety & Security',
    accessibility: 'Accessibility',
    parking: 'Parking & Transport',
    other: 'Other',
  };
  return names[category];
}

/**
 * Validate amenity IDs
 */
export function validateAmenityIds(ids: string[]): {
  valid: string[];
  invalid: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const id of ids) {
    if (STANDARD_AMENITIES[id]) {
      valid.push(id);
    } else {
      invalid.push(id);
    }
  }

  return { valid, invalid };
}

/**
 * Store property amenities in database (using property_features table)
 */
export async function savePropertyAmenities(
  propertyId: number,
  amenityIds: string[]
): Promise<void> {
  const now = nowUKFormatted();

  // Validate amenity IDs
  const { valid, invalid } = validateAmenityIds(amenityIds);
  if (invalid.length > 0) {
    throw new Error(`Invalid amenity IDs: ${invalid.join(', ')}`);
  }

  // Delete existing amenities for this property
  await db.run(sql`DELETE FROM property_features WHERE property_id = ${propertyId}`);

  // Insert new amenities
  if (valid.length > 0) {
    for (const amenityId of valid) {
      const amenity = STANDARD_AMENITIES[amenityId];
      await db.run(
        sql`INSERT INTO property_features (property_id, feature_name, created_at) 
            VALUES (${propertyId}, ${amenity.name}, ${now})`
      );
    }
  }
}

/**
 * Get property amenities from database
 */
export async function getPropertyAmenities(propertyId: number): Promise<Amenity[]> {
  const result = await db.run(
    sql`SELECT feature_name FROM property_features WHERE property_id = ${propertyId}`
  );

  const featureNames = (result.rows as unknown as Array<{ feature_name: string }>).map(
    row => row.feature_name
  );

  // Map feature names back to amenity objects
  const amenities: Amenity[] = [];
  for (const featureName of featureNames) {
    const amenity = Object.values(STANDARD_AMENITIES).find(
      a => a.name === featureName
    );
    if (amenity) {
      amenities.push(amenity);
    }
  }

  return amenities;
}

/**
 * Get amenities summary for multiple properties
 */
export async function getPropertiesAmenitiesSummary(
  propertyIds: number[]
): Promise<Map<number, Amenity[]>> {
  const summary = new Map<number, Amenity[]>();

  for (const propertyId of propertyIds) {
    const amenities = await getPropertyAmenities(propertyId);
    summary.set(propertyId, amenities);
  }

  return summary;
}
