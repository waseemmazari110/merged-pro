"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

function OwnerSignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (!agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);

    try {
      // Sign out if already logged in
      const sessionRes = await authClient.getSession();
      if (sessionRes?.data) {
        await authClient.signOut();
      }

      // Register using better-auth
      const { data, error } = await authClient.signUp.email({
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
        return;
      }

      // Complete owner profile with additional fields
      if (data?.user) {
        const completeResponse = await fetch("/api/owner/complete-signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: data.user.id,
            phone: formData.phone,
            companyName: formData.companyName,
            role: "owner",
          }),
        });

        if (!completeResponse.ok) {
          console.error("Failed to complete owner profile");
          // Still allow login even if profile completion fails
        }

        // Send verification email
        try {
          const verificationRes = await fetch('/api/auth/send-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email }),
          });
          
          if (verificationRes.ok) {
            console.log('✅ Verification email sent to owner');
          }
        } catch (verificationError) {
          console.error('Failed to send verification email:', verificationError);
          // Don't block registration if email fails
        }
      }

      toast.success("Owner account created successfully! Please check your email for verification.");
      
      // Redirect to owner login page
      router.push("/owner/login?registered=true");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#6b9080] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Become a Property Owner
          </h1>
          <p className="text-lg text-gray-600">
            List your properties and reach thousands of potential guests
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Smith"
                className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#6b9080] transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#6b9080] transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+44 7700 900000"
                className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#6b9080] transition-colors"
              />
            </div>

            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Company Name (Optional)
              </label>
              <Input
                id="companyName"
                name="companyName"
                type="text"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Your Property Management Company"
                className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#6b9080] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#6b9080] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password *
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#6b9080] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-[#6b9080] hover:underline">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#6b9080] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#6b9080] hover:bg-[#5a7a6a] text-white rounded-xl font-medium text-base transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Owner Account"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/owner/login"
                className="text-[#6b9080] hover:underline font-medium"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-2">🏠</div>
            <h3 className="font-semibold text-gray-900 mb-1">List Multiple Properties</h3>
            <p className="text-sm text-gray-600">Manage all your properties from one account</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-1">Real-time Analytics</h3>
            <p className="text-sm text-gray-600">Track bookings and revenue instantly</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-gray-900 mb-1">Competitive Commission</h3>
            <p className="text-sm text-gray-600">Earn more with our low commission rates</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OwnerSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#6b9080]" />
        </div>
      }
    >
      <OwnerSignupForm />
    </Suspense>
  );
}





