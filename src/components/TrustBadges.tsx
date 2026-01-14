import { Shield, Clock, CreditCard, HeadphonesIcon } from "lucide-react";

interface TrustBadgesProps {
  variant?: "inline" | "grid" | "compact";
  className?: string;
}

const trustPoints = [
  {
    icon: Shield,
    title: "Secure Booking",
    description: "Book directly with verified property owners",
  },
  {
    icon: Clock,
    title: "24hr Response",
    description: "Quick enquiry responses guaranteed",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Pay deposit to secure, balance later",
  },
  {
    icon: HeadphonesIcon,
    title: "Dedicated Support",
    description: "Help throughout your booking journey",
  },
];

export function TrustBadges({ variant = "grid", className = "" }: TrustBadgesProps) {
  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 text-sm text-[var(--color-neutral-dark)] ${className}`}>
        <span className="flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[var(--color-accent-sage)]" />
          Verified Properties
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[var(--color-accent-sage)]" />
          24hr Response
        </span>
        <span className="flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-[var(--color-accent-sage)]" />
          Flexible Payment
        </span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap gap-6 ${className}`}>
        {trustPoints.slice(0, 3).map((point) => (
          <div key={point.title} className="flex items-center gap-2">
            <point.icon className="w-5 h-5 text-[var(--color-accent-sage)]" />
            <span className="text-sm font-medium">{point.title}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {trustPoints.map((point) => (
        <div key={point.title} className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center">
            <point.icon className="w-6 h-6 text-[var(--color-accent-sage)]" />
          </div>
          <h4 className="font-semibold text-sm mb-1">{point.title}</h4>
          <p className="text-xs text-[var(--color-neutral-dark)]">{point.description}</p>
        </div>
      ))}
    </div>
  );
}

export function BookingMessage({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-[var(--color-bg-primary)] rounded-xl p-4 ${className}`}>
      <p className="text-sm text-[var(--color-neutral-dark)] leading-relaxed">
        <strong className="text-[var(--color-text-primary)]">How booking works:</strong>{" "}
        Submit an enquiry to check availability. Pay a deposit to secure your dates, 
        with the balance due before arrival. Book directly with property owners for the best rates.
      </p>
    </div>
  );
}

export default TrustBadges;
