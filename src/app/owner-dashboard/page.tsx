"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  MessageSquare, 
  Eye, 
  Plus, 
  Calendar, 
  Settings, 
  LogOut,
  CreditCard,
  ChevronRight,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Check,
  ArrowRight
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

const PLANS = [
  {
    id: "bronze",
    name: "Bronze Listing",
    price: "£99.99",
    monthlyPrice: "£9.99",
    period: "/ year",
    description: "Everything you need to start receiving direct enquiries.",
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
    features: [
      "Everything in Silver",
      "Themed blog feature",
      "3 x Holiday Focus page inclusion",
      "Homepage featured placement",
      "Specialist page (Weddings/Corporate/etc)"
    ]
  }
];

export default function OwnerDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("bronze");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/owner-login");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProperties();
      // Set initial selected plan from user profile if available
      const userPlan = (session.user as any).planId;
      if (userPlan) {
        setSelectedPlan(userPlan);
      }
    }
  }, [session]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`/api/properties?ownerId=${session?.user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

    const handleManageBilling = async (propertyId: number) => {
      setLoading(true);
      try {
        const response = await fetch("/api/billing-portal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create portal session");
        }

        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to open billing portal");
      } finally {
        setLoading(false);
      }
    };

    if (isPending) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent-sage)]" /></div>;
  if (!session) return null;

  const user = session.user as any;
  const pendingProperty = properties.find(p => p.status !== 'Active');

  // Show payment banner if there's a pending property OR if the user has a pending plan without properties
  const showPaymentBanner = !!pendingProperty || (user.paymentStatus === 'pending' && user.planId && properties.length === 0);

  const handlePayNow = async (propertyId?: number, planId?: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          planId: planId || user.planId || 'bronze',
          propertyId: propertyId?.toString() || ""
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
      toast.error(err instanceof Error ? err.message : "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Welcome, {user.name.split(' ')[0]}
                </h1>
                <p className="text-[var(--color-neutral-dark)]">Manage your property and track performance from your dashboard.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="rounded-xl border-gray-200" onClick={handleLogout} disabled={loading}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
                <Button 
                  onClick={() => router.push("/admin/properties/new")}
                  className="rounded-xl bg-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Listing
                </Button>
              </div>
            </div>

            {/* Payment & Plan Section */}
            {showPaymentBanner && (
              <div className="mb-12">
                {(!pendingProperty || !pendingProperty.plan) ? (
                  <div className="bg-white rounded-3xl border border-[var(--color-accent-sage)] shadow-xl overflow-hidden">
                      <div className="bg-[var(--color-accent-sage)] p-6 text-white text-center">
                        <h2 className="text-2xl font-bold mb-2">
                          Choose Your Membership Plan
                        </h2>
                        <p className="opacity-90 text-sm">
                          Select the best plan to activate your account and start listing properties.
                        </p>
                      </div>
                      <div className="p-8">
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                          {PLANS.map((plan) => (
                            <div 
                              key={plan.id}
                              onClick={() => setSelectedPlan(plan.id)}
                              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative flex flex-col ${
                                selectedPlan === plan.id 
                                  ? "bg-[var(--color-bg-secondary)] border-[var(--color-accent-sage)] shadow-md scale-[1.02]" 
                                  : "border-gray-100 bg-gray-50/50 hover:bg-gray-100/50"
                              }`}
                            >
                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                  <h3 className="font-bold text-lg">{plan.name}</h3>
                                  {selectedPlan === plan.id && <div className="w-5 h-5 bg-[var(--color-accent-sage)] rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                                </div>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-2xl font-bold">{plan.price}</span>
                                  <span className="text-xs text-[var(--color-neutral-dark)]">+ VAT {plan.period}</span>
                                </div>
                              </div>
                              <ul className="space-y-2 mb-4 flex-grow">
                                {plan.features.map((feature, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs">
                                    <Check className="w-3 h-3 mt-0.5 text-[var(--color-accent-sage)] flex-shrink-0" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-col items-center gap-4">
                          <Button 
                            onClick={() => handlePayNow(pendingProperty?.id, selectedPlan)}
                            disabled={loading}
                            size="lg"
                            className="rounded-xl px-12 py-6 text-lg font-bold text-white bg-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)]/90 shadow-lg"
                          >
                            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <><CreditCard className="w-5 h-5 mr-2" /> Pay Now & Activate</>}
                          </Button>
                          <p className="text-xs text-[var(--color-neutral-dark)]">Secure payment via Stripe. VAT will be added at checkout.</p>
                        </div>
                      </div>
                    <div className="p-8">
                      {!pendingProperty && user.planId ? (
                        <div className="flex flex-col items-center py-4">
                          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-8 w-full max-w-lg text-center">
                            <h3 className="text-2xl font-bold mb-2">{user.planId.charAt(0).toUpperCase() + user.planId.slice(1)} Listing</h3>
                            <div className="flex items-center justify-center gap-1 mb-4">
                              <span className="text-3xl font-bold">{PLANS.find(p => p.id === user.planId)?.price || '£99.99'}</span>
                              <span className="text-sm text-[var(--color-neutral-dark)]">+ VAT / year</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">or {PLANS.find(p => p.id === user.planId)?.monthlyPrice || '£9.99'} / month</p>
                            <ul className="text-left space-y-2 mb-0 inline-block">
                              {PLANS.find(p => p.id === user.planId)?.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <Check className="w-4 h-4 mt-0.5 text-[var(--color-accent-sage)] flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button 
                            onClick={() => handlePayNow(undefined, user.planId)}
                            disabled={loading}
                            size="lg"
                            className="rounded-xl px-12 py-6 text-lg font-bold text-white bg-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)]/90 shadow-lg"
                          >
                            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <><CreditCard className="w-5 h-5 mr-2" /> Pay Now & Activate</>}
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="grid md:grid-cols-3 gap-6 mb-8">
                            {PLANS.map((plan) => (
                              <div 
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`cursor-pointer rounded-2xl p-6 border-2 transition-all relative flex flex-col ${
                                  selectedPlan === plan.id 
                                    ? "bg-[var(--color-bg-secondary)] border-[var(--color-accent-sage)] shadow-md scale-[1.02]" 
                                    : "border-gray-100 bg-gray-50/50 hover:bg-gray-100/50"
                                }`}
                              >
                                <div className="mb-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-lg">{plan.name}</h3>
                                    {selectedPlan === plan.id && <div className="w-5 h-5 bg-[var(--color-accent-sage)] rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                                  </div>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold">{plan.price}</span>
                                    <span className="text-xs text-[var(--color-neutral-dark)]">+ VAT {plan.period}</span>
                                  </div>
                                </div>
                                <ul className="space-y-2 mb-4 flex-grow">
                                  {plan.features.slice(0, 4).map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs">
                                      <Check className="w-3 h-3 mt-0.5 text-[var(--color-accent-sage)] flex-shrink-0" />
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          <div className="flex flex-col items-center gap-4">
                            <Button 
                              onClick={() => handlePayNow(pendingProperty?.id, selectedPlan)}
                              disabled={loading}
                              size="lg"
                              className="rounded-xl px-12 py-6 text-lg font-bold text-white bg-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)]/90 shadow-lg"
                            >
                              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <><ArrowRight className="w-5 h-5 mr-2" /> Proceed to Stripe</>}
                            </Button>
                            <p className="text-xs text-[var(--color-neutral-dark)]">Secure payment via Stripe. VAT will be added at checkout.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Listing Status: Payment Pending</h3>
                        <p className="text-sm text-amber-700">Complete your {pendingProperty.plan} payment to activate your property listing.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button 
                        variant="outline"
                        className="rounded-xl border-amber-200 text-amber-700"
                        onClick={() => router.push(`/choose-plan?propertyId=${pendingProperty.id}`)}
                      >
                        Change Plan
                      </Button>
                      <Button 
                        className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-8 shadow-md"
                        onClick={() => handlePayNow(pendingProperty.id, pendingProperty.plan.toLowerCase())}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pay Now & Activate"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Properties */}
            <div className="lg:col-span-2 space-y-8">
              {propertiesLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" /></div>
              ) : properties.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-300 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No properties yet</h3>
                  <p className="text-[var(--color-neutral-dark)] mb-6">Start by adding your first property listing.</p>
                  <Button 
                    onClick={() => router.push("/admin/properties/new")}
                    className="bg-[var(--color-accent-sage)] text-white rounded-xl"
                  >
                    Add Your First Property
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="font-bold text-2xl">Your Properties</h3>
                  {properties.map((property) => (
                    <div key={property.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-6 flex flex-col md:flex-row gap-6">
                        <div className="relative w-full md:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0">
                          <Image src={property.heroImage} alt={property.title} fill className="object-cover" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-xl">{property.title}</h4>
                              <p className="text-sm text-[var(--color-neutral-dark)]">{property.location}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              property.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {property.status || 'Pending'}
                            </div>
                          </div>
                            <div className="flex flex-wrap gap-4 text-sm text-[var(--color-neutral-dark)] mt-4">
                              <div className="flex items-center gap-1">
                                <CreditCard className="w-4 h-4" />
                                Plan: {property.plan || 'Not Selected'}
                                {property.nextPaymentDate && (
                                  <span className="ml-2 text-xs">
                                    (Next: {new Date(property.nextPaymentDate).toLocaleDateString()})
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                0 Views
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                0 Enquiries
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 px-6 flex justify-between items-center">
                          <div className="text-sm">
                            {property.status !== 'Active' ? (
                              <span className="text-amber-600 font-medium flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                Payment required to activate listing
                              </span>
                            ) : (
                              <div className="flex items-center gap-4">
                                <span className="text-green-600 font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Listing is live and searchable
                                </span>
                                {property.stripeCustomerId && (
                                  <button 
                                    onClick={() => handleManageBilling(property.id)}
                                    className="text-xs text-[var(--color-accent-sage)] hover:underline flex items-center gap-1"
                                    disabled={loading}
                                  >
                                    <Settings className="w-3 h-3" />
                                    Manage Billing
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-lg" asChild>
                              <Link href={`/admin/properties/${property.id}/edit`}>Edit</Link>
                            </Button>
                            {property.status !== 'Active' ? (
                              <Button 
                                size="sm" 
                                className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                                onClick={() => {
                                  if (property.plan) {
                                    handlePayNow(property.id, property.plan.toLowerCase());
                                  } else {
                                    router.push(`/choose-plan?propertyId=${property.id}`);
                                  }
                                }}
                                disabled={loading}
                              >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pay & Activate"}
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="rounded-lg border-[var(--color-accent-sage)] text-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)] hover:text-white"
                                onClick={() => handleManageBilling(property.id)}
                                disabled={loading}
                              >
                                Upgrade Plan
                              </Button>
                            )}
                          </div>
                        </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                {[
                  { label: "Total Views", value: "0", icon: Eye, color: "blue" },
                  { label: "Total Enquiries", value: "0", icon: MessageSquare, color: "green" },
                  { label: "Active Listings", value: properties.filter(p => p.status === 'Active').length.toString(), icon: CheckCircle2, color: "purple" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-[var(--color-neutral-dark)]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Billing & Account */}
            <div className="space-y-8">
              {/* Account Summary */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-xl mb-6">Account Summary</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-[var(--color-neutral-dark)] mb-1">Status</div>
                    <div className={`font-bold ${user.paymentStatus === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                      {user.paymentStatus === 'active' ? 'Active Subscription' : 'Payment Pending'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-[var(--color-neutral-dark)] mb-1">Email</div>
                    <div className="font-medium truncate">{user.email}</div>
                  </div>
                </div>
                  <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                    <Button variant="outline" className="w-full rounded-xl border-gray-200" onClick={() => toast.info("Settings coming soon")}>
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                    {user.paymentStatus === 'pending' ? (
                      <Button 
                        onClick={() => handlePayNow(pendingProperty?.id, user.planId)} 
                        className="w-full rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-md"
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <><CreditCard className="w-4 h-4 mr-2" /> Pay Now & Activate</>}
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full rounded-xl border-gray-200" 
                        disabled={loading || properties.length === 0}
                        onClick={() => properties[0] && handleManageBilling(properties[0].id)}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Manage Billing
                      </Button>
                    )}
                  </div>

              </div>

              {/* Property Support */}
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-xl mb-4">Property Support</h3>
                <p className="text-sm text-[var(--color-neutral-dark)] mb-6">Need help with your listing or account? Our expert team is on hand to assist.</p>
                <div className="space-y-2">
                  <p className="text-sm font-bold">Email us:</p>
                  <a href="mailto:hello@groupescapehouses.co.uk" className="text-[var(--color-accent-sage)] hover:underline">
                    hello@groupescapehouses.co.uk
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
