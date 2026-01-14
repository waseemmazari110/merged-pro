"use client";

import { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDateUKLong } from "@/lib/date-utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface BookingCheckoutProps {
  propertyId: string;
  propertyTitle: string;
  basePrice: number;
  maxGuests: number;
}

interface QuoteResponse {
  booking_id: string;
  subtotal: number;
  cleaning_fee: number;
  security_deposit: number;
  total: number;
  nights: number;
}

interface CheckoutSessionResponse {
  session_url: string;
}

export default function BookingCheckout({
  propertyId,
  propertyTitle,
  basePrice,
  maxGuests,
}: BookingCheckoutProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "quote" | "checkout">("details");

  // Form data
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Quote data
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [bookingId, setBookingId] = useState<string>("");

  const resetForm = () => {
    setStep("details");
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setGuests(2);
    setName("");
    setEmail("");
    setPhone("");
    setQuote(null);
    setBookingId("");
  };

  const handleGetQuote = async () => {
    // Validation
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all contact details");
      return;
    }

    if (guests < 1 || guests > maxGuests) {
      toast.error(`Number of guests must be between 1 and ${maxGuests}`);
      return;
    }

    setLoading(true);
    try {
      // Call POST /bookings/quote
      const quoteData = await GEH_API.post<QuoteResponse>("/bookings/quote", {
        property_id: propertyId,
        check_in_date: format(checkInDate, "yyyy-MM-dd"),
        check_out_date: format(checkOutDate, "yyyy-MM-dd"),
        guests: guests,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      setQuote(quoteData);
      setBookingId(quoteData.booking_id);
      setStep("quote");
      toast.success("Quote generated successfully");
    } catch (error: any) {
      console.error("Failed to generate quote:", error);
      toast.error(error.message || "Failed to generate quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!bookingId) {
      toast.error("Booking ID is missing");
      return;
    }

    setLoading(true);
    try {
      // Call POST /payments/checkout-session
      const sessionData = await GEH_API.post<CheckoutSessionResponse>(
        "/payments/checkout-session",
        {
          booking_id: bookingId,
        }
      );

      // Redirect to Stripe checkout
      if (sessionData.session_url) {
        // Check if we're in an iframe
        const isInIframe = window.self !== window.top;
        
        if (isInIframe) {
          // Send message to parent to open in new tab
          window.parent.postMessage(
            {
              type: "OPEN_EXTERNAL_URL",
              data: { url: sessionData.session_url },
            },
            "*"
          );
          toast.success("Opening Stripe checkout in new tab...");
        } else {
          // Direct redirect
          window.location.href = sessionData.session_url;
        }
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Failed to create checkout session:", error);
      toast.error(error.message || "Failed to initiate checkout. Please try again.");
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case "details":
        return (
          <div className="space-y-4">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? formatDateUKLong(checkInDate) : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkInDate}
                      onSelect={setCheckInDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? formatDateUKLong(checkOutDate) : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={checkOutDate}
                      onSelect={setCheckOutDate}
                      disabled={(date) =>
                        date < (checkInDate || new Date())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Guests */}
            <div>
              <Label htmlFor="guests">Number of Guests (Max: {maxGuests})</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max={maxGuests}
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              />
            </div>

            {/* Contact Details */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900000"
              />
            </div>
          </div>
        );

      case "quote":
        return (
          <div className="space-y-4">
            {/* Booking Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-lg mb-3">Booking Summary</h3>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Property:</span>
                <span className="font-medium">{propertyTitle}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium">
                  {checkInDate ? formatDateUKLong(checkInDate) : "-"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium">
                  {checkOutDate ? formatDateUKLong(checkOutDate) : "-"}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">{guests}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nights:</span>
                <span className="font-medium">{quote?.nights || 0}</span>
              </div>
            </div>

            {/* Price Breakdown */}
            {quote && (
              <div className="border-t pt-4 space-y-2">
                <h3 className="font-semibold text-lg mb-3">Price Breakdown</h3>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>£{quote.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cleaning Fee:</span>
                  <span>£{quote.cleaning_fee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Security Deposit:</span>
                  <span>£{quote.security_deposit.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span className="text-[var(--color-accent-sage)]">
                    £{quote.total.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-blue-50 rounded-lg p-3 text-sm">
              <p className="text-blue-900">
                <strong>Contact:</strong> {name}
              </p>
              <p className="text-blue-900">
                <strong>Email:</strong> {email}
              </p>
              <p className="text-blue-900">
                <strong>Phone:</strong> {phone}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="w-full"
        style={{
          background: "var(--color-accent-sage)",
          color: "white",
        }}
      >
        Book Now
      </Button>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            resetForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {step === "details" && "Book Your Stay"}
              {step === "quote" && "Review & Confirm"}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">{renderStepContent()}</div>

          <DialogFooter>
            {step === "details" && (
              <>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleGetQuote}
                  disabled={loading}
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Getting Quote...
                    </>
                  ) : (
                    "Get Quote"
                  )}
                </Button>
              </>
            )}

            {step === "quote" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setStep("details")}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleProceedToCheckout}
                  disabled={loading}
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}