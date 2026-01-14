"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Thank you!
            </h1>

            <p className="text-lg text-[var(--color-neutral-dark)] mb-8">
              Your listing is now active. You will receive a confirmation email with invoice details.
            </p>

            <div className="space-y-4 mb-8 text-left bg-[var(--color-bg-primary)] rounded-xl p-6">
              <h3 className="font-semibold text-[var(--color-text-primary)]">What happens next?</h3>
              <ul className="space-y-3 text-[var(--color-neutral-dark)]">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-accent-sage)] text-white flex items-center justify-center text-sm flex-shrink-0">1</span>
                  <span>Our team will review your account and reach out within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-accent-sage)] text-white flex items-center justify-center text-sm flex-shrink-0">2</span>
                  <span>We&apos;ll help you set up your property listing with photos and details</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-accent-sage)] text-white flex items-center justify-center text-sm flex-shrink-0">3</span>
                  <span>Your listing will go live and you&apos;ll start receiving enquiries</span>
                </li>
              </ul>
            </div>

            {sessionId && (
              <p className="text-xs text-[var(--color-neutral-dark)] mb-6">
                Reference: {sessionId.slice(0, 20)}...
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-8 py-6 font-semibold text-white"
                style={{ background: "var(--color-accent-sage)" }}
              >
                <Link href="/owner-dashboard">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl px-8 py-6 font-semibold border-2"
              >
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          <p className="text-sm text-[var(--color-neutral-dark)] mt-8">
            Questions? Email us at{" "}
            <a href="mailto:hello@groupescapehouses.co.uk" className="text-[var(--color-accent-sage)] hover:underline">
              hello@groupescapehouses.co.uk
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
