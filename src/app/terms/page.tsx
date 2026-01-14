import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Terms & Conditions", url: "/terms" }
          ]
        }}
      />
      <Header />
      
      <div className="max-w-[900px] mx-auto px-6 py-24">
        <h1 className="mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Website Terms of Use
        </h1>
        
        <div className="prose prose-lg max-w-none space-y-8" style={{ color: "var(--color-neutral-dark)" }}>
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              1. Our Service
            </h2>
            <p className="mb-4">
              Group Escape Houses is an advertising platform and information resource for luxury large group accommodation in the UK. We are not a travel agent, booking agent, or property management company.
            </p>
            <p className="mb-4">
              Our service consists of providing a platform where property owners can advertise their properties and guests can find and enquire about accommodation. We do not own, manage, or inspect the properties listed on our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              2. Bookings and Payments
            </h2>
            <p className="mb-4">
              All bookings, payments, and contractual agreements are handled directly between guests and property owners. Group Escape Houses is not a party to any rental agreement or booking contract.
            </p>
            <p className="mb-4">
              Property owners are responsible for setting their own pricing, availability, and booking terms. Guests should review and agree to the specific terms provided by the property owner before making any payments.
            </p>
            <p className="mb-4">
              For more information on bookings, please see our <Link href="/booking-terms" className="text-[var(--color-accent-sage)] underline">Booking Terms & Conditions</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              3. Accuracy of Information
            </h2>
            <p className="mb-4">
              While we strive to ensure the information on our website is accurate, property listings are provided and managed by the property owners. We do not guarantee the accuracy, completeness, or suitability of any listing.
            </p>
            <p className="mb-4">
              Guests are encouraged to verify all essential details (such as facilities, accessibility, and house rules) directly with the property owner during the enquiry process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              4. Liability
            </h2>
            <p className="mb-4">
              Group Escape Houses shall not be liable for any loss, damage, personal injury, or expense incurred as a result of:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Any booking made through our platform</li>
              <li>The condition or safety of any property listed</li>
              <li>Any inaccuracies in property listings</li>
              <li>Any disputes between guests and property owners</li>
              <li>The quality or delivery of any third-party experiences or services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              5. Intellectual Property
            </h2>
            <p className="mb-4">
              All content on this website, including text, images, logos, and design, is the property of Group Escape Houses or its licensors and is protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              6. Governing Law
            </h2>
            <p className="mb-4">
              These terms are governed by the laws of England and Wales. Any disputes arising from your use of this website will be subject to the exclusive jurisdiction of the English courts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              7. Contact Us
            </h2>
            <p className="mb-2">
              <strong>Group Escape Houses</strong><br />
              Office, 11a North Street<br />
              Brighton<br />
              BN41 1DH
            </p>
            <p>
              Email: <a href="mailto:hello@groupescapehouses.co.uk" className="text-[var(--color-accent-sage)] hover:underline">hello@groupescapehouses.co.uk</a>
            </p>
          </section>

          <section>
            <p className="text-sm italic" style={{ color: "var(--color-neutral-dark)" }}>
              Last updated: December 2025
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
