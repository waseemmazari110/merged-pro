"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Home, Mail, Calendar, Users, MapPin, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { GEH_API } from "@/lib/api-client";
import { formatDatabaseDateToUK } from "@/lib/date-utils";

// Force dynamic rendering since this page uses searchParams
export const dynamic = 'force-dynamic';

interface BookingDetails {
  id: string;
  property_title: string;
  property_location: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_amount: number;
  status: string;
}

// Separate component that uses useSearchParams
function BookingConfirmedContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bid");
  
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided");
      setLoading(false);
      return;
    }

    const fetchBookingDetails = async () => {
      try {
        const response = await GEH_API.get(`/bookings/${bookingId}`) as any;
        
        if (!response.success || !response.data) {
          throw new Error("Failed to load booking details");
        }
        
        setBooking(response.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError("Unable to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-[var(--color-accent-sage)] animate-spin mb-4" />
          <p className="text-lg text-[var(--color-neutral-dark)]">Loading your booking...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-red-600" />
          </div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Something Went Wrong
            </h2>
          <p className="text-lg text-[var(--color-neutral-dark)] mb-8">
            {error}
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-xl"
            style={{
              background: "var(--color-accent-sage)",
              color: "white",
            }}
          >
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      ) : booking ? (
        <>
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-float">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 
              className="text-4xl sm:text-5xl font-bold mb-4"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
            >
              Booking Confirmed!
            </h1>
            <p className="text-lg sm:text-xl text-[var(--color-neutral-dark)]">
              Your booking has been successfully confirmed. We've sent a confirmation email to your inbox.
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 
              className="text-2xl font-semibold mb-6 pb-4 border-b border-[var(--color-bg-secondary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your Booking Summary
            </h2>
            
            <div className="space-y-4">
              {/* Property */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5 text-[var(--color-accent-sage)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-neutral-dark)] mb-1">Property</p>
                  <p className="font-semibold text-lg">{booking.property_title}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[var(--color-accent-sage)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-neutral-dark)] mb-1">Location</p>
                  <p className="font-semibold">{booking.property_location}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-[var(--color-accent-gold)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-neutral-dark)] mb-1">Dates</p>
                  <p className="font-semibold">
                    {formatDatabaseDateToUK(booking.check_in)}
                    {" → "}
                    {formatDatabaseDateToUK(booking.check_out)}
                  </p>
                </div>
              </div>

              {/* Guests */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-gold)]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-[var(--color-accent-gold)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-neutral-dark)] mb-1">Guests</p>
                  <p className="font-semibold">{booking.guests} guest{booking.guests !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Booking Reference */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[var(--color-accent-sage)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-neutral-dark)] mb-1">Booking Reference</p>
                  <p className="font-semibold font-mono">{booking.id}</p>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="mt-6 pt-6 border-t border-[var(--color-bg-secondary)]">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Paid</span>
                <span 
                  className="text-3xl font-bold"
                  style={{ color: "var(--color-accent-sage)" }}
                >
                  £{booking.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-6 sm:p-8 mb-8">
            <h2 
              className="text-xl font-semibold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              What Happens Next?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>You'll receive a confirmation email with all booking details</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Our team will contact you within 24 hours to arrange check-in</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>You'll receive house rules and access instructions before arrival</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Need to add experiences? Contact us to enhance your stay</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-xl"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              <Link href="/">Back to Home</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-xl border-2"
              style={{
                borderColor: "var(--color-accent-gold)",
              }}
            >
              <Link href="/experiences">Add Experiences</Link>
            </Button>
          </div>

          {/* Contact Info */}
          <div className="text-center mt-12 text-[var(--color-neutral-dark)]">
            <p className="mb-2">Questions about your booking?</p>
            <p>
              Email us at{" "}
              <a 
                href="mailto:hello@groupescapehouses.co.uk"
                className="text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors font-medium"
              >
                hello@groupescapehouses.co.uk
              </a>
            </p>
          </div>
        </>
      ) : null}
    </main>
  );
}

// Loading fallback component
function BookingConfirmedLoading() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-[var(--color-accent-sage)] animate-spin mb-4" />
        <p className="text-lg text-[var(--color-neutral-dark)]">Loading confirmation...</p>
      </div>
    </main>
  );
}

export default function BookingConfirmedPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />
      <Suspense fallback={<BookingConfirmedLoading />}>
        <BookingConfirmedContent />
      </Suspense>
      <Footer />
    </div>
  );
}