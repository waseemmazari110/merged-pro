"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Home, 
  Calendar, 
  Settings, 
  LogOut,
  User,
  TrendingUp,
  Search,
  Filter,
  Download,
  ChevronLeft,
  Menu,
  X
} from "lucide-react";

// UK Date formatting utility
const formatFullUKDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

interface Booking {
  id: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  bookingStatus: string;
  totalPrice?: number;
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

function OwnerBookingsContent() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          const userData = session.data.user as any;
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          });
        }

        // Fetch all bookings
        const bookingsRes = await fetch('/api/owner/bookings?limit=50', { cache: 'no-store' });
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(Array.isArray(bookingsData) ? bookingsData : (bookingsData.bookings || []));
        } else {
          console.error('Failed to fetch owner bookings:', bookingsRes.status);
        }
      } catch (error) {
        console.error('Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    localStorage.removeItem("bearer_token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-sage)]"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-amber-600 bg-amber-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.bookingStatus.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Desktop Header */}
      <header className="hidden md:block bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-[var(--color-text-primary)]">PropManager</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm safe-top">
        <div className="flex items-center justify-between p-3 min-h-[56px]">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent-sage)] flex items-center justify-center flex-shrink-0">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-bold text-gray-900 truncate">PropManager</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors flex-shrink-0 touch-manipulation"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <div className="fixed top-[57px] left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto">
              <nav className="px-3 py-4 space-y-1 pb-safe">
                <Link
                  href="/owner/dashboard"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 touch-manipulation active:scale-[0.98] transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5 flex-shrink-0" />
                  <span>Overview</span>
                </Link>
                <Link
                  href="/owner/bookings"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-lg bg-[var(--color-accent-sage)] text-white font-medium touch-manipulation active:scale-[0.98] transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  <span>Bookings</span>
                </Link>
                <Link
                  href="/owner/properties"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 touch-manipulation active:scale-[0.98] transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5 flex-shrink-0" />
                  <span>Properties</span>
                </Link>
                <Link
                  href="/owner/payments"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 touch-manipulation active:scale-[0.98] transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <TrendingUp className="w-5 h-5 flex-shrink-0" />
                  <span>Payments</span>
                </Link>
                <Link
                  href="/owner/settings"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-gray-700 hover:bg-gray-50 active:bg-gray-100 touch-manipulation active:scale-[0.98] transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5 flex-shrink-0" />
                  <span>Settings</span>
                </Link>
                
                {/* Sign Out in Mobile Menu */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-red-600 hover:bg-red-50 active:bg-red-100 w-full touch-manipulation active:scale-[0.98] transition-all"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </>
        )}
      </div>

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-64 lg:w-72 bg-white border-r border-gray-200 flex-col fixed md:sticky top-0 h-screen md:top-[81px]">
          <nav className="flex-1 px-2 md:px-3 py-4 space-y-1 overflow-y-auto">
            <Link
              href="/owner/dashboard"
              className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm md:text-base"
            >
              <Home className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="truncate">Overview</span>
            </Link>
            <Link
              href="/owner/bookings"
              className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg bg-[var(--color-accent-sage)] text-white font-medium text-sm md:text-base transition-all"
            >
              <Calendar className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="truncate">Bookings</span>
            </Link>
            <Link
              href="/owner/properties"
              className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm md:text-base"
            >
              <Home className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="truncate">Properties</span>
            </Link>
            <Link
              href="/owner/payments"
              className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm md:text-base"
            >
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="truncate">Payments</span>
            </Link>
            <Link
              href="/owner/settings"
              className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm md:text-base"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="truncate">Settings</span>
            </Link>
          </nav>

          <div className="px-3 py-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'Y'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full md:ml-64 lg:ml-72">
          <div className="min-h-screen pt-16 md:pt-0">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              <div className="mb-6 sm:mb-8">
                <Link 
                  href="/owner/dashboard"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-2">Bookings</h2>
                <p className="text-sm sm:text-base text-gray-600">Manage all your property bookings</p>
              </div>

              {/* Filters */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by guest name, property, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-sage)]"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-sage)]"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table / Cards */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Guest
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                          Property
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                          Check-in
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden xl:table-cell">
                          Check-out
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                          Guests
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No bookings found</p>
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-4 sm:px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{booking.guestName}</div>
                              <div className="text-xs text-gray-500 truncate">{booking.guestEmail}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 hidden md:table-cell">{booking.propertyName}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{formatFullUKDate(booking.checkInDate)}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden xl:table-cell">{formatFullUKDate(booking.checkOutDate)}</td>
                            <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{booking.numberOfGuests}</td>
                            <td className="px-4 sm:px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.bookingStatus)}`}>
                                {booking.bookingStatus}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900 hidden lg:table-cell">
                              £{booking.totalPrice?.toLocaleString() || '0'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden">
                  {filteredBookings.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No bookings found</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredBookings.map((booking) => (
                        <div key={booking.id} className="p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{booking.guestName}</p>
                              <p className="text-xs text-gray-500 truncate">{booking.guestEmail}</p>
                            </div>
                            <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${getStatusColor(booking.bookingStatus)}`}>
                              {booking.bookingStatus}
                            </span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-gray-600">{booking.propertyName}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-gray-600">
                              <div>
                                <p className="text-xs text-gray-500">Check-in</p>
                                <p className="font-medium">{formatFullUKDate(booking.checkInDate)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Check-out</p>
                                <p className="font-medium">{formatFullUKDate(booking.checkOutDate)}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                              <div>
                                <p className="text-xs text-gray-500">Guests</p>
                                <p className="font-medium">{booking.numberOfGuests}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="font-medium">£{booking.totalPrice?.toLocaleString() || '0'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm">
                <p className="text-gray-600">
                  Showing {filteredBookings.length} of {bookings.length} bookings
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function OwnerBookings() {
  return (
    <ProtectedRoute allowedRoles={['owner']}>
      <OwnerBookingsContent />
    </ProtectedRoute>
  );
}
