/**
 * Subscription Status Badge Component
 * Displays subscription status with appropriate styling
 * Accessible and responsive
 */

import { CheckCircle, XCircle, Clock, AlertTriangle, Ban } from 'lucide-react';

export type SubscriptionStatus = 
  | 'active' 
  | 'trialing' 
  | 'past_due' 
  | 'canceled' 
  | 'cancelled'
  | 'incomplete' 
  | 'incomplete_expired'
  | 'unpaid';

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus;
  className?: string;
}

const statusConfig: Record<SubscriptionStatus, {
  icon: React.ElementType;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}> = {
  active: {
    icon: CheckCircle,
    label: 'Active',
    bgColor: 'bg-green-50',
    textColor: 'text-black',
    borderColor: 'border-green-200'
  },
  trialing: {
    icon: Clock,
    label: 'Trial',
    bgColor: 'bg-blue-50',
    textColor: 'text-black',
    borderColor: 'border-blue-200'
  },
  past_due: {
    icon: AlertTriangle,
    label: 'Past Due',
    bgColor: 'bg-yellow-50',
    textColor: 'text-black',
    borderColor: 'border-yellow-200'
  },
  canceled: {
    icon: Ban,
    label: 'Canceled',
    bgColor: 'bg-gray-50',
    textColor: 'text-black',
    borderColor: 'border-gray-200'
  },
  cancelled: {
    icon: Ban,
    label: 'Cancelled',
    bgColor: 'bg-gray-50',
    textColor: 'text-black',
    borderColor: 'border-gray-200'
  },
  incomplete: {
    icon: AlertTriangle,
    label: 'Incomplete',
    bgColor: 'bg-orange-50',
    textColor: 'text-black',
    borderColor: 'border-orange-200'
  },
  incomplete_expired: {
    icon: XCircle,
    label: 'Expired',
    bgColor: 'bg-red-50',
    textColor: 'text-black',
    borderColor: 'border-red-200'
  },
  unpaid: {
    icon: XCircle,
    label: 'Unpaid',
    bgColor: 'bg-red-50',
    textColor: 'text-black',
    borderColor: 'border-red-200'
  }
};

export function SubscriptionStatusBadge({ status, className = '' }: SubscriptionStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
      role="status"
      aria-label={`Subscription status: ${config.label}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
}
