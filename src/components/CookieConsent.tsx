"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-2 md:p-6 animate-fade-up">
      <div className="max-w-[1200px] mx-auto">
        <div
          className="rounded-xl md:rounded-2xl shadow-2xl p-4 md:p-8 relative"
          style={{ 
            background: "var(--color-text-primary)",
            color: "var(--color-bg-primary)"
          }}
        >
          <button
            onClick={declineCookies}
            className="absolute top-3 right-3 w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center justify-between pr-6 md:pr-8">
            <div className="flex-1">
              <h3 
                className="text-lg md:text-2xl mb-1 md:mb-2 font-semibold"
                style={{ 
                  fontFamily: "var(--font-display)",
                  color: "var(--color-accent-gold)"
                }}
              >
                We Use Cookies
              </h3>
              <p className="text-xs md:text-base text-[var(--color-bg-secondary)] leading-tight md:leading-relaxed">
                We use cookies to enhance your browsing experience, analyse site traffic, and provide personalised content. By clicking "Accept", you consent to our use of cookies.{" "}
                <Link 
                  href="/privacy" 
                  className="underline hover:text-[var(--color-accent-sage)] transition-colors"
                >
                  Read our Privacy Policy
                </Link>
              </p>
            </div>

            <div className="flex flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
              <Button
                onClick={declineCookies}
                variant="outline"
                className="flex-1 md:flex-none rounded-lg md:rounded-xl px-4 md:px-6 py-1.5 md:py-3 text-xs md:text-sm font-medium border-2 transition-all hover:bg-white/10"
                style={{
                  borderColor: "var(--color-accent-sage)",
                  color: "var(--color-bg-primary)"
                }}
              >
                Decline
              </Button>
              <Button
                onClick={acceptCookies}
                className="flex-1 md:flex-none rounded-lg md:rounded-xl px-4 md:px-8 py-1.5 md:py-3 text-xs md:text-sm font-semibold transition-all hover:shadow-lg"
                style={{
                  background: "var(--color-accent-sage)",
                  color: "white"
                }}
              >
                Accept Cookies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}