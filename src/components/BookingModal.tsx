"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, User, Minus, Plus } from "lucide-react";
import { formatDateUKLong } from "@/lib/date-utils";
import { format } from "date-fns";
import { GEH_API } from "@/lib/api-client";
import { toast } from "sonner";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyTitle: string;
  priceFrom: number;
}

export default function BookingModal({
  open,
  onOpenChange,
  propertyId,
  propertyTitle,
  priceFrom,
}: BookingModalProps) {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBookNow = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (guests < 1) {
      toast.error("Please select at least 1 guest");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create booking quote
      const quoteResponse = await GEH_API.post("/bookings/quote", {
        property_id: propertyId,
        check_in: format(checkInDate, "yyyy-MM-dd"),
        check_out: format(checkOutDate, "yyyy-MM-dd"),
        guests: guests,
      }) as any;

      if (!quoteResponse.success || !quoteResponse.data?.booking_id) {
        throw new Error("Failed to create booking quote");
      }

      const bookingId = quoteResponse.data.booking_id;

      // Step 2: Create checkout session
      const checkoutResponse = await GEH_API.post("/payments/checkout-session", {
        booking_id: bookingId,
        success_url: `${window.location.origin}/booking/confirmed?bid=${bookingId}`,
        cancel_url: window.location.href,
      }) as any;

      if (!checkoutResponse.success || !checkoutResponse.data?.session?.url) {
        throw new Error("Failed to create checkout session");
      }

      // Step 3: Redirect to Stripe checkout
      const sessionUrl = checkoutResponse.data.session.url;
      
      // Check if we're in an iframe
      const isInIframe = window.self !== window.top;
      
      if (isInIframe) {
        // Post message to parent to open in new tab
        window.parent.postMessage(
          { type: "OPEN_EXTERNAL_URL", data: { url: sessionUrl } },
          "*"
        );
      } else {
        // Direct redirect
        window.location.href = sessionUrl;
      }

    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process booking");
      setIsProcessing(false);
    }
  };

  const dateRangeDisplay =
    checkInDate && checkOutDate
      ? `${formatDateUKLong(checkInDate)} → ${formatDateUKLong(checkOutDate)}`
      : checkInDate
      ? `${formatDateUKLong(checkInDate)} → ?`
      : "Select dates";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ fontFamily: "var(--font-display)" }}>
            Book {propertyTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Check-in / Check-out
            </label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12"
                >
                  <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                  <span className={checkInDate ? "text-gray-900" : "text-gray-500"}>
                    {dateRangeDisplay}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-4 border-b flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">
                    {!checkInDate && "Select check-in date"}
                    {checkInDate && !checkOutDate && "Select check-out date"}
                    {checkInDate && checkOutDate && "Your dates"}
                  </p>
                  <button
                    onClick={() => {
                      setCheckInDate(undefined);
                      setCheckOutDate(undefined);
                    }}
                    className="text-sm text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors font-medium"
                    type="button"
                  >
                    Clear dates
                  </button>
                </div>
                <CalendarComponent
                  mode="range"
                  selected={
                    checkInDate && checkOutDate
                      ? { from: checkInDate, to: checkOutDate }
                      : checkInDate
                      ? { from: checkInDate, to: undefined }
                      : undefined
                  }
                  onSelect={(range) => {
                    if (!range) return;
                    
                    if ('from' in range && range.from) {
                      setCheckInDate(range.from);
                      
                      if (range.to) {
                        setCheckOutDate(range.to);
                        // Close when both dates selected
                        setTimeout(() => setDatePickerOpen(false), 300);
                      } else {
                        setCheckOutDate(undefined);
                      }
                    }
                  }}
                  numberOfMonths={2}
                  disabled={(date) => {
                    const today = new Date(new Date().setHours(0, 0, 0, 0));
                    return date < today;
                  }}
                  modifiersClassNames={{
                    range_start: "ge-date-start",
                    range_end: "ge-date-end",
                    range_middle: "ge-date-in-range",
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal h-12"
                >
                  <User className="mr-2 h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    {guests} guest{guests !== 1 ? "s" : ""}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6" align="start">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Guests</div>
                  </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 min-h-[48px] min-w-[48px] rounded-lg border-2 border-[var(--color-accent-sage)]"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        aria-label="Decrease guests"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold" aria-live="polite">{guests}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 min-h-[48px] min-w-[48px] rounded-lg border-2 border-[var(--color-accent-sage)]"
                        onClick={() => setGuests(guests + 1)}
                        aria-label="Increase guests"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Price Summary */}
          <div className="rounded-lg bg-[var(--color-bg-secondary)] p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[var(--color-neutral-dark)]">
                From £{priceFrom} per night
              </span>
            </div>
            {checkInDate && checkOutDate && (
              <div className="text-sm text-[var(--color-neutral-dark)]">
                {Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))}{" "}
                night{Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)) !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleBookNow}
              disabled={isProcessing || !checkInDate || !checkOutDate}
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              {isProcessing ? "Processing..." : "Book Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}