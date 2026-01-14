"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Receipt,
  Download, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Users,
  DollarSign,
  TrendingUp,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  createdAt: string;
  invoiceUrl?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  planName: string | null;
  planType: string | null;
  billingInterval: string | null;
}

interface PaymentSummary {
  total: number;
  totalPaid: number;
  totalPending: number;
  totalAmount: number;
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

function AdminPaymentsContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [backfilling, setBackfilling] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary>({
    total: 0,
    totalPaid: 0,
    totalPending: 0,
    totalAmount: 0
  });
  const [error, setError] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");

  useEffect(() => {
    loadPaymentData();
  }, []);

  async function loadPaymentData() {
    try {
      setLoading(true);
      setError("");
      
      const session = await authClient.getSession();
      if (!session?.data?.user) {
        router.push('/admin/login');
        return;
      }

      // Admin check handled by ProtectedRoute

      // Load all payments from admin endpoint
      const response = await fetch('/api/admin/payments/history', {
        credentials: 'include'
      });

      console.log('Admin payment history response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Admin payment history data:', data);
        setPayments(data.payments || []);
        setSummary(data.summary || {
          total: 0,
          totalPaid: 0,
          totalPending: 0,
          totalAmount: 0
        });
      } else {
        const errorData = await response.json();
        console.error('Admin payment history error:', errorData);
        setError(errorData.error || 'Failed to load payment data');
      }

    } catch (err) {
      console.error('Error loading payment data:', err);
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  }

  async function backfillInvoices() {
    try {
      setBackfilling(true);
      setError("");
      
      const response = await fetch('/api/admin/backfill-invoices', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Backfill complete!\nCreated: ${data.summary.created}\nSkipped: ${data.summary.skipped}\nErrors: ${data.summary.errors}`);
        // Reload payment data
        await loadPaymentData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to backfill invoices');
      }

    } catch (err) {
      console.error('Error backfilling invoices:', err);
      setError('Failed to backfill invoices');
    } finally {
      setBackfilling(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'open':
      case 'uncollectible':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      open: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      uncollectible: 'bg-red-100 text-red-800',
      void: 'bg-gray-100 text-gray-800'
    };
    
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      owner: 'bg-blue-100 text-blue-800',
      guest: 'bg-green-100 text-green-800'
    };
    
    return colors[role as keyof typeof colors] || colors.owner;
  };

  const filteredPayments = payments.filter(payment => {
    if (filterStatus !== 'all' && payment.status !== filterStatus) return false;
    if (filterRole !== 'all' && payment.userRole !== filterRole) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Payment History</h1>
            <p className="text-muted-foreground">View all subscription payments and invoices across all users</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadPaymentData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={backfillInvoices}
              disabled={backfilling}
            >
              {backfilling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Backfilling...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Backfill Missing Invoices
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Payments</p>
              <p className="text-2xl font-bold">{summary.total}</p>
            </div>
            <Receipt className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Paid</p>
              <p className="text-2xl font-bold text-green-600">{summary.totalPaid}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{summary.totalPending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">£{summary.totalAmount.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {error && (
        <Card className="p-4 mb-6 border-red-200 bg-red-50">
          <p className="text-red-800">{error}</p>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="text-sm text-muted-foreground mr-2">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="open">Open</option>
              <option value="draft">Draft</option>
              <option value="uncollectible">Uncollectible</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mr-2">Role:</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owners</option>
              <option value="admin">Admins</option>
              <option value="guest">Guests</option>
            </select>
          </div>

          <div className="ml-auto">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPayments.length} of {payments.length} payments
            </p>
          </div>
        </div>
      </Card>

      {/* Payment List */}
      {filteredPayments.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No payments yet</h3>
            <p className="text-muted-foreground mb-4">
              Payment history will appear here once users subscribe to plans
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {getStatusIcon(payment.status)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{payment.description}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(payment.userRole)}`}>
                        {payment.userRole}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p><strong>User:</strong> {payment.userName} ({payment.userEmail})</p>
                        {payment.planName && (
                          <p><strong>Plan:</strong> {payment.planName} ({payment.billingInterval})</p>
                        )}
                      </div>
                      <div>
                        <p><strong>Date:</strong> {formatUKDate(payment.createdAt)}</p>
                        <p><strong>Amount:</strong> {formatCurrency(payment.amount, payment.currency)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {payment.invoiceUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={payment.invoiceUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPaymentsPage() {
  return <AdminPaymentsContent />;
}
