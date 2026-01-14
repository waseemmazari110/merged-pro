import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Privacy Policy", url: "/privacy" }
          ]
        }}
      />
      <Header />
      
      <div className="max-w-[900px] mx-auto px-6 py-24">
        <h1 className="mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Privacy Policy & GDPR
        </h1>
        
        <div className="prose prose-lg max-w-none space-y-8" style={{ color: "var(--color-neutral-dark)" }}>
          <section>
            <p className="text-lg mb-6">
              Group Escape Houses is committed to protecting your privacy and ensuring your personal data is handled securely and transparently. This policy explains how we collect, use, store, and protect your information in compliance with UK GDPR and the Data Protection Act 2018.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              1. Who We Are
            </h2>
            <p className="mb-4">
              Group Escape Houses operates as a data controller for the personal information we collect from you. Our registered office is:
            </p>
            <p className="mb-4">
              <strong>Group Escape Houses</strong><br />
              Office, 11a North Street<br />
              Brighton<br />
              BN41 1DH<br />
              Email: <a href="mailto:hello@groupescapehouses.co.uk" className="text-[var(--color-accent-sage)] hover:underline">hello@groupescapehouses.co.uk</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              2. What Information We Collect
            </h2>
            <p className="mb-4">
              We collect and process the following types of personal data:
            </p>
            
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
              Information you provide to us:
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name, email address, phone number</li>
              <li>Postal address</li>
              <li>Payment information (processed securely through our payment provider)</li>
              <li>Booking details including dates, group size, and preferences</li>
              <li>Correspondence and communications with us</li>
              <li>Dietary requirements or accessibility needs</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
              Information we collect automatically:
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and links clicked</li>
              <li>Time spent on pages</li>
              <li>Referring website</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              3. How We Use Your Information
            </h2>
            <p className="mb-4">
              We process your personal data for the following purposes:
            </p>
            
            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
              Contract Performance:
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Processing and managing your bookings</li>
              <li>Communicating about your reservation</li>
              <li>Providing customer support</li>
              <li>Processing payments and refunds</li>
              <li>Arranging add-on experiences</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
              Legitimate Interests:
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Improving our website and services</li>
              <li>Analysing customer behaviour and preferences</li>
              <li>Preventing fraud and ensuring security</li>
              <li>Sending service updates and important notices</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}>
              Consent:
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sending marketing emails about offers, new properties, and inspiration</li>
              <li>Using cookies for analytics and personalization (see Cookie Policy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              4. Legal Basis for Processing
            </h2>
            <p className="mb-4">
              Under UK GDPR, we process your data based on:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contract:</strong> Processing necessary to fulfil our booking agreement with you</li>
              <li><strong>Legitimate Interest:</strong> Processing necessary for our business operations, provided it doesn't override your rights</li>
              <li><strong>Consent:</strong> Processing you have explicitly agreed to, which you can withdraw at any time</li>
              <li><strong>Legal Obligation:</strong> Processing required by law, such as tax and accounting requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              5. Who We Share Your Data With
            </h2>
            <p className="mb-4">
              We may share your personal data with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Property Owners:</strong> To facilitate your enquiry and potential booking</li>
                <li><strong>Experience Providers:</strong> Third parties delivering add-on services where applicable</li>
                <li><strong>Payment Processors:</strong> Stripe (for property owner listing subscriptions)</li>
              <li><strong>Email Service Providers:</strong> For sending booking confirmations and communications</li>
              <li><strong>Analytics Providers:</strong> Google Analytics (anonymised data)</li>
              <li><strong>Legal Authorities:</strong> If required by law or to protect our rights</li>
            </ul>
            <p className="mt-4">
              We never sell your personal data to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              6. International Data Transfers
            </h2>
            <p className="mb-4">
              Some of our service providers are based outside the UK and EEA. Where data is transferred internationally, we ensure appropriate safeguards are in place, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Standard Contractual Clauses approved by the UK ICO</li>
              <li>Adequacy decisions recognising equivalent data protection standards</li>
              <li>Provider certifications ensuring GDPR-level protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              7. How Long We Keep Your Data
            </h2>
            <p className="mb-4">
              We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Booking Data:</strong> 7 years after your last booking (for tax and accounting purposes)</li>
              <li><strong>Marketing Data:</strong> Until you unsubscribe or withdraw consent</li>
              <li><strong>Website Analytics:</strong> 26 months (Google Analytics default)</li>
              <li><strong>Customer Support:</strong> 3 years after last contact</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              8. Your Rights Under GDPR
            </h2>
            <p className="mb-4">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data in certain circumstances</li>
              <li><strong>Right to Restriction:</strong> Request we limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or for marketing purposes</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time for processing based on consent</li>
              <li><strong>Right to Lodge a Complaint:</strong> Complain to the ICO if you believe we have breached data protection laws</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at <a href="mailto:hello@groupescapehouses.co.uk" className="text-[var(--color-accent-sage)] hover:underline">hello@groupescapehouses.co.uk</a>. We will respond within one month.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              9. Cookies
            </h2>
            <p className="mb-4">
              Our website uses cookies to improve your experience. Cookies are small text files stored on your device. We use:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Marketing Cookies:</strong> Track your activity for advertising purposes (with consent)</li>
            </ul>
            <p className="mt-4">
              You can manage your cookie preferences through our cookie banner or your browser settings. For more details, see our Cookie Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              10. Security
            </h2>
            <p className="mb-4">
              We implement appropriate technical and organisational measures to protect your personal data, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SSL encryption for data transmission</li>
              <li>Secure payment processing through PCI-DSS compliant providers</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and staff training</li>
              <li>Secure backup systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              11. Marketing Communications
            </h2>
            <p className="mb-4">
              With your consent, we will send you marketing emails about:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>New property launches</li>
              <li>Special offers and discounts</li>
              <li>Party planning tips and inspiration</li>
              <li>Seasonal promotions</li>
            </ul>
            <p className="mt-4">
              You can unsubscribe at any time by clicking the unsubscribe link in any email or contacting us directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              12. Children's Privacy
            </h2>
            <p className="mb-4">
              Our services are not directed at children under 18. We do not knowingly collect personal data from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              13. Changes to This Policy
            </h2>
            <p className="mb-4">
              We may update this privacy policy from time to time. We will notify you of significant changes by email or through a notice on our website. Please check this page regularly for updates.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              14. Contact Us
            </h2>
            <p className="mb-4">
              For questions about this privacy policy or to exercise your data rights, please contact:
            </p>
            <p className="mb-4">
              <strong>Data Protection Officer</strong><br />
              Group Escape Houses<br />
              Office, 11a North Street<br />
              Brighton<br />
              BN41 1DH<br />
              Email: <a href="mailto:hello@groupescapehouses.co.uk" className="text-[var(--color-accent-sage)] hover:underline">hello@groupescapehouses.co.uk</a>
            </p>
            <p className="mt-4">
              You also have the right to lodge a complaint with the Information Commissioner's Office (ICO):<br />
              Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-sage)] hover:underline">www.ico.org.uk</a><br />
              Phone: 0303 123 1113
            </p>
          </section>

          <section>
            <p className="text-sm italic" style={{ color: "var(--color-neutral-dark)" }}>
              Last updated: January 2025
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}