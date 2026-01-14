"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";

interface Property {
  id: number;
  title: string;
  slug: string;
  location: string;
  priceFromWeekend: number;
}

interface DateAvailability {
  date: string;
  available: boolean;
  price?: number;
  bookingId?: number;
  notes?: string;
}

interface BookedDate {
  date: string;
  bookingId: number;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
}

function AvailabilityContent() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<Map<string, DateAvailability>>(new Map());
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'available' | 'blocked' | null>(null);
  const [customPrice, setCustomPrice] = useState<string>("");
  const [hasChanges, setHasChanges] = useState(false);
  const [statusCounts, setStatusCounts] = useState({ available: 0, booked: 0, reserved: 0 });

  // Fetch property and availability
  useEffect(() => {
    fetchPropertyAndAvailability();
  }, [propertyId]);

  const fetchPropertyAndAvailability = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!propertyId) {
        throw new Error('Property ID is missing');
      }

      // Fetch property
      console.log('Fetching property:', propertyId);
      const propRes = await fetch(`/api/owner/properties/${propertyId}`, { cache: 'no-store' });
      if (!propRes.ok) {
        const data = await propRes.json().catch(() => ({}));
        throw new Error(data.error || 'Property not found');
      }
      const propData = await propRes.json();
      
      // Handle both response formats: direct property or wrapped in {property: ...}
      const prop = propData.property || propData;
      
      if (!prop || !prop.id) {
        console.error('Invalid property data received:', propData);
        throw new Error('Invalid property data');
      }
      
      setProperty(prop);
      console.log('Property loaded:', prop.title);

      // Fetch availability
      console.log('Fetching availability for property:', propertyId);
      const availRes = await fetch(`/api/owner/properties/${propertyId}/availability`, { cache: 'no-store' });
      if (availRes.ok) {
        const availData = await availRes.json();
        console.log('Availability data:', availData);
        const availMap = new Map<string, DateAvailability>();
        
        // Process available dates
        if (availData.availability && Array.isArray(availData.availability)) {
          console.log(`Processing ${availData.availability.length} availability records`);
          availData.availability.forEach((item: any) => {
            availMap.set(item.date, {
              date: item.date,
              available: item.available !== false,
              price: item.price,
              notes: item.notes,
            });
          });
        }
        
        // Process booked dates
        if (availData.bookings && Array.isArray(availData.bookings)) {
          console.log(`Processing ${availData.bookings.length} booked dates`);
          setBookedDates(availData.bookings);
          availData.bookings.forEach((booking: any) => {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            
            // Mark all dates in the booking as unavailable
            for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
              const dateStr = formatDate(d);
              availMap.set(dateStr, {
                date: dateStr,
                available: false,
                bookingId: booking.id,
              });
            }
          });
        }
        
        setAvailability(availMap);
        console.log(`Total dates in availability map: ${availMap.size}`);
      } else {
        console.log('Availability API returned:', availRes.status);
        const errorData = await availRes.json().catch(() => ({}));
        console.warn('Availability fetch warning:', errorData);
        // Don't throw error, just continue without availability data
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Recompute counts whenever availability or bookings change
  useEffect(() => {
    const available = Array.from(availability.values()).filter(v => v.available !== false && !v.bookingId).length;
    const reserved = Array.from(availability.values()).filter(v => v.available === false && !v.bookingId).length;
    const booked = bookedDates.length;
    setStatusCounts({ available, reserved, booked });
  }, [availability, bookedDates]);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const parseDate = (dateStr: string): Date => {
    return new Date(dateStr + 'T00:00:00');
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: Date[] = [];
    
    // Add padding for first week
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push(d);
    }
    
    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add padding for last week
    const endPadding = 6 - lastDay.getDay();
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };

  const isPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  const getDateStatus = (date: Date): 'available' | 'blocked' | 'booked' | 'past' => {
    if (isPast(date)) return 'past';
    
    const dateStr = formatDate(date);
    const avail = availability.get(dateStr);
    
    if (avail?.bookingId) return 'booked';
    if (avail?.available === false) return 'blocked';
    return 'available';
  };

  const handleDateClick = (date: Date) => {
    if (isPast(date)) return;
    
    const dateStr = formatDate(date);
    const status = getDateStatus(date);
    
    // Can't modify booked dates
    if (status === 'booked') return;
    
    const newSelected = new Set(selectedDates);
    if (newSelected.has(dateStr)) {
      newSelected.delete(dateStr);
    } else {
      newSelected.add(dateStr);
    }
    setSelectedDates(newSelected);
  };

  const handleBulkAction = (action: 'available' | 'blocked') => {
    if (selectedDates.size === 0) return;
    
    const newAvailability = new Map(availability);
    
    selectedDates.forEach(dateStr => {
      const existing = newAvailability.get(dateStr);
      if (!existing?.bookingId) {
        newAvailability.set(dateStr, {
          date: dateStr,
          available: action === 'available',
          price: customPrice ? parseFloat(customPrice) : existing?.price,
        });
      }
    });
    
    setAvailability(newAvailability);
    setSelectedDates(new Set());
    setBulkAction(null);
    setCustomPrice("");
    setHasChanges(true);
  };

  const selectAllInMonth = () => {
    const days = getDaysInMonth(currentMonth);
    const newSelected = new Set<string>();
    
    days.forEach(day => {
      if (isCurrentMonth(day) && !isPast(day)) {
        const status = getDateStatus(day);
        if (status !== 'booked') {
          newSelected.add(formatDate(day));
        }
      }
    });
    
    setSelectedDates(newSelected);
  };

  const clearSelection = () => {
    setSelectedDates(new Set());
  };

  const saveAvailability = async () => {
    if (!property) return;
    
    try {
      setSaving(true);
      setError(null);
      
      // Convert availability map to array
      const availabilityArray = Array.from(availability.entries())
        .filter(([_, val]) => !val.bookingId) // Don't save booked dates
        .map(([date, val]) => ({
          date,
          available: val.available,
          price: val.price,
          notes: val.notes,
        }));
      
      const res = await fetch(`/api/owner/properties/${propertyId}/availability`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: availabilityArray }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save availability');
      }
      
      setHasChanges(false);
      setSuccessMessage('Availability saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-(--color-accent-sage) mx-auto" />
          <p className="mt-4 text-gray-600">Loading availability...</p>
        </div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Property</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/owner/properties')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </Card>
      </div>
    );
  }

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push('/owner/properties')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-(--color-accent-sage)" />
                  Manage Availability
                </h1>
                <p className="text-sm text-gray-500">{property?.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-sm text-amber-600">Unsaved changes</span>
              )}
              <Button
                onClick={saveAvailability}
                disabled={saving || !hasChanges}
                className="gap-2 bg-(--color-accent-sage) hover:bg-emerald-700"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-lg font-semibold text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Week Days Header */}
                <div
                  className="grid grid-cols-7 gap-1 mb-2"
                  style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                >
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
                <div
                  className="grid grid-cols-7 gap-1"
                  style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
                >
                {days.map((day, idx) => {
                  const dateStr = formatDate(day);
                  const status = getDateStatus(day);
                  const isSelected = selectedDates.has(dateStr);
                  const inMonth = isCurrentMonth(day);
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleDateClick(day)}
                      disabled={status === 'past' || status === 'booked'}
                      className={`
                        relative aspect-square p-2 rounded-lg text-sm font-medium transition-all
                        ${!inMonth ? 'text-gray-300' : ''}
                        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                        ${status === 'available' ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300' : ''}
                        ${status === 'blocked' ? 'bg-gray-200 text-gray-600 hover:bg-gray-300 border border-gray-400' : ''}
                        ${status === 'booked' ? 'bg-red-100 text-red-800 cursor-not-allowed border border-red-300' : ''}
                        ${status === 'past' ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
                        ${isToday(day) ? 'ring-2 ring-(--color-accent-sage)' : ''}
                      `}
                    >
                      <span>{day.getDate()}</span>
                      {status === 'booked' && (
                        <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend + Counts */}
              <div className="flex flex-wrap gap-6 mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-4 h-4 rounded bg-green-100 border border-green-300" />
                    <span className="text-gray-700 font-medium">Available</span>
                    <span className="text-gray-500 text-xs">({statusCounts.available})</span>
                  </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 rounded bg-red-100 border border-red-300" />
                  <span className="text-gray-700 font-medium">Booked</span>
                  <span className="text-gray-500 text-xs">({statusCounts.booked})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 rounded bg-gray-200 border border-gray-400" />
                  <span className="text-gray-700 font-medium">Reserved</span>
                  <span className="text-gray-500 text-xs">({statusCounts.reserved})</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 rounded bg-gray-50 border border-gray-200" />
                  <span className="text-gray-600">Past</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selection Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Dates</h3>
              
              {selectedDates.size === 0 ? (
                <p className="text-gray-500 text-sm mb-4">
                  Click on dates to select them, then use the actions below.
                </p>
              ) : (
                <p className="text-sm text-gray-700 mb-4">
                  <span className="font-semibold">{selectedDates.size}</span> date{selectedDates.size !== 1 ? 's' : ''} selected
                </p>
              )}

              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={selectAllInMonth}
                >
                  Select All in {monthNames[currentMonth.getMonth()]}
                </Button>
                
                {selectedDates.size > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={clearSelection}
                    >
                      Clear Selection
                    </Button>
                    
                    <hr className="my-3" />
                    
                    <Button
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 gap-2"
                      onClick={() => handleBulkAction('available')}
                    >
                      <Check className="w-4 h-4" />
                      Mark Available
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => handleBulkAction('blocked')}
                    >
                      <X className="w-4 h-4" />
                      Block Dates
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Custom Pricing */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Pricing</h3>
              <p className="text-sm text-gray-500 mb-4">
                Set a custom price for selected dates (optional)
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">£</span>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    placeholder={property?.priceFromWeekend?.toString() || "0"}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-accent-sage) focus:border-transparent"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Default: £{property?.priceFromWeekend || 0} per night
              </p>
            </Card>

            {/* Bookings List */}
            {bookedDates.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {bookedDates.map((booking, idx) => (
                    <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-medium text-gray-900">{booking.guestName || 'Guest'}</p>
                      <p className="text-sm text-gray-600">
                        {booking.checkIn} → {booking.checkOut}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Help */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">How it works</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <span className="text-green-600 font-medium">Green</span> dates are available for booking</li>
                    <li>• <span className="text-red-600 font-medium">Red</span> dates have confirmed bookings</li>
                    <li>• <span className="text-gray-600 font-medium">Gray</span> dates are reserved/blocked by you</li>
                    <li>• Click dates to select, then apply actions</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OwnerAvailabilityPage() {
  return (
    <ProtectedRoute allowedRoles={["owner", "admin"]}>
      <AvailabilityContent />
    </ProtectedRoute>
  );
}
