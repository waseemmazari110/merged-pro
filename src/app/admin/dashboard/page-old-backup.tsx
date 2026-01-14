"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";
import { 
  Home, 
  Calendar, 
  Users,
  Building,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  UserCheck,
  UserCog,
  Search,
  Download,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyApprovals from "@/components/admin/PropertyApprovals";
import Transactions from "@/components/admin/Transactions";

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

interface AdminStats {
  totalBookings: number;
  totalUsers: number;
  totalOwners: number;
  totalGuests: number;
  totalProperties: number;
  totalRevenue: number;
}

interface Booking {
  id: number;
  guestName: string;
  guestEmail: string;
  propertyName: string;
  checkInDate: string;
  checkOutDate: string;
  bookingStatus: string;
  numberOfGuests?: number;
  totalPrice?: number;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  emailVerified?: boolean;
}

interface StatusCounts {
  pending: number;
  approved: number;
  rejected: number;
  all: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<"overview" | "bookings" | "users" | "approvals" | "transactions">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({ pending: 0, approved: 0, rejected: 0, all: 0 });

  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam && ['overview', 'bookings', 'users', 'approvals', 'transactions'].includes(viewParam)) {
      setActiveView(viewParam as "overview" | "bookings" | "users" | "approvals" | "transactions");
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const session = await authClient.getSession();
        if (!session?.data?.user) {
          router.replace('/auth/admin-login');
          return;
        }

        setUser({
          id: session.data.user.id,
          name: session.data.user.name || session.data.user.email.split('@')[0],
          email: session.data.user.email,
          role: (session.data.user as any).role || 'admin',
        });

        const [statsRes, bookingsRes, usersRes] = await Promise.all([
          fetch('/api/admin/stats', { cache: 'no-store' }),
          fetch('/api/bookings?limit=50', { cache: 'no-store' }),
          fetch('/api/admin/users', { cache: 'no-store' })
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookings(Array.isArray(data) ? data : (data.bookings || []));
        }
        if (usersRes.ok) {
          const data = await usersRes.json();
          setUsers(data.users || []);
        }

        // Fetch property counts
        const propsRes = await fetch('/api/admin/properties/pending?status=all&limit=1', { cache: 'no-store' });
        if (propsRes.ok) {
          const data = await propsRes.json();
          setStatusCounts(data.statusCounts || { pending: 0, approved: 0, rejected: 0, all: 0 });
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace('/auth/admin-login');
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'confirmed') return 'bg-green-100 text-green-700 border border-green-300';
    if (statusLower === 'pending') return 'bg-amber-100 text-amber-700 border border-amber-300';
    if (statusLower === 'completed') return 'bg-blue-100 text-blue-700 border border-blue-300';
    if (statusLower === 'cancelled') return 'bg-red-100 text-red-700 border border-red-300';
    return 'bg-slate-100 text-slate-700 border border-slate-300';
  };

  const getRoleBadge = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower === 'admin') return 'bg-purple-100 text-purple-700';
    if (roleLower === 'owner') return 'bg-blue-100 text-blue-700';
    if (roleLower === 'guest') return 'bg-green-100 text-green-700';
    return 'bg-slate-100 text-slate-700';
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className={`${color} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border border-opacity-50 cursor-pointer`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90 mb-2">{title}</p>
          <p className="text-4xl font-bold">{value?.toLocaleString() || '0'}</p>
        </div>
        <Icon className="w-12 h-12 opacity-80" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-linear-to-b from-slate-900 via-slate-900 to-slate-800 text-white min-h-screen sticky top-0 shadow-2xl overflow-y-auto">
        {/* Logo Section */}
        <div className="p-8 border-b border-slate-700 bg-linear-to-r from-slate-900 to-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-400">Control Center</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-8 space-y-3">
          {[
            { name: 'Overview', icon: Home, view: 'overview' },
            { name: 'Bookings', icon: Calendar, view: 'bookings' },
            { name: 'User Management', icon: Users, view: 'users' },
            { name: 'Transactions', icon: Search, view: 'transactions' },
          ].map((item) => (
            <button
              key={item.view}
              onClick={() => { setActiveView(item.view as any); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeView === item.view
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          ))}

          {/* Property Approvals - Prominent */}
          <div className="my-4 pt-4 border-t border-slate-700">
            <button
              onClick={() => { setActiveView('approvals'); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold transition-all duration-200 border-2 ${
                activeView === 'approvals'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-xl'
                  : 'bg-linear-to-r from-orange-500 to-red-500 text-white border-yellow-400 hover:from-orange-600 hover:to-red-600 shadow-lg'
              }`}
            >
              <Building className="w-6 h-6" />
              <div className="flex-1 text-left">
                <div>🏠 Property Approvals</div>
                {statusCounts.pending > 0 && (
                  <div className="text-xs font-normal opacity-90 mt-1">
                    {statusCounts.pending} waiting
                  </div>
                )}
              </div>
              {statusCounts.pending > 0 && (
                <div className="bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
                  {statusCounts.pending}
                </div>
              )}
            </button>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-slate-700 bg-linear-to-r from-slate-900 to-slate-800 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
              <span className="text-base font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-slate-900 via-slate-900 to-slate-800 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">Admin</span>
              <span className="text-xs text-slate-400 block">{user?.name || 'Panel'}</span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="bg-slate-800 border-t border-slate-700">
            <nav className="px-4 py-4 space-y-2">
              {[
                { name: 'Overview', icon: Home, view: 'overview' },
                { name: 'Bookings', icon: Calendar, view: 'bookings' },
                { name: 'Users', icon: Users, view: 'users' },
                { name: 'Transactions', icon: Search, view: 'transactions' },
                { name: '🏠 Property Approvals', icon: Building, view: 'approvals' },
              ].map((item) => (
                <button
                  key={item.view}
                  onClick={() => { setActiveView(item.view as any); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                    activeView === item.view
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              ))}
              <button
                onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-red-400 hover:bg-slate-700 transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-[60px] md:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              {activeView === "overview" && "📊 Dashboard"}
              {activeView === "bookings" && "📅 Bookings"}
              {activeView === "users" && "👥 User Management"}
              {activeView === "approvals" && "🏠 Property Approvals"}
              {activeView === "transactions" && "💳 Transactions"}
            </h1>
            <p className="text-slate-600">
              {activeView === "overview" && "Monitor your platform's performance"}
              {activeView === "bookings" && "View and manage all booking records"}
              {activeView === "users" && "Manage guests and property owners"}
              {activeView === "approvals" && "Review and approve property listings"}
              {activeView === "transactions" && "View all payment transactions from owners"}
            </p>
          </div>

          {/* Overview Section */}
          {activeView === "overview" && (
            <>
              {/* Action Alert */}
              {statusCounts.pending > 0 && (
                <div className="mb-8 bg-linear-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-6 shadow-2xl border-4 border-yellow-300 hover:shadow-3xl transition-all">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-10 h-10 text-white shrink-0 animate-bounce" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">⚠️ Pending Approvals</h3>
                      <p className="text-white text-lg font-semibold mb-4">
                        {statusCounts.pending} {statusCounts.pending === 1 ? 'property' : 'properties'} awaiting review
                      </p>
                      <button
                        onClick={() => setActiveView("approvals")}
                        className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-orange-600 font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-2 border-white cursor-pointer"
                      >
                        <Building className="w-5 h-5" />
                        Review Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={Calendar}
                  title="Total Bookings"
                  value={stats?.totalBookings}
                  color="bg-gradient-to-br from-blue-600 to-blue-700"
                />
                <StatCard
                  icon={Users}
                  title="Total Users"
                  value={stats?.totalUsers}
                  color="bg-gradient-to-br from-purple-600 to-purple-700"
                />
                <StatCard
                  icon={UserCog}
                  title="Property Owners"
                  value={stats?.totalOwners}
                  color="bg-gradient-to-br from-green-600 to-green-700"
                />
                <StatCard
                  icon={UserCheck}
                  title="Guests"
                  value={stats?.totalGuests}
                  color="bg-gradient-to-br from-orange-600 to-orange-700"
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Recent Bookings</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveView("bookings")}
                      className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {bookings.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="font-medium">No bookings yet</p>
                      </div>
                    ) : (
                      bookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-start gap-4 p-4 bg-linear-to-r from-slate-50 to-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                          <Calendar className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900">{booking.guestName}</p>
                            <p className="text-sm text-slate-600">{booking.propertyName}</p>
                            <p className="text-xs text-slate-500 mt-1">{formatUKDate(booking.createdAt)}</p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Recent Users</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveView("users")}
                      className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {users.filter(u => u.role !== 'admin').length === 0 ? (
                      <div className="text-center py-8 text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p className="font-medium">No users yet</p>
                      </div>
                    ) : (
                      users.filter(u => u.role !== 'admin').slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-start gap-4 p-4 bg-linear-to-r from-slate-50 to-white rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-white">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-600 truncate">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${getRoleBadge(user.role)}`}>
                                {user.role}
                              </span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                                user.emailVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {user.emailVerified ? '✓ Verified' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Bookings Section */}
          {activeView === "bookings" && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="🔍 Search bookings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-slate-900 border-slate-300"
                  />
                  <Button variant="outline" className="gap-2 cursor-pointer">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase">Guest</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase hidden sm:table-cell">Property</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase hidden md:table-cell">Check-in</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{booking.guestName}</p>
                          <p className="text-xs text-slate-500">{booking.guestEmail}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 hidden sm:table-cell">{booking.propertyName}</td>
                        <td className="px-6 py-4 text-sm text-slate-700 hidden md:table-cell">{formatUKDate(booking.checkInDate)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${getStatusColor(booking.bookingStatus)}`}>
                            {booking.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Section */}
          {activeView === "users" && (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    placeholder="🔍 Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-slate-900 border-slate-300"
                  />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                    <option value="guest">Guest</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase">User</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase hidden sm:table-cell">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase hidden md:table-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <p className="font-semibold text-slate-900">{user.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 hidden sm:table-cell">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${getRoleBadge(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-lg ${
                            user.emailVerified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {user.emailVerified ? '✓ Verified' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transactions Section */}
          {activeView === "transactions" && (
            <Transactions />
          )}

          {/* Property Approvals Section */}
          {activeView === "approvals" && (
            <PropertyApprovals />
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Suspense fallback={
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 font-semibold">Loading Admin Dashboard...</p>
          </div>
        </div>
      }>
        <AdminDashboardContent />
      </Suspense>
    </ProtectedRoute>
  );
}
