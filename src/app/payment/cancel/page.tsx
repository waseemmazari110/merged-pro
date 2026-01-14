import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-amber-600" />
            </div>

            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Payment not completed
            </h1>

            <p className="text-lg text-[var(--color-neutral-dark)] mb-8">
              Please retry or contact support. No charges have been made to your account.
            </p>

            <div className="bg-[var(--color-bg-primary)] rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">Need help deciding?</h3>
              <p className="text-[var(--color-neutral-dark)] text-sm leading-relaxed">
                If you have any questions about our listing plans or need assistance choosing the right option for your property, our team is here to help.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-2xl px-8 py-6 font-semibold text-white"
                style={{ background: "var(--color-accent-sage)" }}
              >
                <Link href="/choose-plan">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Plans
                </Link>
              </Button>
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-2xl px-8 py-6 font-semibold border-2"
              >
                <Link href="/contact">
                  Contact Us
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
