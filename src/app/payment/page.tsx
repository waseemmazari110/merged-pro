"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { PLANS, PlanId } from "@/lib/plans";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPlanId = searchParams.get("plan") as PlanId | null;
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(initialPlanId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialPlanId && !selectedPlanId) {
      setSelectedPlanId(initialPlanId);
    }
  }, [initialPlanId]);

  const handleCheckout = async (planId: PlanId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/owner-sign-up?redirect=/payment?plan=${planId}`);
          return;
        }
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Activate Your Account
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Choose your membership level and start listing your properties today.
            </p>
          </div>

          {error && (
            <div className="max-w-[600px] mx-auto mb-10 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-3">
              <span className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center font-bold">!</span>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(Object.values(PLANS) as (typeof PLANS[PlanId])[]).map((plan) => (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-[2rem] p-8 shadow-xl border-2 transition-all duration-300 flex flex-col ${
                  selectedPlanId === plan.id 
                    ? "border-[var(--color-accent-sage)] scale-[1.02] ring-4 ring-[var(--color-accent-sage)] ring-opacity-10" 
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                {selectedPlanId === plan.id && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-accent-sage)] text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
                    Selected Plan
                  </div>
                )}

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    {plan.name}
                  </h2>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-[var(--color-text-primary)]">
                      £{plan.price}
                    </span>
                    <span className="text-[var(--color-neutral-dark)] text-lg">+ VAT / year</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-1 text-[var(--color-accent-sage)]" />
                      <span className="text-[var(--color-neutral-dark)] text-lg leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCheckout(plan.id as PlanId)}
                  disabled={loading}
                  size="lg"
                  className="w-full rounded-2xl px-8 py-7 text-xl font-bold text-white transition-all hover:scale-[1.02] shadow-lg disabled:opacity-50"
                  style={{ background: "var(--color-accent-sage)" }}
                >
                  {loading && selectedPlanId === plan.id ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay Now & Activate"
                  )}
                </Button>

                <p className="text-center text-xs text-[var(--color-neutral-dark)] mt-4 opacity-60">
                  Secure payment via Stripe
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <p className="text-[var(--color-neutral-dark)] mb-4">
              Need help choosing? <a href="/contact" className="text-[var(--color-accent-sage)] font-semibold hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
