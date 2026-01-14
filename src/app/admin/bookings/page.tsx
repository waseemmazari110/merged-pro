"use client";

import { useState, useEffect } from "react";
import { Search, Filter, X, Eye, Edit2, Trash2, Calendar, DollarSign, Users, TrendingUp, Home, Download } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatDatabaseDateToUK } from "@/lib/date-utils";

interface Booking {
  id: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  propertyName: string;
  propertyLocation: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  depositPaid: number;
  balanceDue: number;
  paymentStatus: string;
  bookingStatus: string;
  specialRequests?: string;
  experiences?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingStats {
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  confirmedBookings: number;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  popularProperties: Array<{ property: string; count: number }>;
  upcomingBookings: number;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    bookingStatus: "",
    paymentStatus: "",
    adminNotes: ""
  });

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }
      
      const response = await fetch(`/api/bookings?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch bookings");
      
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/bookings/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load statistics");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [statusFilter]);

  // Filter bookings by search term
  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      booking.guestName.toLowerCase().includes(searchLower) ||
      booking.guestEmail.toLowerCase().includes(searchLower) ||
      booking.propertyName.toLowerCase().includes(searchLower)
    );
  });

  // Handle update booking
  const handleUpdateBooking = async () => {
    if (!selectedBooking) return;

    try {
      const response = await fetch(`/api/bookings?id=${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) throw new Error("Failed to update booking");

      toast.success("Booking updated successfully");
      setIsEditDialogOpen(false);
      fetchBookings();
      fetchStats();
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Failed to update booking");
    }
  };

  // Handle delete booking
  const handleDeleteBooking = async (id: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`/api/bookings?id=${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      toast.success("Booking deleted successfully");
      fetchBookings();
      fetchStats();
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking");
    }
  };

  // Open edit dialog
  const openEditDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditForm({
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      adminNotes: booking.adminNotes || ""
    });
    setIsEditDialogOpen(true);
  };

  // Open details dialog
  const openDetailsDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsDialogOpen(true);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["ID", "Guest Name", "Email", "Property", "Check In", "Check Out", "Guests", "Total Price", "Status"];
    const rows = filteredBookings.map(b => [
      b.id,
      b.guestName,
      b.guestEmail,
      b.propertyName,
      formatDatabaseDateToUK(b.checkInDate),
      formatDatabaseDateToUK(b.checkOutDate),
      b.numberOfGuests,
      `£${b.totalPrice}`,
      b.bookingStatus
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success("Bookings exported successfully");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 mt-20">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Booking Management
          </h1>
          <p className="text-lg text-[var(--color-neutral-dark)]">
            Manage all your property bookings in one place
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="w-4 h-4 text-[var(--color-accent-sage)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.upcomingBookings} upcoming
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="w-4 h-4 text-[var(--color-accent-gold)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">£{stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">All time earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                <Users className="w-4 h-4 text-[var(--color-accent-sage)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
                <p className="text-xs text-muted-foreground mt-1">Ready to go</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by guest name, email, or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={exportToCSV}
                variant="outline"
                className="w-full md:w-auto"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {(searchTerm || statusFilter !== "all") && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {searchTerm}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setSearchTerm("")}
                    />
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {statusFilter}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setStatusFilter("all")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-sage)]"></div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Home className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-2">No bookings found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guests
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.guestName}
                          </div>
                          <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.propertyName}
                          </div>
                          <div className="text-sm text-gray-500">{booking.propertyLocation}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDatabaseDateToUK(booking.checkInDate)}
                          </div>
                          <div className="text-sm text-gray-500">
                            to {formatDatabaseDateToUK(booking.checkOutDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.numberOfGuests}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            £{booking.totalPrice}
                          </div>
                          <div className="text-xs text-gray-500">
                            Paid: £{booking.depositPaid}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(booking.bookingStatus)}>
                            {booking.bookingStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={
                              booking.paymentStatus === "Paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }
                          >
                            {booking.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDetailsDialog(booking)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(booking)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Properties */}
        {stats && stats.popularProperties.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Popular Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.popularProperties.map((property, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{property.property}</span>
                    </div>
                    <Badge variant="secondary">{property.count} bookings</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* View Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Guest Name</Label>
                  <p className="text-sm">{selectedBooking.guestName}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Email</Label>
                  <p className="text-sm">{selectedBooking.guestEmail}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Phone</Label>
                  <p className="text-sm">{selectedBooking.guestPhone}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Number of Guests</Label>
                  <p className="text-sm">{selectedBooking.numberOfGuests}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Property</Label>
                    <p className="text-sm">{selectedBooking.propertyName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Location</Label>
                    <p className="text-sm">{selectedBooking.propertyLocation}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Check In</Label>
                    <p className="text-sm">
                      {formatDatabaseDateToUK(selectedBooking.checkInDate)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Check Out</Label>
                    <p className="text-sm">
                      {formatDatabaseDateToUK(selectedBooking.checkOutDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Total Price</Label>
                    <p className="text-sm font-bold">£{selectedBooking.totalPrice}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Deposit Paid</Label>
                    <p className="text-sm">£{selectedBooking.depositPaid}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Balance Due</Label>
                    <p className="text-sm">£{selectedBooking.balanceDue}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Payment Status</Label>
                    <Badge
                      className={
                        selectedBooking.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {selectedBooking.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedBooking.specialRequests && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-semibold">Special Requests</Label>
                  <p className="text-sm mt-1">{selectedBooking.specialRequests}</p>
                </div>
              )}

              {selectedBooking.experiences && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-semibold">Experiences</Label>
                  <p className="text-sm mt-1">{selectedBooking.experiences}</p>
                </div>
              )}

              {selectedBooking.adminNotes && (
                <div className="border-t pt-4">
                  <Label className="text-sm font-semibold">Admin Notes</Label>
                  <p className="text-sm mt-1">{selectedBooking.adminNotes}</p>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <Label className="text-xs font-semibold">Created</Label>
                    <p>{new Date(selectedBooking.createdAt).toLocaleString('en-GB')}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Last Updated</Label>
                    <p>{new Date(selectedBooking.updatedAt).toLocaleString('en-GB')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <Label>Booking Status</Label>
                <Select
                  value={editForm.bookingStatus}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, bookingStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Payment Status</Label>
                <Select
                  value={editForm.paymentStatus}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, paymentStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Deposit Paid">Deposit Paid</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Admin Notes</Label>
                <Textarea
                  placeholder="Add internal notes about this booking..."
                  value={editForm.adminNotes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, adminNotes: e.target.value })
                  }
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBooking}
              style={{ background: "var(--color-accent-sage)", color: "white" }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}