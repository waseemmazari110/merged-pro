"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          redirectTo: "/account/reset-password",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to send reset email");
        setIsLoading(false);
        return;
      }

      setIsSent(true);
      toast.success("Reset email sent!");
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error("An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg-primary)] pt-32 pb-20 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center">
          <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-8">
            <div className="mb-8">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm text-gray-500 hover:text-[var(--color-accent-sage)] transition-colors mb-6"
                >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                  Reset your password
                </h1>
                <p className="text-gray-600 mt-2">
                  Enter your email and we’ll send you a secure login link
                </p>
              </div>

              {isSent ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                  <h3 className="text-green-800 font-semibold mb-2">Email Sent!</h3>
                  <p className="text-green-700 text-sm">
                    Check your inbox for a link to reset your password. If you don't see it, check your spam folder.
                  </p>
                  <Button
                    onClick={() => setIsSent(false)}
                    variant="outline"
                    className="mt-6 border-green-300 text-green-800 hover:bg-green-100"
                  >
                    Try another email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl border-gray-300 focus:ring-[var(--color-accent-sage)] h-12"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl py-6 text-lg font-semibold bg-[var(--color-accent-sage)] hover:bg-[#4a7c6d] text-white transition-all shadow-md hover:shadow-lg"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    Send login link
                  </Button>
                </form>
              )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
