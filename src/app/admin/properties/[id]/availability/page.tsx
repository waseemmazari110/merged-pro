"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { GEH_API } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateSelectArg, EventClickArg } from "@fullcalendar/core";

interface Property {
  id: string;
  title: string;
}

interface AvailabilityEvent {
  id?: string;
  title: string;
  start: string;
  end: string;
  type: "blackout" | "booking_hold" | "booked";
  backgroundColor?: string;
  borderColor?: string;
  notes?: string;
}

interface AvailabilityFormData {
  start_date: string;
  end_date: string;
  type: "blackout" | "booking_hold";
  notes: string;
}

export default function PropertyAvailabilityPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  const calendarRef = useRef<any>(null);

  const [property, setProperty] = useState<Property | null>(null);
  const [events, setEvents] = useState<AvailabilityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<AvailabilityFormData>({
    start_date: "",
    end_date: "",
    type: "blackout",
    notes: "",
  });

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await GEH_API.get<Property>(`/properties/${propertyId}`);
        setProperty(data);
      } catch (error) {
        console.error("Failed to fetch property:", error);
        toast.error("Failed to load property");
        router.push("/admin/properties");
      }
    };

    fetchProperty();
  }, [propertyId, router]);

  // Fetch availability events
  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const data = await GEH_API.get<AvailabilityEvent[] | { events: AvailabilityEvent[] }>(
        `/properties/${propertyId}/availability`
      );

      // Handle both array response and object with events property
      const eventsArray = Array.isArray(data) ? data : data.events || [];

      // Map events with proper colors
      const mappedEvents = eventsArray.map((event) => ({
        ...event,
        title: event.title || (event.type === "blackout" ? "Blackout" : event.type === "booking_hold" ? "Booking Hold" : "Booked"),
        backgroundColor:
          event.type === "blackout"
            ? "#ef4444"
            : event.type === "booking_hold"
            ? "#f59e0b"
            : "#10b981",
        borderColor:
          event.type === "blackout"
            ? "#dc2626"
            : event.type === "booking_hold"
            ? "#d97706"
            : "#059669",
      }));

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Failed to fetch availability:", error);
      toast.error("Failed to load availability");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [propertyId]);

  // Handle date selection (drag or click)
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // Clear selection

    // Set form data with selected dates
    setFormData({
      start_date: selectInfo.startStr,
      end_date: selectInfo.endStr,
      type: "blackout",
      notes: "",
    });

    setModalOpen(true);
  };

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    
    toast.info(
      `${event.title}\n${event.startStr} to ${event.endStr}\n${
        event.extendedProps.notes || "No notes"
      }`
    );
  };

  // Submit new availability entry
  const handleSubmit = async () => {
    if (!formData.start_date || !formData.end_date) {
      toast.error("Please select start and end dates");
      return;
    }

    setSubmitting(true);
    try {
      await GEH_API.post(`/properties/${propertyId}/availability`, {
        start_date: formData.start_date,
        end_date: formData.end_date,
        type: formData.type,
        notes: formData.notes || undefined,
      });

      toast.success(
        `${
          formData.type === "blackout" ? "Blackout" : "Booking hold"
        } created successfully`
      );

      // Refresh calendar
      await fetchAvailability();

      // Close modal and reset form
      setModalOpen(false);
      setFormData({
        start_date: "",
        end_date: "",
        type: "blackout",
        notes: "",
      });
    } catch (error: any) {
      console.error("Failed to create availability entry:", error);
      toast.error(error.message || "Failed to create availability entry");
    } finally {
      setSubmitting(false);
    }
  };

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)] mx-auto mb-4" />
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/properties")}
            className="mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Manage Availability
              </h1>
              <p className="text-gray-600">{property.title}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">Blackout</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <span className="text-sm text-gray-600">Booking Hold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Booked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <CalendarIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-medium mb-1">
                How to use the calendar:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click and drag to select a date range</li>
                <li>• Click on a single date to block just that day</li>
                <li>
                  • Choose between blackout (unavailable) or booking hold
                  (tentative)
                </li>
                <li>• Click on existing entries to view details</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" />
            </div>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth",
              }}
              events={events}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="auto"
              editable={false}
              eventDisplay="block"
              displayEventTime={false}
            />
          )}
        </div>

        {/* Create Availability Modal */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Availability Entry</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Date Range Display */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{formData.start_date}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{formData.end_date}</span>
                </div>
              </div>

              {/* Type Selection */}
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "blackout" | "booking_hold") =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blackout">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        Blackout (Unavailable)
                      </div>
                    </SelectItem>
                    <SelectItem value="booking_hold">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded"></div>
                        Booking Hold (Tentative)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type === "blackout"
                    ? "Property will be completely unavailable during this period"
                    : "Property is tentatively held but not confirmed"}
                </p>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Add any notes about this availability entry..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  background: "var(--color-accent-sage)",
                  color: "white",
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Entry"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}