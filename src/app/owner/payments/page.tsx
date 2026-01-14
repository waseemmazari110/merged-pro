"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  CreditCard, 
  Download, 
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Receipt
} from "lucide-react";
import Link from "next/link";

interface Payment {
  id: string;
  type?: 'payment' | 'invoice';
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
  invoiceUrl?: string;
  paymentMethod?: string | null;
  paymentMethodBrand?: string | null;
  paymentMethodLast4?: string | null;
  billingReason?: string | null;
  refundAmount?: number | null;
  refundedAt?: string | null;
  failureMessage?: string | null;
  stripePaymentIntentId?: string | null;
  stripeInvoiceId?: string | null;
  invoiceNumber?: string | null;
  // Subscription plan details
  planName?: string | null;
  planType?: string | null;
  billingInterval?: string | null;
}

interface Subscription {
  id: string;
  planId: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// UK Date formatting utility
const formatUKDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount / 100);
};

function OwnerPaymentsContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [error, setError] = useState<string>("");
  const [syncMessage, setSyncMessage] = useState<string>("");

  useEffect(() => {
    loadPaymentData();
  }, []);

  async function loadPaymentData() {
    try {
      setLoading(true);
      setError("");
      
      const session = await authClient.getSession();
      if (!session?.data?.user) {
        router.push('/owner/login');
        return;
      }

      // Load subscription
      const subResponse = await fetch('/api/subscriptions/current', {
        credentials: 'include'
      });

      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscription(subData.subscription);
      }

      // Load payment history
      try {
        const paymentsResponse = await fetch('/api/owner/payment-history', {
          credentials: 'include'
        });

        console.log('Payment history response status:', paymentsResponse.status);

        if (paymentsResponse.ok) {
          const paymentsData = await paymentsResponse.json();
          console.log('Payment history data:', paymentsData);
          setPayments(paymentsData.payments || []);
        } else {
          console.error('Payment history error:', await paymentsResponse.text());
          setPayments([]);
        }
      } catch (err) {
        console.error('Payment history fetch error:', err);
        // API might not exist yet - use empty array
        setPayments([]);
      }

    } catch (error) {
      console.error('Error loading payment data:', error);
      setError('Failed to load payment history');
    } finally {
      setLoading(false);
    }
  }

  async function syncPayments() {
    try {
      setSyncing(true);
      setSyncMessage("");
      setError("");

      const response = await fetch('/api/owner/payment-sync', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSyncMessage(`✓ Synced ${data.synced} payments from Stripe`);
        // Reload payment data
        await loadPaymentData();
      } else {
        setError(data.message || 'Failed to sync payments');
      }
    } catch (error) {
      console.error('Sync error:', error);
      setError('Failed to sync payments');
    } finally {
      setSyncing(false);
      // Clear message after 5 seconds
      setTimeout(() => setSyncMessage(""), 5000);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
      case 'canceled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Receipt className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'succeeded':
      case 'paid':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'failed':
      case 'canceled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-accent-sage" />
          <p className="text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/owner/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
              <p className="text-gray-600 mt-2">View all your subscription payments and invoices</p>
            </div>
            <Button
              onClick={syncPayments}
              disabled={syncing}
              variant="outline"
              className="flex items-center gap-2"
            >
              {syncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  Sync from Stripe
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sync Success Message */}
        {syncMessage && (
          <Card className="p-4 mb-6 bg-green-50 border border-green-200">
            <p className="text-green-800">{syncMessage}</p>
          </Card>
        )}

        {/* Current Subscription Card */}
        {subscription && (
          <Card className="p-6 mb-6 bg-(--color-bg-secondary) text-black border border-gray-200">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-black">Current Subscription</h2>
                <p className="text-black mb-4">
                  Plan: <span className="font-medium capitalize">{subscription.planId}</span>
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Renews on {formatUKDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
                {subscription.cancelAtPeriodEnd && (
                  <p className="text-amber-800 text-sm mt-2">
                    ⚠️ Subscription will cancel at period end
                  </p>
                )}
              </div>
              <Link href="/owner/subscription">
                <Button variant="secondary" size="sm">
                  Manage Subscription
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* No Subscription Card */}
        {!subscription && (
          <Card className="p-6 mb-6 border-2 border-dashed border-gray-300">
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Subscription</h2>
              <p className="text-gray-600 mb-4">
                You&apos;re currently on the free plan with limited features
              </p>
              <Link href="/owner/subscription">
                <Button className="bg-accent-sage hover:bg-[#7a9280] active:bg-[#7a9280] text-white">
                  View Subscription Plans
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="p-4 mb-6 bg-red-50 border border-red-200">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        {/* Payment History */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>

          {payments.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
              <p className="text-gray-600 mb-4">
                Your payment history will appear here once you subscribe to a plan
              </p>
              <Link href="/owner/subscription">
                <Button variant="outline">
                  View Plans
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Main payment info */}
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {getStatusIcon(payment.status)}
                      <div className="flex-1 min-w-0">
                        {/* Subscription Plan Name - Prominent Display */}
                        {payment.planName && (
                          <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg inline-block">
                            <span className="text-sm font-bold text-blue-800">
                              📦 {payment.planName} Plan
                              {payment.billingInterval && (
                                <span className="ml-1 font-normal text-blue-600">
                                  ({payment.billingInterval})
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <h3 className="font-semibold text-gray-900">
                            {formatCurrency(payment.amount, payment.currency)}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                          {payment.type && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                              {payment.type}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{payment.description}</p>
                        
                        {/* Payment Date & Time - Prominent Display */}
                        <div className="mt-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-700">Payment Date:</span>
                            <span className="text-gray-900">{formatUKDate(payment.createdAt)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          {payment.paymentMethodBrand && payment.paymentMethodLast4 && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <CreditCard className="w-3 h-3" />
                              {payment.paymentMethodBrand} •••• {payment.paymentMethodLast4}
                            </p>
                          )}
                          {payment.billingReason && (
                            <p className="text-xs text-gray-500 capitalize">
                              {payment.billingReason.replace(/_/g, ' ')}
                            </p>
                          )}
                        </div>
                        
                        {/* Refund info */}
                        {payment.refundAmount && payment.refundAmount > 0 && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                            <p className="text-xs text-yellow-800">
                              ↩ Refunded: {formatCurrency(Math.round(payment.refundAmount * 100), payment.currency)}
                              {payment.refundedAt && ` on ${formatUKDate(payment.refundedAt)}`}
                            </p>
                          </div>
                        )}
                        
                        {/* Failure message */}
                        {payment.failureMessage && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-xs text-red-800">
                              ⚠ {payment.failureMessage}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {payment.invoiceUrl && (
                      <a
                        href={payment.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          {payment.type === 'invoice' ? 'Invoice' : 'Receipt'}
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Support Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help with billing?{' '}
            <a href="mailto:support@escapehouse.com" className="text-accent-sage hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OwnerPaymentsPage() {
  return <OwnerPaymentsContent />;
}
