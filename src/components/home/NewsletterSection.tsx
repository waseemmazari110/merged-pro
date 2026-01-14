"use client";

import { useState, useRef, useEffect } from "react";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [honeypot, setHoneypot] = useState("");
  const [userInteraction, setUserInteraction] = useState({ clicks: 0, keystrokes: 0 });
  const [formLoadTime] = useState<number>(Date.now());
  const newsletterFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const trackClick = () => setUserInteraction(prev => ({ ...prev, clicks: prev.clicks + 1 }));
    const trackKeypress = () => setUserInteraction(prev => ({ ...prev, keystrokes: prev.keystrokes + 1 }));

    const formElement = newsletterFormRef.current;
    if (formElement) {
      formElement.addEventListener('click', trackClick, { passive: true });
      formElement.addEventListener('keydown', trackKeypress, { passive: true });
    }

    return () => {
      if (formElement) {
        formElement.removeEventListener('click', trackClick);
        formElement.removeEventListener('keydown', trackKeypress);
      }
    };
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitStatus("idle");
    
    try {
      const challenge = Math.floor(Date.now() / 10000).toString();
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, honeypot, timestamp: formLoadTime.toString(), challenge, userInteraction })
      });
      if (!response.ok) throw new Error('Failed to subscribe');
      setSubmitStatus("success");
      setEmail("");
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-[var(--color-bg-primary)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-r from-[var(--color-accent-sage)] to-[var(--color-accent-gold)] rounded-2xl md:rounded-3xl p-8 md:p-12 text-center">
            <PartyPopper className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 text-[var(--color-text-primary)]" />
            <h2 className="mb-3 md:mb-4 text-3xl md:text-4xl text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Get Group Travel Inspiration
            </h2>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-4 text-[var(--color-text-primary)]">
              Subscribe for exclusive deals, new properties, and group planning tips
            </p>

            <form ref={newsletterFormRef} onSubmit={handleEmailSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 md:gap-4 px-4">
              <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} style={{ position: 'absolute', left: '-9999px' }} tabIndex={-1} autoComplete="off" />
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <Input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="flex-1 h-14 rounded-2xl border-2 border-[var(--color-text-primary)]/30 bg-white/90 text-[var(--color-text-primary)] placeholder:text-[var(--color-neutral-dark)] focus:bg-white"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !email}
                  className="h-14 px-8 rounded-2xl font-semibold transition-all hover:scale-[1.05] bg-[var(--color-text-primary)] text-white min-h-[48px]"
                >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            {submitStatus === "success" && <p className="mt-4 text-[var(--color-text-primary)] font-medium">Thanks for subscribing! Check your inbox.</p>}
            {submitStatus === "error" && <p className="mt-4 text-[var(--color-text-primary)] font-medium">Something went wrong. Please try again.</p>}
        </div>
      </div>
    </section>
  );
}
