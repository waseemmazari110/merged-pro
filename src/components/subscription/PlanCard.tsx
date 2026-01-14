/**
 * Plan Card Component
 * Reusable subscription plan display card
 * Responsive and accessible
 */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Crown, Building, TrendingUp, Loader2 } from 'lucide-react';

export interface Plan {
  id: string;
  name: string;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  interval: 'monthly' | 'yearly';
  price: number;
  currency: string;
  description?: string;
  features: string[];
  stripePriceId: string;
}

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  hasActiveSubscription?: boolean;
  onSubscribe?: (planId: string) => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

const tierIcons = {
  free: Building,
  basic: TrendingUp,
  premium: Crown,
  enterprise: Crown
};

// 🎨 CLEAN BUTTON COLORS
const buttonStyles = {
  basic: {
    base: '#2563EB',      // Blue-600
    hover: '#1D4ED8',     // Blue-700
    border: '#60A5FA'
  },
  premium: {
    base: '#7C3AED',      // Purple-600
    hover: '#6D28D9',     // Purple-700
    border: '#A78BFA'
  },
  enterprise: {
    base: '#D97706',      // Amber-600
    hover: '#B45309',     // Amber-700
    border: '#FCD34D'
  },
  disabled: {
    base: '#9CA3AF',
    border: '#6B7280'
  }
};

export function PlanCard({
  plan,
  isCurrentPlan = false,
  isPopular = false,
  hasActiveSubscription = false,
  onSubscribe,
  loading = false,
  disabled = false
}: PlanCardProps) {
  const Icon = tierIcons[plan.tier];

  const handleSubscribe = async () => {
    // Strict guard - prevent execution if disabled or loading
    if (!onSubscribe) {
      console.log('PlanCard: No onSubscribe handler');
      return;
    }
    if (disabled) {
      console.log('PlanCard: Button is disabled, blocking click for plan:', plan.id);
      return;
    }
    if (loading) {
      console.log('PlanCard: Button is loading, blocking click for plan:', plan.id);
      return;
    }
    
    console.log('PlanCard: Executing subscribe for plan:', plan.id);
    await onSubscribe(plan.id);
  };

  const buttonTheme =
    disabled && !loading
      ? buttonStyles.disabled
      : plan.tier === 'premium'
      ? buttonStyles.premium
      : plan.tier === 'enterprise'
      ? buttonStyles.enterprise
      : buttonStyles.basic;

  const hoverColor = 
    disabled && !loading
      ? buttonStyles.disabled.base
      : plan.tier === 'premium'
      ? buttonStyles.premium.hover
      : plan.tier === 'enterprise'
      ? buttonStyles.enterprise.hover
      : buttonStyles.basic.hover;

  return (
    <Card className="relative p-6 flex flex-col h-full border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon className="h-6 w-6 text-black" />
          <h3 className="text-xl font-bold">{plan.name}</h3>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">
            {plan.currency === 'GBP' ? '£' : plan.currency}
            {plan.price}
          </span>
          {plan.price > 0 && (
            <span className="text-black">
              /{plan.interval === 'yearly' ? 'year' : 'month'}
            </span>
          )}
        </div>
      </div>

      <ul className="space-y-3 mb-6 flex-grow">
        {plan.features.map((f, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <CheckCircle className="h-5 w-5 text-black" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* BUTTON */}
      {isCurrentPlan ? (
        <div className="w-full p-3 bg-green-50 border-2 border-green-300 rounded-lg text-center">
          <p className="text-black font-semibold text-sm flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Current Plan
          </p>
        </div>
      ) : plan.price === 0 ? (
        <Button
          disabled={true}
          style={{
            backgroundColor: '#9CA3AF',
            borderColor: '#6B7280',
            color: '#FFFFFF'
          }}
          className="w-full py-6 text-lg font-bold rounded-xl border-4 cursor-not-allowed bg-gray-200 text-gray-500"
        >
          Free Plan
        </Button>
      ) : (
        <Button
          onClick={(disabled || loading) ? undefined : handleSubscribe}
          disabled={disabled || loading}
          style={{
            backgroundColor: (disabled && !loading) ? '#9CA3AF' : (loading ? '#1D4ED8' : buttonTheme.base),
            borderColor: buttonTheme.border,
            color: '#FFFFFF',
            opacity: '1',
            pointerEvents: (disabled && !loading) ? 'none' : 'auto'
          }}
          className={`
            w-full py-6 text-lg font-bold rounded-xl border-4
            transition-all duration-200
            hover:shadow-lg
            active:scale-95
            ${(disabled && !loading) ? 'cursor-not-allowed' : 'cursor-pointer'}
            disabled:bg-gray-400 disabled:cursor-not-allowed
          `}
          onMouseEnter={(e) => {
            if (!disabled && !loading) {
              e.currentTarget.style.backgroundColor = hoverColor;
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && !loading) {
              e.currentTarget.style.backgroundColor = buttonTheme.base;
            }
          }}
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
          {loading ? 'Processing...' : hasActiveSubscription ? 'Switch to This Plan' : 'Subscribe Now'}
        </Button>
      )}
    </Card>
  );
}
