// Server-side price ID mapping (uses server environment variables)
export const getPlanPriceId = (planId: PlanId, interval: 'monthly' | 'yearly' = 'yearly'): string => {
  const priceMap = {
    bronze: {
      monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || 'price_1SlA8rI0J9sqa21Cpr3kyVzE',
      yearly: process.env.STRIPE_PRICE_BASIC_YEARLY || 'price_1SlA97I0J9sqa21Cs4lB88Zd',
    },
    silver: {
      monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || 'price_1SlA9zI0J9sqa21C5otPYqAU',
      yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || 'price_1SlAAMI0J9sqa21CgTlHU0xg',
    },
    gold: {
      monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_1SlAAtI0J9sqa21CYrz1BcfW',
      yearly: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_1SlABDI0J9sqa21CMj7l3PUz',
    },
  };
  
  return priceMap[planId][interval];
};

export const PLANS = {
  bronze: {
    id: 'bronze',
    name: 'Bronze Listing (Basic)',
    price: 99.99,
    monthlyPrice: 9.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_YEARLY || 'price_1SlA97I0J9sqa21Cs4lB88Zd',
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC_MONTHLY || 'price_1SlA8rI0J9sqa21Cpr3kyVzE',
    features: [
      "Full property listing page",
      "Unlimited direct enquiries",
      "iCal calendar sync",
      "Direct website link",
      "Standard SEO optimization"
    ],
  },
  silver: {
    id: 'silver',
    name: 'Silver Listing (Premium)',
    price: 149.99,
    monthlyPrice: 14.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY || 'price_1SlAAMI0J9sqa21CgTlHU0xg',
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY || 'price_1SlA9zI0J9sqa21C5otPYqAU',
    features: [
      "Everything in Bronze",
      "Professional page build & support",
      "Social media promotion (inc Late Deals)",
      "Enhanced search visibility",
      "Priority support"
    ],
  },
  gold: {
    id: 'gold',
    name: 'Gold Listing (Enterprise)',
    price: 199.99,
    monthlyPrice: 19.99,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_1SlABDI0J9sqa21CMj7l3PUz',
    monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_1SlAAtI0J9sqa21CYrz1BcfW',
    features: [
      "Everything in Silver",
      "Themed blog feature",
      "3 x Holiday Focus page inclusion",
      "Homepage featured placement",
      "Specialist page (Weddings/Corporate/etc)"
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;
