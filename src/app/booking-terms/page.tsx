"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function BookingTermsPage() {
  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Booking Terms", url: "/booking-terms" }
          ]
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <nav className="flex gap-2 text-sm mb-6 text-[var(--color-neutral-dark)]">
            <Link href="/" className="hover:text-[var(--color-accent-sage)] transition-colors">Home</Link>
            <span>/</span>
            <span>Booking Terms & Conditions</span>
          </nav>
          
            <h1 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Booking Terms & Conditions
            </h1>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-3xl leading-relaxed">
              Group Escape Houses is an advertising platform. Bookings, payments and contracts are handled directly between guests and property owners.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-white">
          <div className="max-w-[900px] mx-auto px-6">
            <div className="prose prose-lg max-w-none">
              
              {/* Advertising Platform */}
              <div className="mb-12">
                <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  1. Advertising Platform
                </h2>
                <div className="space-y-4 text-[var(--color-neutral-dark)]">
                  <p>
                    Group Escape Houses provides an advertising service for property owners to list their group accommodation. We are not a booking agent, travel agent or property management company.
                  </p>
                  <p>
                    When you submit an enquiry through our platform, your details are sent directly to the property owner. All subsequent communications, booking confirmations, payment arrangements and contractual agreements are made directly between you and the property owner.
                  </p>
                  <p>
                    Group Escape Houses does not handle booking payments, deposits or security deposits. We do not set the final rental price or determine availability.
                  </p>
                </div>
              </div>

              {/* Bookings & Payment */}
              <div className="mb-12">
                <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  2. Bookings & Payment
                </h2>
                <div className="space-y-4 text-[var(--color-neutral-dark)]">
                  <p>
                    Each property owner has their own specific booking terms and payment requirements. You should clarify these directly with the owner before confirming your stay.
                  </p>
                  <p>
                    <strong>Deposits and Balances:</strong> Payments, deposits and booking terms are agreed and handled directly with the property owner. Most owners will require a deposit to secure your dates, followed by a final balance payment.
                  </p>
                  <p>
                    <strong>Security Deposits:</strong> Most owners require a refundable security deposit to cover potential damage. These are managed and held directly by the property owner, not by Group Escape Houses.
                  </p>
                </div>
              </div>

              {/* Cancellations */}
              <div className="mb-12">
                <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  3. Cancellation Policy
                </h2>
                <div className="space-y-4 text-[var(--color-neutral-dark)]">
                  <p>
                    Cancellation policies are set by individual property owners and will be detailed in their own booking terms. We strongly recommend purchasing group travel insurance to protect against unforeseen circumstances.
                  </p>
                </div>
              </div>

              {/* Property Information */}
              <div className="mb-12">
                <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  4. Property Information
                </h2>
                <div className="space-y-4 text-[var(--color-neutral-dark)]">
                  <p>
                    While we strive to ensure that property listings are accurate, owners are responsible for the information provided in their listings. We recommend confirming all essential facilities and house rules directly with the owner during the enquiry process.
                  </p>
                </div>
              </div>

              {/* Damage & Liability */}
              <div className="mb-12">
                <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  5. Damage & Liability
                </h2>
                <div className="space-y-4 text-[var(--color-neutral-dark)]">
                  <p>
                    Property owners are responsible for the safety and maintenance of their properties. Group Escape Houses is not liable for personal injury, loss or damage to guests' belongings during their stay.
                  </p>
                  <p>
                    Guests are responsible for any damage caused during their stay, which will be handled according to the owner's specific terms and security deposit policy.
                  </p>
                </div>
              </div>

              {/* Facilities & Amenities */}
              <div className="mb-12">
                <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  6. Facilities & Amenities
                </h2>
                <div className="space-y-4 text-[var(--color-neutral-dark)]">
                  <p>
                    Property owners strive to ensure all advertised facilities are available during your stay. We recommend confirming the availability of specific amenities such as hot tubs, pools or games rooms directly with the owner when you enquire.
                  </p>
                </div>
              </div>

              {/* Force Majeure */}
              <div className="mb-12">
                <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  7. Force Majeure
                </h2>
                <div className="space-y-4 text-[var(--color-neutral-dark)]">
                  <p>
                    Group Escape Houses shall not be liable for any failure to perform its obligations due to circumstances beyond our reasonable control. Any issues regarding booking cancellations due to force majeure events must be resolved directly with the property owner.
                  </p>
                </div>
              </div>

                {/* Privacy & Data */}
                <div className="mb-12">
                  <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    8. Privacy & Data Protection
                  </h2>
                  <div className="space-y-4 text-[var(--color-neutral-dark)]">
                    <p>
                      We collect and process personal data in accordance with UK GDPR regulations. When you submit an enquiry, your information is shared with the property owner to facilitate your booking request.
                    </p>
                    <p>
                      For full details, please refer to our <Link href="/privacy" className="text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">Privacy Policy</Link>.
                    </p>
                  </div>
                </div>

                {/* Governing Law */}
                <div className="mb-12">
                  <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    9. Governing Law
                  </h2>
                <div className="space-y-4 text-[var(--color-neutral-dark)]">
                  <p>
                    These terms and conditions relate to your use of the Group Escape Houses website and advertising platform. Any disputes regarding your use of this platform will be subject to the exclusive jurisdiction of the courts of England and Wales.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-[var(--color-bg-primary)] rounded-2xl p-8 mt-12">
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Questions?
                </h3>
                <p className="text-[var(--color-neutral-dark)] mb-4">
                  If you have any questions about our platform or how we work, please don't hesitate to get in touch.
                </p>
                <p className="text-[var(--color-neutral-dark)]">
                  <strong>Email:</strong> <a href="mailto:hello@groupescapehouses.co.uk" className="text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors">hello@groupescapehouses.co.uk</a><br />
                  <strong>Office:</strong> 11a North Street, Brighton BN41 1DH
                </p>
              </div>

            <div className="mt-8 text-sm text-[var(--color-neutral-dark)]">
              <p><em>Last updated: January 2025</em></p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}