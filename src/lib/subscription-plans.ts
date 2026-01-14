/**
 * Milestone 4: Annual Subscription Workflow
 * Subscription plans, pricing tiers, and annual billing configuration
 * All timestamps in DD/MM/YYYY HH:mm:ss UK time format
 */

import { nowUKFormatted } from '@/lib/date-utils';

// ============================================
// SUBSCRIPTION PLANS
// ============================================

export type PlanInterval = 'monthly' | 'yearly';
export type PlanTier = 'free' | 'basic' | 'premium' | 'enterprise';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: PlanTier;
  interval: PlanInterval;
  price: number; // in GBP
  currency: string;
  stripePriceId: string;
  features: string[];
  maxProperties: number;
  maxPhotos: number;
  featuredListings: boolean;
  prioritySupport: boolean;
  analytics: boolean;
  customDomain: boolean;
  apiAccess: boolean;
  description: string;
}

// ============================================
// PRICING TIERS
// ============================================

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  // FREE/GUEST PLAN
  free: {
    id: 'free',
    name: 'Free Plan',
    tier: 'free',
    interval: 'monthly',
    price: 0,
    currency: 'GBP',
    stripePriceId: 'free',
    features: [
      'Up to 2 property listings',
      'Basic photo gallery (10 photos per property)',
      'Basic listing visibility',
      'Email support',
      'Mobile responsive design',
    ],
    maxProperties: 2,
    maxPhotos: 10,
    featuredListings: false,
    prioritySupport: false,
    analytics: false,
    customDomain: false,
    apiAccess: false,
    description: 'Perfect for getting started with property listings',
  },
  
  // BASIC PLANS
  basic_monthly: {
    id: 'basic_monthly',
    name: 'Basic Monthly',
    tier: 'basic',
    interval: 'monthly',
    price: 9.99,
    currency: 'GBP',
    stripePriceId: process.env.STRIPE_PRICE_BASIC_MONTHLY || '',
    features: [
      'Up to 5 property listings',
      'Standard photo gallery (20 photos per property)',
      'Basic analytics',
      'Email support',
      'Mobile responsive design',
    ],
    maxProperties: 5,
    maxPhotos: 20,
    featuredListings: false,
    prioritySupport: false,
    analytics: true,
    customDomain: false,
    apiAccess: false,
    description: 'Perfect for individual property owners',
  },
  
  basic_yearly: {
    id: 'basic_yearly',
    name: 'Basic Yearly',
    tier: 'basic',
    interval: 'yearly',
    price: 99.99,
    currency: 'GBP',
    stripePriceId: process.env.STRIPE_PRICE_BASIC_YEARLY || '',
    features: [
      'Up to 5 property listings',
      'Standard photo gallery (20 photos per property)',
      'Basic analytics',
      'Email support',
      'Mobile responsive design',
      '💰 Save £19.89 per year',
    ],
    maxProperties: 5,
    maxPhotos: 20,
    featuredListings: false,
    prioritySupport: false,
    analytics: true,
    customDomain: false,
    apiAccess: false,
    description: 'Perfect for individual property owners - Save 16.6% annually',
  },

  // PREMIUM PLANS
  premium_monthly: {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    tier: 'premium',
    interval: 'monthly',
    price: 14.99,
    currency: 'GBP',
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
    features: [
      'Up to 25 property listings',
      'Enhanced photo gallery (50 photos per property)',
      'Featured listings (3 properties)',
      'Advanced analytics & insights',
      'Priority email & chat support',
      'Social media integration',
      'Booking calendar',
    ],
    maxProperties: 25,
    maxPhotos: 50,
    featuredListings: true,
    prioritySupport: true,
    analytics: true,
    customDomain: false,
    apiAccess: false,
    description: 'Ideal for growing property businesses',
  },

  premium_yearly: {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    tier: 'premium',
    interval: 'yearly',
    price: 149.99,
    currency: 'GBP',
    stripePriceId: process.env.STRIPE_PRICE_PREMIUM_YEARLY || '',
    features: [
      'Up to 25 property listings',
      'Enhanced photo gallery (50 photos per property)',
      'Featured listings (3 properties)',
      'Advanced analytics & insights',
      'Priority email & chat support',
      'Social media integration',
      'Booking calendar',
      '💰 Save £29.89 per year',
    ],
    maxProperties: 25,
    maxPhotos: 50,
    featuredListings: true,
    prioritySupport: true,
    analytics: true,
    customDomain: false,
    apiAccess: false,
    description: 'Ideal for growing property businesses - Save 16.6% annually',
  },

  // ENTERPRISE PLANS
  enterprise_monthly: {
    id: 'enterprise_monthly',
    name: 'Enterprise Monthly',
    tier: 'enterprise',
    interval: 'monthly',
    price: 19.99,
    currency: 'GBP',
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
    features: [
      'Unlimited property listings',
      'Unlimited photos per property',
      'Unlimited featured listings',
      'Advanced analytics & custom reports',
      'Priority support (phone, email, chat)',
      'Custom domain support',
      'API access',
      'White-label options',
      'Dedicated account manager',
    ],
    maxProperties: -1, // unlimited
    maxPhotos: -1, // unlimited
    featuredListings: true,
    prioritySupport: true,
    analytics: true,
    customDomain: true,
    apiAccess: true,
    description: 'For established property management companies',
  },

  enterprise_yearly: {
    id: 'enterprise_yearly',
    name: 'Enterprise Yearly',
    tier: 'enterprise',
    interval: 'yearly',
    price: 199.99,
    currency: 'GBP',
    stripePriceId: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || '',
    features: [
      'Unlimited property listings',
      'Unlimited photos per property',
      'Unlimited featured listings',
      'Advanced analytics & custom reports',
      'Priority support (phone, email, chat)',
      'Custom domain support',
      'API access',
      'White-label options',
      'Dedicated account manager',
      '💰 Save £39.89 per year',
    ],
    maxProperties: -1, // unlimited
    maxPhotos: -1, // unlimited
    featuredListings: true,
    prioritySupport: true,
    analytics: true,
    customDomain: true,
    apiAccess: true,
    description: 'For established property management companies - Save 16.6% annually',
  },

  // TEST PRODUCTS (for development/testing) - Disabled (no price IDs configured)
  // Uncomment and add STRIPE_BASIC and STRIPE_BASIC2 to .env if you need test products
  /*
  test_basic: {
    id: 'test_basic',
    name: 'Test Basic - £1',
    tier: 'basic',
    interval: 'monthly',
    price: 1.00,
    currency: 'GBP',
    stripePriceId: process.env.STRIPE_BASIC || '',
    features: [
      '🧪 Test Product - £1',
      'Up to 5 property listings',
      'Standard photo gallery',
      'Email support',
    ],
    maxProperties: 5,
    maxPhotos: 20,
    featuredListings: false,
    prioritySupport: false,
    analytics: true,
    customDomain: false,
    apiAccess: false,
    description: 'Test product for £1 - verify payment tracking',
  },

  test_basic2: {
    id: 'test_basic2',
    name: 'Test Basic 2 - £2',
    tier: 'basic',
    interval: 'monthly',
    price: 2.00,
    currency: 'GBP',
    stripePriceId: process.env.STRIPE_BASIC2 || '',
    features: [
      '🧪 Test Product - £2',
      'Up to 5 property listings',
      'Standard photo gallery',
      'Email support',
    ],
    maxProperties: 5,
    maxPhotos: 20,
    featuredListings: false,
    prioritySupport: false,
    analytics: true,
    customDomain: false,
    apiAccess: false,
    description: 'Test product for £2 - verify payment tracking',
  },
  */
};

// ============================================
// TRIAL CONFIGURATION
// ============================================

export const TRIAL_CONFIG = {
  free: {
    days: 0,
    description: 'No trial needed - Always free',
  },
  basic: {
    days: 7,
    description: '7-day free trial',
  },
  premium: {
    days: 14,
    description: '14-day free trial',
  },
  enterprise: {
    days: 30,
    description: '30-day free trial',
  },
};

// ============================================
// BILLING CYCLE CONFIGURATION
// ============================================

export const BILLING_CYCLE_CONFIG = {
  monthly: {
    interval: 'month' as const,
    intervalCount: 1,
    description: 'Billed monthly',
  },
  yearly: {
    interval: 'year' as const,
    intervalCount: 1,
    description: 'Billed annually',
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get subscription plan by ID
 */
export function getPlanById(planId: string): SubscriptionPlan | null {
  return SUBSCRIPTION_PLANS[planId] || null;
}

/**
 * Get all plans for a specific tier
 */
export function getPlansByTier(tier: PlanTier): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS).filter(plan => plan.tier === tier);
}

/**
 * Get all plans for a specific interval
 */
export function getPlansByInterval(interval: PlanInterval): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS).filter(plan => plan.interval === interval);
}

/**
 * Calculate annual savings
 */
export function calculateAnnualSavings(tier: PlanTier): number {
  const monthly = SUBSCRIPTION_PLANS[`${tier}_monthly`];
  const yearly = SUBSCRIPTION_PLANS[`${tier}_yearly`];
  
  if (!monthly || !yearly) return 0;
  
  const monthlyAnnualCost = monthly.price * 12;
  const yearlyCost = yearly.price;
  
  return monthlyAnnualCost - yearlyCost;
}

/**
 * Calculate discount percentage for annual plans
 */
export function calculateAnnualDiscount(tier: PlanTier): number {
  const savings = calculateAnnualSavings(tier);
  const monthly = SUBSCRIPTION_PLANS[`${tier}_monthly`];
  
  if (!monthly || savings === 0) return 0;
  
  const monthlyAnnualCost = monthly.price * 12;
  return (savings / monthlyAnnualCost) * 100;
}

/**
 * Get trial days for tier
 */
export function getTrialDays(tier: PlanTier): number {
  return TRIAL_CONFIG[tier]?.days || 0;
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

/**
 * Get plan comparison data
 */
export function getPlanComparison() {
  const timestamp = nowUKFormatted();
  
  const comparison = {
    free: {
      monthly: SUBSCRIPTION_PLANS.free,
      yearly: null,
      savings: 0,
      discount: 0,
    },
    basic: {
      monthly: SUBSCRIPTION_PLANS.basic_monthly,
      yearly: SUBSCRIPTION_PLANS.basic_yearly,
      savings: calculateAnnualSavings('basic'),
      discount: calculateAnnualDiscount('basic'),
    },
    premium: {
      monthly: SUBSCRIPTION_PLANS.premium_monthly,
      yearly: SUBSCRIPTION_PLANS.premium_yearly,
      savings: calculateAnnualSavings('premium'),
      discount: calculateAnnualDiscount('premium'),
    },
    enterprise: {
      monthly: SUBSCRIPTION_PLANS.enterprise_monthly,
      yearly: SUBSCRIPTION_PLANS.enterprise_yearly,
      savings: calculateAnnualSavings('enterprise'),
      discount: calculateAnnualDiscount('enterprise'),
    },
    generatedAt: timestamp,
  };

  return comparison;
}

/**
 * Check if user can add more properties
 */
export function canAddProperty(currentCount: number, planId: string): boolean {
  const plan = getPlanById(planId);
  if (!plan) return false;
  
  // Unlimited
  if (plan.maxProperties === -1) return true;
  
  return currentCount < plan.maxProperties;
}

/**
 * Check if user can add more photos
 */
export function canAddPhotos(currentCount: number, planId: string): boolean {
  const plan = getPlanById(planId);
  if (!plan) return false;
  
  // Unlimited
  if (plan.maxPhotos === -1) return true;
  
  return currentCount < plan.maxPhotos;
}

/**
 * Get upgrade suggestions
 */
export function getUpgradeSuggestion(currentPlanId: string): SubscriptionPlan | null {
  const currentPlan = getPlanById(currentPlanId);
  if (!currentPlan) return null;

  // Already on enterprise
  if (currentPlan.tier === 'enterprise') return null;

  // Suggest next tier with same interval
  const nextTier = currentPlan.tier === 'basic' ? 'premium' : 'enterprise';
  return SUBSCRIPTION_PLANS[`${nextTier}_${currentPlan.interval}`] || null;
}

/**
 * Log plan information with UK timestamp
 */
export function logPlanInfo(planId: string, action: string, details?: any) {
  const timestamp = nowUKFormatted();
  const plan = getPlanById(planId);
  
  console.log(`[${timestamp}] Subscription Plan: ${action}`, {
    planId,
    planName: plan?.name,
    ...details,
  });
}
