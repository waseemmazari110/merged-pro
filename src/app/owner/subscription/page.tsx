"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlanCard, type Plan } from "@/components/subscription/PlanCard";
import { SubscriptionStatusBadge, type SubscriptionStatus } from "@/components/subscription/SubscriptionStatusBadge";
import { Notification, useNotification } from "@/components/subscription/Notification";
import { 
  CreditCard, 
  AlertCircle,
  Crown,
  Building,
  TrendingUp,
  Calendar,
  Loader2,
  XCircle
} from "lucide-react";
import Link from "next/link";

interface Subscription {
  id: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripePriceId?: string;
  stripeCustomerId?: string;
  planName?: string;
  amount?: number;
  currency?: string;
}

const PLAN_FEATURES: Record<string, { icon: any; color: string; description: string }> = {
  free: {
    icon: Building,
    color: "text-gray-600",
    description: "Perfect for getting started with property listings"
  },
  basic: {
    icon: TrendingUp,
    color: "text-blue-600",
    description: "Perfect for individual property owners"
  },
  premium: {
    icon: Crown,
    color: "text-purple-600",
    description: "Ideal for growing property businesses"
  },
  enterprise: {
    icon: Crown,
    color: "text-yellow-600",
    description: "For established property management companies"
  }
};

function SubscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string>("");
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    loadSubscriptionData();
    
    // Check for success/cancel params from Stripe Checkout
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      showNotification({
        type: 'success',
        title: 'Subscription Activated!',
        message: 'Your subscription has been successfully activated. You now have full access to premium features.',
        duration: 8000
      });
      // Clean URL
      window.history.replaceState({}, '', '/owner/subscription');
    } else if (canceled === 'true') {
      showNotification({
        type: 'warning',
        title: 'Checkout Cancelled',
        message: 'Your subscription checkout was cancelled. No charges were made.',
        duration: 6000
      });
      // Clean URL
      window.history.replaceState({}, '', '/owner/subscription');
    }
  }, [searchParams]);

  async function loadSubscriptionData() {
    try {
      setLoading(true);
      setError("");
      
      // Check authentication
      const session = await authClient.getSession();
      if (!session?.data?.user) {
        router.push('/owner/login');
        return;
      }

      // Load current subscription
      const subResponse = await fetch('/api/subscriptions/current', {
        credentials: 'include'
      });

      if (subResponse.ok) {
        const data = await subResponse.json();
        setSubscription(data.subscription || null);
      } else {
        console.error('Failed to load subscription, status:', subResponse.status);
        const errorData = await subResponse.json().catch(() => ({}));
        console.error('Error details:', errorData);
      }

      // Load available plans
      const plansResponse = await fetch('/api/subscriptions/plans');
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setPlans(plansData.plans || []);
      } else {
        console.error('Failed to load plans, status:', plansResponse.status);
        const errorData = await plansResponse.json().catch(() => ({}));
        console.error('Error details:', errorData);
        setError('Failed to load subscription plans. Please refresh the page.');
      }
    } catch (err: any) {
      console.error('Error loading subscription:', err);
      setError(err?.message || 'Failed to load subscription information. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe(planId: string) {
    // Prevent multiple simultaneous subscriptions
    if (actionLoading || processingPlanId) {
      console.warn('Already processing a subscription, ignoring click');
      return;
    }

    // Check if user already has an active subscription - switch plan instead
    if (subscription && subscription.status === 'active') {
      await handleSwitchPlan(planId);
      return;
    }

    try {
      console.log('Starting subscription process for plan:', planId);
      setActionLoading(true);
      setProcessingPlanId(planId);
      setError("");
      hideNotification();

      // Create Stripe Checkout Session
      const response = await fetch('/api/subscriptions/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'Failed to create checkout session';
        console.error('Checkout session error:', data);
        throw new Error(errorMsg);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        console.log('Redirecting to Stripe Checkout...');
        window.location.href = data.url;
        // Don't reset state here - page will redirect
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      const errorMessage = err.message || 'Failed to start checkout';
      const backendError = err.response?.data?.message || err.message;
      
      setError(backendError || errorMessage);
      showNotification({
        type: 'error',
        title: 'Checkout Error',
        message: backendError || errorMessage,
        duration: 6000
      });
      // Reset state on error
      setActionLoading(false);
      setProcessingPlanId(null);
    }
    // Note: No finally block - state only resets on error
    // On success, page redirects so state doesn't matter
  }

  async function handleSwitchPlan(newPlanId: string) {
    if (!subscription) return;

    // Don't switch if already on this plan
    if (subscription.planId === newPlanId) {
      showNotification({
        type: 'info',
        title: 'Already on this plan',
        message: 'You are already subscribed to this plan.',
        duration: 4000
      });
      return;
    }

    const currentPlanName = plans.find(p => p.id === subscription.planId)?.name || 'current plan';
    const newPlanName = plans.find(p => p.id === newPlanId)?.name || 'new plan';
    
    const confirmed = window.confirm(
      `Switch from ${currentPlanName} to ${newPlanName}?\n\n` +
      `• Changes take effect immediately\n` +
      `• You will be charged or credited the prorated difference\n` +
      `• Your billing date remains the same`
    );

    if (!confirmed) {
      return;
    }

    try {
      console.log('Switching plan to:', newPlanId);
      setActionLoading(true);
      setProcessingPlanId(newPlanId);
      setError("");
      hideNotification();

      const response = await fetch('/api/subscriptions/switch-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPlanId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to switch plan');
      }

      showNotification({
        type: 'success',
        title: 'Plan Changed Successfully!',
        message: `You have been switched to the ${newPlanName} plan. Changes are effective immediately.`,
        duration: 8000
      });

      // Reload subscription data to show new plan
      await loadSubscriptionData();
    } catch (err: any) {
      console.error('Plan switch error:', err);
      const errorMessage = err.message || 'Failed to switch plan';
      setError(errorMessage);
      showNotification({
        type: 'error',
        title: 'Plan Switch Error',
        message: errorMessage,
        duration: 6000
      });
    } finally {
      setActionLoading(false);
      setProcessingPlanId(null);
    }
  }

  async function handleCancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription? You will retain access until the end of your billing period.')) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      hideNotification();

      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      showNotification({
        type: 'success',
        title: 'Subscription Cancelled',
        message: 'Your subscription has been cancelled. You will retain access until the end of your billing period.',
        duration: 6000
      });

      await loadSubscriptionData();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to cancel subscription';
      setError(errorMessage);
      showNotification({
        type: 'error',
        title: 'Cancellation Error',
        message: errorMessage,
        duration: 6000
      });
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReactivateSubscription() {
    try {
      setActionLoading(true);
      setError("");
      hideNotification();

      const response = await fetch('/api/subscriptions/reactivate', {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reactivate subscription');
      }

      showNotification({
        type: 'success',
        title: 'Subscription Reactivated!',
        message: 'Your subscription has been reactivated and will continue at the end of the current period.',
        duration: 6000
      });

      await loadSubscriptionData();
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to reactivate subscription';
      setError(errorMessage);
      showNotification({
        type: 'error',
        title: 'Reactivation Error',
        message: errorMessage,
        duration: 6000
      });
    } finally {
      setActionLoading(false);
    }
  }

  const currentPlan = subscription ? plans.find(p => p.id === subscription.planId) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-black mx-auto mb-4" />
          <p className="text-black">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                Subscription Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">Manage your property listing subscription</p>
            </div>
            <Link href="/owner/dashboard">
              <Button variant="outline" className="w-full sm:w-auto hover:bg-gray-50 transition-colors shadow-sm">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Notification */}
        {notification && (
          <div className="mb-6">
            <Notification {...notification} />
          </div>
        )}

        {/* Error Message */}
        {error && !notification && (
          <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm" role="alert">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1">
                <p className="font-bold text-base mb-2 text-red-900">Checkout Failed</p>
                <p className="text-sm text-red-800 mb-3">{error}</p>
                {(error.includes('No such price') || error.includes('not configured') || error.includes('REPLACE_ME')) && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                    <p className="text-sm font-bold mb-2 text-red-900">⚙️ Configuration Required:</p>
                    <ol className="text-xs text-red-800 space-y-1 list-decimal ml-4">
                      <li>Go to <a href="https://dashboard.stripe.com/test/products" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-red-900">Stripe Dashboard → Products</a></li>
                      <li>Create a new product for your subscription plan</li>
                      <li>Copy the Price ID (starts with "price_")</li>
                      <li>Update your .env file with the correct STRIPE_PRICE_* variables</li>
                      <li>Restart your development server</li>
                    </ol>
                    <div className="mt-3 p-2 bg-red-100 rounded text-xs font-mono">
                      STRIPE_PRICE_BASIC_MONTHLY=price_xxxxx<br/>
                      STRIPE_PRICE_PREMIUM_MONTHLY=price_xxxxx
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Subscription Info Card */}
        {!subscription && !loading && (
          <Card className="p-8 mb-8 bg-blue-50 border-2 border-blue-300 shadow-lg">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Crown className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-black mb-3">🎉 Welcome! Choose Your Perfect Plan</h2>
                <p className="text-black mb-4 text-base leading-relaxed">
                  You're currently on the <strong className="text-black">Free Plan</strong> with limited features. 
                  Upgrade now to unlock unlimited property listings, advanced features, and priority support.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4 text-sm text-black bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-black" />
                    <span><strong>Free:</strong> Up to 2 properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span><strong>Paid Plans:</strong> 5+ properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-600" />
                    <span><strong>Premium:</strong> Featured listings</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Current Subscription Card */}
        {subscription && currentPlan && (
          <Card className="p-4 sm:p-6 mb-8 bg-green-50 border-2 border-green-200 shadow-md">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    {currentPlan.name}
                  </h2>
                  <SubscriptionStatusBadge status={subscription.status} />
                </div>
                <p className="text-sm sm:text-base text-gray-600">{currentPlan.description}</p>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto">
                <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {currentPlan.currency === 'GBP' ? '£' : currentPlan.currency}
                  {currentPlan.price}
                </div>
                <div className="text-sm text-gray-600">per {currentPlan.interval}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">
                  Renews: {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              {subscription.cancelAtPeriodEnd && (
                <div className="flex items-center gap-2 text-sm text-red-600 col-span-full">
                  <XCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="font-semibold">
                    Cancels on {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ Your subscription will be canceled at the end of the current billing period.
                </p>
              </div>
            )}

            {subscription.status === 'past_due' && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-sm text-orange-800">
                  ⚠️ Payment failed. Please update your payment method to continue your subscription.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/owner/payments">
                <Button variant="outline" className="w-full sm:w-auto">
                  <CreditCard className="h-4 w-4 mr-2" />
                  View Payment History
                </Button>
              </Link>
              
              {subscription.cancelAtPeriodEnd ? (
                <Button 
                  onClick={handleReactivateSubscription}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                >
                  {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Reactivate Subscription
                </Button>
              ) : subscription.status === 'active' && (
                <Button 
                  onClick={handleCancelSubscription}
                  disabled={actionLoading}
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50 w-full sm:w-auto"
                >
                  {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Cancel Subscription
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Available Plans */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            {subscription ? 'Upgrade or Change Plan' : 'Choose Your Plan'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Select the perfect plan for your property portfolio
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {plans && plans.length > 0 ? (
              plans.map((plan) => {
                const isCurrentPlan = subscription?.planId === plan.id;
                const isPopular = plan.tier === 'premium';
                const isThisPlanLoading = processingPlanId === plan.id;
                const isAnotherPlanLoading = actionLoading && !isThisPlanLoading;

                // Debug logging
                if (actionLoading) {
                  console.log(`Plan ${plan.id}: loading=${isThisPlanLoading}, disabled=${isAnotherPlanLoading}`);
                }

                return (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isCurrentPlan={isCurrentPlan}
                    isPopular={isPopular}
                    hasActiveSubscription={!!subscription}
                    onSubscribe={subscription ? handleSwitchPlan : handleSubscribe}
                    loading={isThisPlanLoading}
                    disabled={isAnotherPlanLoading || isCurrentPlan}
                  />
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No plans available at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="p-4 sm:p-6 bg-gray-50">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Can I cancel my subscription anytime?</h4>
              <p className="text-sm text-gray-600">
                Yes, you can cancel your subscription at any time. You'll retain access to premium features until the end of your billing period.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">What happens if my payment fails?</h4>
              <p className="text-sm text-gray-600">
                We'll automatically retry the payment. If it fails multiple times, your subscription will be marked as past due and you'll need to update your payment method.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Can I upgrade or downgrade my plan?</h4>
              <p className="text-sm text-gray-600">
                Yes, you can change your plan at any time. Changes will be prorated based on your current billing cycle.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Is my payment information secure?</h4>
              <p className="text-sm text-gray-600">
                Absolutely. All payments are processed securely through Stripe, and we never store your payment card details on our servers.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <SubscriptionContent />
    </ProtectedRoute>
  );
}
