"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useRefresh } from "@/hooks/useRefresh";
import Link from "next/link";
import Image from "next/image";
import { 
  Home, 
  Calendar, 
  DollarSign,
  Settings,
  TrendingUp,
  Building,
  Menu,
  X,
  Users,
  LogOut,
  CreditCard,
  MapPin,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit2,
  Trash2,
  BedDouble,
  Bath,
  Mail,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Star,
  Sparkles,
  ChevronRight,
  Plus,
  ExternalLink
} from "lucide-react";

// UK Date formatting utility
const formatUKDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// UK Date + Time formatting utility
const formatUKDateTime = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

interface OwnerStats {
  totalBookings: number;
  bookingsGrowth: string;
  activeProperties: number;
  propertiesGrowth: string;
  revenue: number;
  revenueGrowth: string;
  upcomingCheckIns: number;
  checkInsGrowth: string;
}

interface Booking {
  id: number;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  propertyName: string;
  propertyLocation?: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  paymentStatus?: string;
  numberOfGuests?: number;
  totalPrice?: number;
  specialRequests?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Property {
  id: number;
  title: string;
  slug?: string;
  location: string;
  heroImage: string;
  isPublished: boolean;
  sleepsMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  priceFromWeekend?: number;
  priceFromMidweek?: number;
  status?: 'pending' | 'approved' | 'rejected';
  statusInfo?: {
    status: string;
    approvedAt?: string;
    rejectionReason?: string;
  };
}

interface PropertyAvailability {
  propertyId: number;
  availability: Array<{
    date: string;
    available: boolean;
    status: string;
    price?: number;
  }>;
  bookings: Array<{
    id: number;
    checkIn: string;
    checkOut: string;
    guestName: string;
    status: string;
  }>;
}

interface CheckIn {
  id: number;
  guestName: string;
  propertyName: string;
  checkInDate: string;
  numberOfGuests: number;
  guestEmail?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface PendingProperty {
  id: number;
  title: string;
  slug: string;
  location: string;
  region: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  heroImage: string;
  sleepsMin?: number;
  sleepsMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  priceFromMidweek?: number;
  priceFromWeekend?: number;
}

interface StatusCounts {
  pending: number;
  approved: number;
  rejected: number;
  all: number;
}

function OwnerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh, isRefreshing } = useRefresh();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OwnerStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingCheckIns, setUpcomingCheckIns] = useState<CheckIn[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<"overview" | "bookings" | "properties" | "approvals" | "payments" | "availability">("overview");
  const [pendingProperties, setPendingProperties] = useState<PendingProperty[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({ pending: 0, approved: 0, rejected: 0, all: 0 });
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
  const [propertyAvailability, setPropertyAvailability] = useState<PropertyAvailability | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [deletingPropertyId, setDeletingPropertyId] = useState<number | null>(null);

  const purpleButtonClass = "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-700";
  const purpleButtonSoftClass = "bg-purple-100 text-black hover:bg-purple-200 active:bg-purple-200";

  // Set active view from URL parameter on mount
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam && ['overview', 'bookings', 'properties', 'approvals', 'payments', 'availability'].includes(viewParam)) {
      setActiveView(viewParam as "overview" | "bookings" | "properties" | "approvals" | "payments" | "availability");
    }
    const propertyParam = searchParams.get('property');
    if (propertyParam) {
      setSelectedPropertyId(parseInt(propertyParam));
    }
    
    // Check for payment success from Stripe redirect
    const paymentSuccess = searchParams.get('payment_success');
    const sessionId = searchParams.get('session_id');
    if (paymentSuccess === 'true' && sessionId) {
      // Sync payment record from Stripe
      fetch('/api/subscriptions/sync-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert('🎉 Subscription Payment Successful!\n\nYour subscription has been activated and payment history has been recorded.');
            // Reload payment history
            fetchPaymentHistory();
          } else {
            alert('✅ Subscription Activated!\n\nYour subscription is active. Payment history will sync automatically.');
          }
        })
        .catch(() => {
          alert('✅ Subscription Activated!\n\nYour subscription is active. Payment history will sync automatically.');
        });
      // Clean URL
      window.history.replaceState({}, '', '/owner/dashboard');
    }
  }, [searchParams]);

  // Fetch property availability
  const fetchPropertyAvailability = async (propertyId: number) => {
    try {
      setLoadingAvailability(true);
      const response = await fetch(`/api/owner/properties/${propertyId}/availability`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setPropertyAvailability(data);
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error);
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Handle opening availability view
  const handleViewAvailability = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    setActiveView('availability');
    fetchPropertyAvailability(propertyId);
  };

  const handleDeleteProperty = async (propertyId: number) => {
    const ok = window.confirm('Are you sure you want to delete this property? This action cannot be undone.');
    if (!ok) return;

    try {
      setDeletingPropertyId(propertyId);
      const res = await fetch(`/api/owner/properties/${propertyId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error || 'Failed to delete property');
        return;
      }

      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      setPendingProperties((prev) => prev.filter((p) => p.id !== propertyId));
      if (selectedPropertyId === propertyId) {
        setSelectedPropertyId(null);
        setPropertyAvailability(null);
        setActiveView('properties');
      }
      
      // Refresh cache to update all views
      await refresh();
    } catch (e) {
      console.error('Failed to delete property:', e);
      alert('Failed to delete property. Please try again.');
    } finally {
      setDeletingPropertyId(null);
    }
  };

  useEffect(() => {
    async function loadDashboard() {
      try {
        const session = await authClient.getSession();
        
        if (!session?.data?.user) {
          router.push('/owner/login');
          return;
        }

        // Set user from session data
        setUser({
          id: session.data.user.id,
          name: session.data.user.name || session.data.user.email.split('@')[0],
          email: session.data.user.email,
          role: (session.data.user as any).role || 'owner',
        });

        // Fetch stats
        const statsRes = await fetch('/api/owner/stats', { cache: 'no-store' });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Fetch recent bookings for overview
        const bookingsRes = await fetch('/api/owner/bookings?limit=5', { cache: 'no-store' });
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setRecentBookings(bookingsData.bookings || []);
        }

        // Fetch all bookings for bookings tab
        const allBookingsRes = await fetch('/api/owner/bookings?limit=100', { cache: 'no-store' });
        if (allBookingsRes.ok) {
          const allBookingsData = await allBookingsRes.json();
          setAllBookings(allBookingsData.bookings || []);
        }

        // Fetch upcoming check-ins
        const checkInsRes = await fetch('/api/owner/upcoming-checkins', { cache: 'no-store' });
        if (checkInsRes.ok) {
          const checkInsData = await checkInsRes.json();
          setUpcomingCheckIns(checkInsData.checkIns || []);
        }

        // Fetch properties
        const propertiesRes = await fetch('/api/owner/properties', { cache: 'no-store' });
        if (propertiesRes.ok) {
          const propertiesData = await propertiesRes.json();
          setProperties(propertiesData.properties || []);
        }

      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  // Fetch properties for approvals tab
  const fetchPendingProperties = async () => {
    try {
      const response = await fetch(`/api/owner/properties?status=${statusFilter}`, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        const allProps = data.properties || [];
        
        // Calculate status counts
        const counts = {
          pending: allProps.filter((p: Property & { status?: string }) => p.status === 'pending').length,
          approved: allProps.filter((p: Property & { status?: string }) => p.status === 'approved').length,
          rejected: allProps.filter((p: Property & { status?: string }) => p.status === 'rejected').length,
          all: allProps.length
        };
        setStatusCounts(counts);
        
        // Filter by status if not 'all'
        const filtered = statusFilter === 'all' ? allProps : allProps.filter((p: Property & { status?: string }) => p.status === statusFilter);
        setPendingProperties(filtered as PendingProperty[]);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    }
  };

  // Fetch payment history for payments tab
  const fetchPaymentHistory = async () => {
    try {
      setLoadingPayments(true);
      const response = await fetch('/api/owner/payment-history', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setPaymentHistory(data.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    } finally {
      setLoadingPayments(false);
    }
  };

  // Fetch bookings for bookings tab
  const loadBookings = async () => {
    try {
      const allBookingsRes = await fetch('/api/owner/bookings?limit=100', { cache: 'no-store' });
      if (allBookingsRes.ok) {
        const allBookingsData = await allBookingsRes.json();
        setAllBookings(allBookingsData.bookings || []);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  useEffect(() => {
    if (activeView === 'approvals') {
      fetchPendingProperties();
    }
    if (activeView === 'payments') {
      fetchPaymentHistory();
    }
    if (activeView === 'availability' && selectedPropertyId) {
      fetchPropertyAvailability(selectedPropertyId);
    }
  }, [activeView, statusFilter, selectedPropertyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-indigo-600 mx-auto"></div>
            <Sparkles className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-6 text-black font-semibold text-lg">Loading your dashboard...</p>
          <p className="text-sm text-black mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-50 text-black border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-black border-amber-200';
      case 'completed':
        return 'bg-blue-50 text-black border-blue-200';
      case 'cancelled':
        return 'bg-rose-50 text-black border-rose-200';
      default:
        return 'bg-gray-50 text-black border-gray-200';
    }
  };

  // Modern Stat Card Component
  const StatCard = ({ icon: Icon, label, value, trend, trendUp, color }: any) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 ${color} shadow-md transition-all duration-300`}>
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
            <Icon className="w-6 h-6 text-black" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-black`}>
              {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>
        <p className="text-black text-sm font-medium mb-1">{label}</p>
        <p className="text-4xl font-bold text-black">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      {/* Modern Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 shadow-xl fixed h-screen overflow-y-auto text-black">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 text-black">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shadow-lg">
              <Home className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">PropManager</h1>
              <p className="text-xs text-black">Owner Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 text-black">
          {[
            { name: 'Overview', icon: Home, view: 'overview' },
            { name: 'Bookings', icon: Calendar, view: 'bookings' },
            { name: 'Properties', icon: Building, view: 'properties' },
          ].map((item) => (
            <button
              key={item.view}
              onClick={() => { setActiveView(item.view as any); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                activeView === item.view
                  ? `${purpleButtonSoftClass} shadow-lg`
                  : `text-black hover:bg-purple-50`
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeView === item.view ? 'text-black' : 'text-black group-hover:text-black'}`} />
              <span className="flex-1 text-left">{item.name}</span>
              {activeView === item.view && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}

          {/* Approvals - Special */}
          <div className="my-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => { setActiveView('approvals'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl font-semibold transition-all duration-200 ${
                activeView === 'approvals'
                  ? 'bg-purple-200 text-black shadow-xl ring-1 ring-purple-300'
                  : 'bg-purple-200 text-black hover:bg-purple-300 shadow-lg ring-1 ring-purple-300'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <div className="flex-1 text-left">
                <div>Approvals</div>
                {statusCounts.pending > 0 && (
                  <div className="text-xs font-normal text-black">
                    {statusCounts.pending} pending
                  </div>
                )}
              </div>
              {statusCounts.pending > 0 && (
                <span className="bg-orange-100 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {statusCounts.pending}
                </span>
              )}
            </button>
          </div>

          {/* Secondary Navigation */}
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => setActiveView("payments")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeView === "payments"
                  ? `${purpleButtonSoftClass} shadow-lg`
                  : 'text-black hover:bg-purple-50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Payments</span>
            </button>
            <Link
              href="/owner/subscription"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-black hover:bg-purple-50 transition-all font-medium"
            >
              <DollarSign className="w-5 h-5" />
              <span>Subscription</span>
            </Link>
            <Link
              href="/owner/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-black hover:bg-purple-50 transition-all font-medium"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-4 text-black">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-3">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shadow-lg">
              <span className="text-base font-bold text-black">
                {user?.name?.charAt(0)?.toUpperCase() || 'O'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate">
                {user?.name || 'Owner'}
              </p>
              <p className="text-xs text-black">Property Owner</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${purpleButtonClass}`}
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200 text-black">
        <div className="flex items-center justify-between px-4 py-4 text-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Home className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-lg font-bold text-black">PropManager</span>
              <span className="text-xs text-black block">Owner</span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-black" />
            ) : (
              <Menu className="w-6 h-6 text-black" />
            )}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed top-[73px] left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto text-black">
              <nav className="px-4 py-4 space-y-2">
                {[
                  { name: 'Overview', icon: Home, view: 'overview' },
                  { name: 'Bookings', icon: Calendar, view: 'bookings' },
                  { name: 'Properties', icon: Building, view: 'properties' },
                ].map((item) => (
                  <button
                    key={item.view}
                    onClick={() => { setActiveView(item.view as any); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      activeView === item.view
                        ? purpleButtonSoftClass
                        : 'text-black hover:bg-purple-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                ))}
                
                <button
                  onClick={() => { setActiveView('approvals'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-semibold bg-purple-200 text-black shadow-md"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Property Approvals</span>
                </button>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => { setActiveView('payments'); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                      activeView === 'payments'
                        ? purpleButtonSoftClass
                        : 'text-black hover:bg-purple-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Payments</span>
                  </button>
                  <Link
                    href="/owner/subscription"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-black hover:bg-purple-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <DollarSign className="w-5 h-5" />
                    <span>Subscription</span>
                  </Link>
                  <Link
                    href="/owner/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-black hover:bg-purple-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                  </Link>
                  
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <button
                      onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full ${purpleButtonClass}`}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 pt-20 lg:pt-0 text-black">
        <div className="min-h-screen text-black">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-black">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-black mb-1">
                    {activeView === "overview" && "Dashboard Overview"}
                    {activeView === "bookings" && "All Bookings"}
                    {activeView === "properties" && "My Properties"}
                    {activeView === "approvals" && "Property Approvals"}
                    {activeView === "payments" && "Payment History"}
                    {activeView === "availability" && "Availability Calendar"}
                  </h1>
                  <p className="text-black">
                    {activeView === "overview" && `Welcome back, ${user?.name || 'Owner'}! Here's your business overview.`}
                    {activeView === "bookings" && "Manage and track all your property bookings."}
                    {activeView === "properties" && "View and manage your property listings."}
                    {activeView === "approvals" && "Track approval status of your properties."}
                    {activeView === "payments" && "View your subscription and payment history."}
                    {activeView === "availability" && "Manage booking availability for your property."}
                  </p>
                </div>
                <div className="hidden lg:flex items-center gap-3">
                  <button className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors relative">
                    <Bell className="w-5 h-5 text-black" />
                    {statusCounts.pending > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-100 rounded-full text-xs text-black flex items-center justify-center font-bold">
                        {statusCounts.pending}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            {activeView === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={Calendar}
                    label="Total Bookings"
                    value={stats?.totalBookings?.toLocaleString() || '0'}
                    trend={stats?.bookingsGrowth || '+0%'}
                    trendUp={true}
                    color="bg-blue-100"
                  />
                  <StatCard
                    icon={Building}
                    label="Active Properties"
                    value={stats?.activeProperties ?? properties.filter(p => p.isPublished).length}
                    trend={stats?.propertiesGrowth || '+0%'}
                    trendUp={true}
                    color="bg-emerald-100"
                  />
                  <StatCard
                    icon={TrendingUp}
                    label="Revenue"
                    value={`£${(stats?.revenue || 0).toLocaleString()}`}
                    trend={stats?.revenueGrowth || '+0%'}
                    trendUp={true}
                    color="bg-purple-100"
                  />
                  <StatCard
                    icon={Users}
                    label="Upcoming Check-ins"
                    value={upcomingCheckIns.length}
                    trend="Next 30 days"
                    trendUp={false}
                    color="bg-orange-100"
                  />
                </div>

                {/* Recent Activity Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Bookings - Takes 2 columns */}
                  <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-black" />
                        </div>
                        <h2 className="text-xl font-bold text-black">Recent Bookings</h2>
                      </div>
                      <button
                        onClick={() => setActiveView("bookings")}
                        className={`text-sm font-semibold flex items-center gap-2 px-3 py-2 rounded-lg ${purpleButtonSoftClass}`}
                      >
                        View All
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {recentBookings.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-black" />
                        </div>
                        <p className="text-black font-semibold mb-1">No bookings yet</p>
                        <p className="text-sm text-black">Your bookings will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentBookings.map((booking) => (
                          <div key={booking.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                              <Users className="w-6 h-6 text-black" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-black">{booking.guestName}</p>
                              <p className="text-sm text-black truncate">{booking.propertyName}</p>
                              <p className="text-xs text-black mt-1">{formatUKDate(booking.checkInDate)} - {formatUKDate(booking.checkOutDate)}</p>
                            </div>
                            <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upcoming Check-ins */}
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-black" />
                      </div>
                      <h2 className="text-xl font-bold text-black">Upcoming</h2>
                    </div>
                    
                    {upcomingCheckIns.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <Clock className="w-8 h-8 text-black" />
                        </div>
                        <p className="text-black text-sm">No upcoming check-ins</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingCheckIns.map((checkIn, index) => (
                          <div 
                            key={checkIn.id} 
                            className={`flex items-start gap-3 ${index < upcomingCheckIns.length - 1 ? 'pb-4 border-b border-gray-100' : ''}`}
                          >
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-black">
                                {checkIn.guestName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-black">{checkIn.guestName}</p>
                              <p className="text-xs text-black truncate">{checkIn.propertyName}</p>
                              <div className="flex items-center gap-3 text-xs text-black mt-1">
                                <span className="font-medium">{formatUKDate(checkIn.checkInDate)}</span>
                                <span>·</span>
                                <span>{checkIn.numberOfGuests} guests</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Properties Grid */}
                {properties.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                          <Building className="w-5 h-5 text-black" />
                        </div>
                        <h2 className="text-xl font-bold text-black">Your Properties</h2>
                      </div>
                      <button
                        onClick={() => setActiveView("properties")}
                        className="text-sm text-black hover:text-black font-semibold flex items-center gap-1"
                      >
                        View All
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {properties.slice(0, 6).map((property) => {
                        const status = property.statusInfo?.status || property.status || 'pending';
                        const isApproved = status === 'approved';
                        const isPending = status === 'pending';
                        const isRejected = status === 'rejected';
                        
                        return (
                          <div
                            key={property.id}
                            className="group rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 bg-white"
                          >
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                              {property.heroImage ? (
                                <Image
                                  src={property.heroImage}
                                  alt={property.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                  <Home className="w-16 h-16 text-black" />
                                </div>
                              )}
                              {/* Status Badge */}
                              <div className="absolute top-3 right-3">
                                {isApproved && (
                                  <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-emerald-100 text-black shadow-lg">
                                    ✓ Approved
                                  </span>
                                )}
                                {isPending && (
                                  <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-amber-100 text-black shadow-lg">
                                    ⏱ Pending
                                  </span>
                                )}
                                {isRejected && (
                                  <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-rose-100 text-black shadow-lg">
                                    ✗ Rejected
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="font-bold text-black mb-2 line-clamp-1">{property.title}</h3>
                              <p className="text-sm text-black mb-3 flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {property.location}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-black">
                                {property.bedrooms && (
                                  <span className="flex items-center gap-1">
                                    <BedDouble className="w-3.5 h-3.5" />
                                    {property.bedrooms} bed
                                  </span>
                                )}
                                {property.sleepsMax && (
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3.5 h-3.5" />
                                    Sleeps {property.sleepsMax}
                                  </span>
                                )}
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/owner/properties/${property.id}/edit`}
                                  className={`px-3 py-2 rounded-lg font-semibold transition-colors ${purpleButtonSoftClass}`}
                                  title="Edit property"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteProperty(property.id)}
                                  disabled={deletingPropertyId === property.id}
                                  className={`px-3 py-2 rounded-lg font-semibold transition-colors ${purpleButtonSoftClass} disabled:opacity-60`}
                                  title="Delete property"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                
                                {isApproved && (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleViewAvailability(property.id);
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${purpleButtonSoftClass}`}
                                  >
                                    <Calendar className="w-3.5 h-3.5" />
                                    Calendar
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bookings View */}
            {activeView === "bookings" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden text-black">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-black">All Bookings</h2>
                        <p className="text-sm text-gray-600">Manage and track all property bookings</p>
                      </div>
                    </div>
                    <button
                      onClick={loadBookings}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${purpleButtonSoftClass}`}
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {allBookings.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-10 h-10 text-black" />
                      </div>
                      <p className="text-black font-semibold mb-1">No bookings yet</p>
                      <p className="text-sm text-black">Your bookings will appear here</p>
                    </div>
                  ) : (
                    <div className="p-6 space-y-4">
                      {allBookings.map((booking) => (
                        <div key={booking.id} className="border border-gray-200 rounded-xl hover:shadow-lg transition-all overflow-hidden">
                          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                                  <Users className="w-5 h-5 text-purple-700" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">{booking.guestName}</h3>
                                  <p className="text-sm text-gray-600">Booking #{booking.id}</p>
                                </div>
                              </div>
                              <span className={`px-4 py-2 text-xs font-semibold rounded-full ${getStatusColor(booking.bookingStatus)}`}>
                                {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Property Info */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase">Property</h4>
                              <div className="flex items-start gap-2">
                                <Building className="w-4 h-4 text-purple-600 mt-1" />
                                <div>
                                  <p className="font-semibold text-gray-900">{booking.propertyName}</p>
                                  {booking.propertyLocation && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {booking.propertyLocation}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Dates & Guests */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase">Stay Details</h4>
                              <div className="space-y-1.5">
                                <p className="text-sm text-gray-700">
                                  <span className="font-semibold">Check-in:</span> {formatUKDate(booking.checkInDate)}
                                </p>
                                <p className="text-sm text-gray-700">
                                  <span className="font-semibold">Check-out:</span> {formatUKDate(booking.checkOutDate)}
                                </p>
                                {booking.numberOfGuests && (
                                  <p className="text-sm text-gray-700 flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {booking.numberOfGuests} guests
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Contact & Payment */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase">Contact & Payment</h4>
                              <div className="space-y-1.5">
                                {booking.guestEmail && (
                                  <p className="text-sm text-gray-700 flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {booking.guestEmail}
                                  </p>
                                )}
                                {booking.guestPhone && (
                                  <p className="text-sm text-gray-700">📞 {booking.guestPhone}</p>
                                )}
                                <div className="pt-2 border-t border-gray-200">
                                  <p className="text-lg font-bold text-purple-700">
                                    {booking.totalPrice ? `£${booking.totalPrice.toLocaleString()}` : '-'}
                                  </p>
                                  {booking.paymentStatus && (
                                    <p className={`text-xs font-medium ${
                                      booking.paymentStatus === 'paid' ? 'text-green-600' : 
                                      booking.paymentStatus === 'pending' ? 'text-amber-600' : 'text-gray-600'
                                    }`}>
                                      Payment: {booking.paymentStatus}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {booking.specialRequests && (
                            <div className="px-6 pb-4">
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                <p className="text-xs font-semibold text-amber-900 mb-1">Special Requests:</p>
                                <p className="text-sm text-amber-800">{booking.specialRequests}</p>
                              </div>
                            </div>
                          )}

                          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between gap-4">
                              <p className="text-xs text-gray-500">
                                Created: {formatUKDateTime(booking.createdAt || booking.checkInDate)}
                              </p>
                              
                              <div className="flex items-center gap-2">
                                {booking.bookingStatus !== 'rejected' && booking.bookingStatus !== 'cancelled' && (
                                  <button
                                    onClick={async () => {
                                      if (confirm('Are you sure you want to reject this booking?')) {
                                        try {
                                          const response = await fetch(`/api/owner/bookings/${booking.id}`, {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ bookingStatus: 'rejected' }),
                                          });
                                          
                                          if (response.ok) {
                                            alert('Booking rejected successfully');
                                            loadBookings();
                                          } else {
                                            const error = await response.json();
                                            alert(error.error || 'Failed to reject booking');
                                          }
                                        } catch (error) {
                                          alert('Failed to reject booking. Please try again.');
                                        }
                                      }
                                    }}
                                    className="px-4 py-2 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1.5"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                  </button>
                                )}
                                
                                <button
                                  onClick={async () => {
                                    if (confirm('Are you sure you want to DELETE this booking? This action cannot be undone.')) {
                                      try {
                                        const response = await fetch(`/api/owner/bookings/${booking.id}`, {
                                          method: 'DELETE',
                                        });
                                        
                                        if (response.ok) {
                                          alert('Booking deleted successfully');
                                          loadBookings();
                                        } else {
                                          const error = await response.json();
                                          alert(error.error || 'Failed to delete booking');
                                        }
                                      } catch (error) {
                                        alert('Failed to delete booking. Please try again.');
                                      }
                                    }
                                  }}
                                  className="px-4 py-2 text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center gap-1.5"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Properties View */}
            {activeView === "properties" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-md text-black">
                <div className="p-12 text-center">
                  <div className="w-24 h-24 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-6">
                    <Building className="w-12 h-12 text-purple-600" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-black mb-3">Property Management</h2>
                  <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
                    Add new properties or manage your existing listings. View, edit, and update property details, images, pricing, and availability.
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link href="/owner/properties/new">
                      <button className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${purpleButtonClass} flex items-center gap-3`}>
                        <Plus className="w-6 h-6" />
                        Add New Property
                      </button>
                    </Link>
                    
                    <Link href="/owner/properties">
                      <button className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${purpleButtonSoftClass} flex items-center gap-3 border-2 border-purple-300`}>
                        <Building className="w-6 h-6" />
                        Manage Properties
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Approvals View */}
            {activeView === "approvals" && (
              <div className="space-y-6 text-black">
                {/* Status Filter */}
                <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-md text-black">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: 'pending', label: 'Pending', icon: Clock, color: 'amber' },
                      { key: 'approved', label: 'Approved', icon: CheckCircle, color: 'emerald' },
                      { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'rose' },
                      { key: 'all', label: 'All', icon: Building, color: 'indigo' },
                    ].map((filter) => {
                      const Icon = filter.icon;
                      const isActive = statusFilter === filter.key;

                      return (
                        <button
                          key={filter.key}
                          onClick={() => setStatusFilter(filter.key as any)}
                          className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                            isActive
                              ? `${purpleButtonClass} shadow-md`
                              : `${purpleButtonSoftClass}`
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {filter.label} ({statusCounts[filter.key as keyof StatusCounts] || 0})
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Properties List */}
                {pendingProperties.length === 0 ? (
                  <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-md text-black">
                    <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-semibold mb-1">
                      No {statusFilter !== 'all' ? statusFilter : ''} properties
                    </p>
                    <p className="text-sm text-gray-500">Properties will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4 text-black">
                    {pendingProperties.map((property) => (
                      <div key={property.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all text-black">
                        <div className="flex flex-col md:flex-row">
                          <div className="relative w-full md:w-72 h-56 bg-gray-100">
                            {property.heroImage ? (
                              <Image src={property.heroImage} alt={property.title} fill className="object-cover" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                <Home className="w-16 h-16 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-6 text-black">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {property.location}
                                </p>
                              </div>
                              <div>
                                {property.status === 'pending' && (
                                  <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-700 border border-amber-300 text-sm font-semibold flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Pending Review
                                  </span>
                                )}
                                {property.status === 'approved' && (
                                  <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 text-sm font-semibold flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Approved
                                  </span>
                                )}
                                {property.status === 'rejected' && (
                                  <span className="px-4 py-2 rounded-full bg-rose-100 text-rose-700 border border-rose-300 text-sm font-semibold flex items-center gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Rejected
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                              {property.bedrooms && (
                                <span className="flex items-center gap-1">
                                  <BedDouble className="w-4 h-4" />
                                  {property.bedrooms} Bedrooms
                                </span>
                              )}
                              {property.bathrooms && (
                                <span className="flex items-center gap-1">
                                  <Bath className="w-4 h-4" />
                                  {property.bathrooms} Bathrooms
                                </span>
                              )}
                              {property.sleepsMax && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  Sleeps {property.sleepsMin}-{property.sleepsMax}
                                </span>
                              )}
                            </div>

                            {property.status === 'rejected' && property.rejectionReason && (
                              <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                                <div className="flex items-start gap-2">
                                  <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-semibold text-black mb-1">Rejection Reason:</p>
                                    <p className="text-sm text-black">{property.rejectionReason}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-3">
                              <Link href={`/properties/${property.slug}`} target="_blank">
                                <button className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${purpleButtonSoftClass}`}>
                                  <ExternalLink className="w-4 h-4" />
                                  View Listing
                                </button>
                              </Link>
                              {property.status === 'rejected' && (
                                <Link href={`/owner/properties`}>
                                  <button className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${purpleButtonClass}`}>
                                    Edit & Resubmit
                                  </button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payments View */}
            {activeView === "payments" && (
              <div className="space-y-6 text-black">
                {loadingPayments ? (
                  <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-md text-black">
                    <div className="relative inline-block">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-indigo-600"></div>
                      <Sparkles className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <p className="mt-4 text-black font-semibold">Loading payments...</p>
                  </div>
                ) : paymentHistory.length === 0 ? (
                  <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-md text-black">
                    <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-10 h-10 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-2">No payments yet</h3>
                    <p className="text-black mb-6">Your payment history will appear here</p>
                    <Link href="/owner/subscription">
                      <button className={`px-6 py-3 rounded-xl font-semibold transition-all ${purpleButtonClass}`}>
                        View Plans
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentHistory.map((payment: any) => (
                      <div key={payment.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all text-black">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            payment.status === 'succeeded' || payment.status === 'paid'
                              ? 'bg-emerald-100'
                              : payment.status === 'pending'
                              ? 'bg-amber-100'
                              : 'bg-rose-100'
                          }`}>
                            {payment.status === 'succeeded' || payment.status === 'paid' ? (
                              <CheckCircle className="w-6 h-6 text-black" />
                            ) : payment.status === 'pending' ? (
                              <Clock className="w-6 h-6 text-black" />
                            ) : (
                              <XCircle className="w-6 h-6 text-black" />
                            )}
                          </div>
                          <div className="flex-1">
                            {payment.planName && (
                              <div className="mb-2 inline-block px-4 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg">
                                <span className="text-sm font-bold text-black">
                                  📦 {payment.planName} Plan
                                  {payment.billingInterval && <span className="ml-1 font-normal">({payment.billingInterval})</span>}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-2xl text-black">£{(payment.amount / 100).toFixed(2)}</h3>
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                                {payment.status}
                              </span>
                            </div>
                            <p className="text-sm text-black mb-3">{payment.description}</p>
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg inline-flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-black" />
                              <span className="font-medium text-black">Payment Date:</span>
                              <span className="text-black">{formatUKDateTime(payment.createdAt)}</span>
                            </div>
                          </div>
                          {payment.invoiceUrl && (
                            <a href={payment.invoiceUrl} target="_blank" rel="noopener noreferrer">
                              <button className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${purpleButtonClass}`}>
                                Download
                              </button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Availability View */}
            {activeView === "availability" && (
              <div className="space-y-6 text-black">
                <button
                  onClick={() => setActiveView("properties")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${purpleButtonSoftClass}`}
                >
                  <Calendar className="w-5 h-5" />
                  ← Back to Properties
                </button>

                {loadingAvailability ? (
                  <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-md text-black">
                    <div className="relative inline-block">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-indigo-600"></div>
                      <Sparkles className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <p className="mt-4 text-black font-semibold">Loading availability...</p>
                  </div>
                ) : !propertyAvailability ? (
                  <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-md text-black">
                    <div className="w-20 h-20 rounded-2xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-10 h-10 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-2">No Property Selected</h3>
                    <p className="text-black mb-6">Please select a property to view its availability.</p>
                    <button 
                      onClick={() => setActiveView("properties")}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${purpleButtonClass}`}
                    >
                      View Properties
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-black">
                    {/* Calendar View */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-md text-black">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-bold text-black">
                            {properties.find(p => p.id === selectedPropertyId)?.title || 'Property'} - Availability
                          </h3>
                          <p className="text-sm text-black mt-1">View bookings and available dates</p>
                        </div>
                        <Link 
                          href={`/owner/properties/${selectedPropertyId}/availability`}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm flex items-center gap-2 ${purpleButtonClass}`}
                        >
                          Full Calendar
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>

                      {/* Status Legend */}
                      <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-gray-200">
                        {[
                          { label: 'Available / Empty', color: 'bg-emerald-100 border-emerald-300' },
                          { label: 'Booked', color: 'bg-rose-100 border-rose-300' },
                          { label: 'Reserved / Blocked', color: 'bg-amber-100 border-amber-300' },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-2 text-sm">
                            <span className={`w-4 h-4 rounded ${item.color} border`} />
                            <span className="text-black">{item.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Mini Calendar Grid - Next 35 days */}
                      <div
                        className="grid grid-cols-7 gap-2"
                        style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                      >
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
                            {day}
                          </div>
                        ))}
                        {(() => {
                          const today = new Date();
                          const days = [];
                          const startOfWeek = new Date(today);
                          startOfWeek.setDate(today.getDate() - today.getDay());
                          
                          for (let i = 0; i < 35; i++) {
                            const date = new Date(startOfWeek);
                            date.setDate(startOfWeek.getDate() + i);
                            const dateStr = date.toISOString().split('T')[0];
                            const isPast = date < today && date.toDateString() !== today.toDateString();
                            
                            const availRecord = propertyAvailability.availability?.find(a => a.date === dateStr);
                            const booking = propertyAvailability.bookings?.find(b => {
                              const checkIn = new Date(b.checkIn);
                              const checkOut = new Date(b.checkOut);
                              return date >= checkIn && date < checkOut;
                            });
                            
                            let status: 'available' | 'booked' | 'reserved' | 'past' = 'available';
                            if (isPast) status = 'past';
                            else if (booking) status = 'booked';
                            else if (availRecord && !availRecord.available) status = 'reserved';
                            
                            days.push(
                              <div
                                key={i}
                                className={`
                                  relative aspect-square p-2 rounded-xl text-sm font-semibold flex items-center justify-center transition-all
                                  ${status === 'past' ? 'bg-gray-50 text-black' : ''}
                                  ${status === 'available' ? 'bg-emerald-100 text-black border-2 border-emerald-300 hover:shadow-md cursor-pointer' : ''}
                                  ${status === 'booked' ? 'bg-rose-100 text-black border-2 border-rose-300 hover:shadow-md' : ''}
                                  ${status === 'reserved' ? 'bg-amber-100 text-black border-2 border-amber-300 hover:shadow-md' : ''}
                                  ${date.toDateString() === today.toDateString() ? 'ring-2 ring-indigo-600 ring-offset-2 ring-offset-gray-50' : ''}
                                `}
                                title={`${dateStr} - ${status}`}
                              >
                                {date.getDate()}
                                {booking && (
                                  <div className="absolute bottom-0 left-0 right-0 text-[10px] bg-rose-100 text-black px-1 rounded-b-lg truncate">
                                    {booking.guestName.split(' ')[0]}
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return days;
                        })()}
                      </div>
                    </div>

                    {/* Bookings Sidebar */}
                    <div className="space-y-4 text-black">
                      {/* Upcoming Bookings */}
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md text-black">
                        <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-black" />
                          </div>
                          Booked Dates
                        </h3>
                        {propertyAvailability.bookings && propertyAvailability.bookings.length > 0 ? (
                          <div className="space-y-3 max-h-80 overflow-y-auto">
                            {propertyAvailability.bookings.map((booking, idx) => (
                              <div key={idx} className="p-3 bg-rose-50 border border-rose-200 rounded-xl hover:shadow-md transition-all">
                                <p className="font-semibold text-black text-sm">{booking.guestName || 'Guest'}</p>
                                <p className="text-xs text-black mt-1">
                                  {formatUKDate(booking.checkIn)} → {formatUKDate(booking.checkOut)}
                                </p>
                                <span className={`inline-flex px-2 py-0.5 mt-2 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                  {booking.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-black text-center py-8">No bookings for this property yet.</p>
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md text-black">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Availability Stats</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-rose-50 rounded-xl">
                            <span className="text-sm font-medium text-gray-700">Total Bookings</span>
                            <span className="font-bold text-rose-700 text-lg">
                              {propertyAvailability.bookings?.length || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                            <span className="text-sm font-medium text-black">Reserved Dates</span>
                            <span className="font-bold text-black text-lg">
                              {propertyAvailability.availability?.filter(a => !a.available).length || 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                            <span className="text-sm font-medium text-black">Available Dates</span>
                            <span className="font-bold text-black text-lg">
                              {propertyAvailability.availability?.filter(a => a.available).length || 'All'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Manage Button */}
                      <Link href={`/owner/properties/${selectedPropertyId}/availability`}>
                        <button className={`w-full px-4 py-3 rounded-xl transition-all font-semibold flex items-center justify-center gap-2 ${purpleButtonClass}`}>
                          <Calendar className="w-5 h-5" />
                          Manage Full Calendar
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-indigo-600 mx-auto"></div>
              <Sparkles className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="mt-6 text-gray-700 font-semibold text-lg">Loading your dashboard...</p>
          </div>
        </div>
      }>
        <OwnerDashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
