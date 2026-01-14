"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type ErrorTypes = Partial<Record<keyof typeof authClient.$ERROR_CODES, string>>;
const errorCodes = {
  USER_ALREADY_EXISTS: "This email is already registered",
} satisfies ErrorTypes;

const getErrorMessage = (code: string) => {
  if (code in errorCodes) {
    return errorCodes[code as keyof typeof errorCodes];
  }
  return "Registration failed. Please try again.";
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        name,
        password,
      });

      if (error?.code) {
        toast.error(getErrorMessage(error.code));
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      
      // Redirect to login with success message
      router.push("/login?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-md w-full space-y-8">
          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center">
            <h1
              className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Create Account
            </h1>
            <p className="text-lg text-[var(--color-neutral-dark)]">
              Join Group Escape Houses to manage bookings
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent-sage)] focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent-sage)] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent-sage)] focus:border-transparent"
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="off"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[var(--color-accent-sage)] focus:border-transparent"
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "var(--color-accent-sage)",
                }}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}