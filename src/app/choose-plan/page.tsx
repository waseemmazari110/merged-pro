"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2, ArrowLeft, CreditCard } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const plans = [
  {
    id: "bronze",
    name: "Bronze Listing",
    price: "£99.99",
    monthlyPrice: "£9.99",
    period: "/ year",
    description: "Everything you need to start receiving direct enquiries.",
    color: "#B87333",
    features: [
      "Full property listing page",
      "Unlimited direct enquiries",
      "iCal calendar sync",
      "Direct website link",
      "Standard SEO optimization"
    ]
  },
  {
    id: "silver",
    name: "Silver Listing",
    price: "£149.99",
    monthlyPrice: "£14.99",
    period: "/ year",
    description: "Enhanced visibility and social media promotion.",
    color: "#71717A",
    features: [
      "Everything in Bronze",
      "Professional page build & support",
      "Social media promotion (inc Late Deals)",
      "Enhanced search visibility",
      "Priority support"
    ]
  },
  {
    id: "gold",
    name: "Gold Listing",
    price: "£199.99",
    monthlyPrice: "£19.99",
    period: "/ year",
    description: "Maximum exposure across the entire platform.",
    color: "#C6A76D",
    features: [
      "Everything in Silver",
      "Themed blog feature",
      "3 x Holiday Focus page inclusion",
      "Homepage featured placement",
      "Specialist page (Weddings/Corporate/etc)"
    ]
  }
];

function ChoosePlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "bronze";
    const [selectedPlan, setSelectedPlan] = useState(initialPlan);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/owner-login?callbackURL=/choose-plan");
    }
  }, [session, isPending, router]);

    const handleProceed = async () => {
      setLoading(true);
      setError(null);
      try {
        const propertyId = searchParams.get("propertyId");
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            planId: selectedPlan,
            propertyId: propertyId 
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create checkout session");
        }

        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to proceed to payment");
      } finally {
        setLoading(false);
      }
    };

  if (isPending) return <div className="flex justify-center py-40"><Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent-sage)]" /></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <button 
          onClick={() => router.push("/owner-sign-up")}
          className="inline-flex items-center text-[var(--color-accent-sage)] hover:underline mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to registration
        </button>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Choose Your Listing Plan</h2>
          <p className="text-xl text-[var(--color-neutral-dark)]">Select the subscription that best suits your property. Prices exclusive of VAT.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
              <div 
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`cursor-pointer rounded-3xl p-8 border-2 transition-all relative flex flex-col ${
                  selectedPlan === plan.id 
                    ? "bg-white shadow-xl scale-105 z-10 border-[var(--color-accent-sage)]" 
                    : "border-gray-100 bg-gray-50/50 opacity-80"
                }`}
              >
                {selectedPlan === plan.id && (
                  <div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-accent-sage)] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    Selected
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-[var(--color-neutral-dark)] text-sm">{plan.description}</p>
                </div>
                
                <div className="mb-8">
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-[var(--color-neutral-dark)] font-medium">+ VAT {plan.period}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 italic">Approx. £{parseInt(plan.price.replace('£', '')) * 1.2} inc. VAT</div>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check 
                        className={`w-5 h-5 flex-shrink-0 ${selectedPlan === plan.id ? "text-[var(--color-accent-sage)]" : "text-gray-400"}`}
                      />
                      <span className={`text-sm ${selectedPlan === plan.id ? "font-medium" : ""}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
    
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={handleProceed}
              disabled={loading}
              size="lg"
              className="rounded-2xl px-12 py-7 text-xl font-bold text-white shadow-xl hover:shadow-2xl transition-all bg-[var(--color-accent-sage)]"
            >
            {loading ? <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Preparing Checkout...</> : <><ArrowRight className="w-6 h-6 mr-2" /> Proceed to Payment</>}
          </Button>
          <p className="text-sm text-[var(--color-neutral-dark)] max-w-md text-center">
            You will be redirected to a secure Stripe payment page. Enter card details and confirm. VAT included.
          </p>
          <div className="flex gap-4 items-center mt-2 opacity-50 grayscale">
            <CreditCard className="w-6 h-6" />
            <div className="text-xs font-bold uppercase tracking-widest">Secure Stripe Payment</div>
          </div>
        </div>
    </div>
  );
}

export default function ChoosePlan() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />
      <main className="pt-32 pb-20 px-6">
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" /></div>}>
          <ChoosePlanContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
