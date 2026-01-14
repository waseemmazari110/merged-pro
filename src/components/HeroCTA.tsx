import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrustBadges } from "@/components/TrustBadges";
import { Phone, Mail, MessageCircle } from "lucide-react";

interface HeroCTAProps {
  title: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  showTrustBadges?: boolean;
  variant?: "default" | "minimal" | "centered";
  className?: string;
}

export function HeroCTA({
  title,
  subtitle,
  primaryButtonText = "Check Availability",
  primaryButtonHref = "/contact",
  secondaryButtonText = "Browse Properties",
  secondaryButtonHref = "/properties",
  showTrustBadges = true,
  variant = "default",
  className = "",
}: HeroCTAProps) {
  if (variant === "minimal") {
    return (
      <div className={`flex flex-wrap items-center gap-4 ${className}`}>
        <Button
          asChild
          size="lg"
          className="rounded-2xl px-8 py-6 font-medium"
          style={{ background: "var(--color-accent-sage)", color: "white" }}
        >
          <Link href={primaryButtonHref}>{primaryButtonText}</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-2xl px-8 py-6 font-medium"
        >
          <Link href={secondaryButtonHref}>{secondaryButtonText}</Link>
        </Button>
      </div>
    );
  }

  if (variant === "centered") {
    return (
      <div className={`text-center ${className}`}>
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg text-[var(--color-neutral-dark)] mb-6 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Button
            asChild
            size="lg"
            className="rounded-2xl px-8 py-6 font-medium"
            style={{ background: "var(--color-accent-sage)", color: "white" }}
          >
            <Link href={primaryButtonHref}>{primaryButtonText}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-2xl px-8 py-6 font-medium"
          >
            <Link href={secondaryButtonHref}>{secondaryButtonText}</Link>
          </Button>
        </div>
        {showTrustBadges && <TrustBadges variant="compact" />}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg ${className}`}>
      <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-[var(--color-neutral-dark)] mb-6">
          {subtitle}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          asChild
          size="lg"
          className="rounded-xl px-6 py-5 font-medium flex-1"
          style={{ background: "var(--color-accent-sage)", color: "white" }}
        >
          <Link href={primaryButtonHref}>{primaryButtonText}</Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="rounded-xl px-6 py-5 font-medium flex-1"
        >
          <Link href={secondaryButtonHref}>{secondaryButtonText}</Link>
        </Button>
      </div>
      {showTrustBadges && <TrustBadges variant="compact" />}
    </div>
  );
}

export function StickyEnquiryCTA({ propertyTitle }: { propertyTitle?: string }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-2xl p-4 z-40 border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--color-neutral-dark)] truncate">
            {propertyTitle || "Large Group Accommodation"}
          </p>
          <p className="text-sm font-medium">Enquire for best rates</p>
        </div>
        <Button
          asChild
          className="rounded-xl px-6 py-5 font-medium whitespace-nowrap"
          style={{ background: "var(--color-accent-sage)", color: "white" }}
        >
          <Link href="/contact">Enquire Now</Link>
        </Button>
      </div>
    </div>
  );
}

export function ContactOptions({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center gap-4 text-sm ${className}`}>
      <a
        href="tel:+441onal"
        className="flex items-center gap-2 text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
      >
        <Phone className="w-4 h-4" />
        Call Us
      </a>
      <a
        href="mailto:hello@groupescapehouses.co.uk"
        className="flex items-center gap-2 text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
      >
        <Mail className="w-4 h-4" />
        Email
      </a>
      <Link
        href="/contact"
        className="flex items-center gap-2 text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Enquiry Form
      </Link>
    </div>
  );
}

export default HeroCTA;
