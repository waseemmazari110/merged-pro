"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";

export default function OwnerRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    propertyName: "",
    propertyAddress: "",
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Sign out any existing session first
      try {
        await authClient.signOut();
      } catch (e) {
        console.log("No existing session to sign out");
      }

      // Register the owner using better-auth
      const signUpResult = await authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (signUpResult.error) {
        setError(signUpResult.error.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      // Set the user role to "owner" using the complete-signup endpoint
      const completeSignupResponse = await fetch("/api/owner/complete-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          propertyName: formData.propertyName,
          propertyAddress: formData.propertyAddress,
        }),
      });

      if (!completeSignupResponse.ok) {
        const errorData = await completeSignupResponse.json();
        setError(errorData.message || "Failed to complete owner registration");
        setIsLoading(false);
        return;
      }

      // Send verification email
      try {
        await fetch("/api/auth/send-verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
      }

      // Redirect to owner dashboard
      router.push("/owner/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Register as Property Owner
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join our platform and start listing your properties
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 rounded-lg"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 rounded-lg"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 rounded-lg"
                    placeholder="+44 123 456 7890"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="rounded-lg pr-10"
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Property Information (Optional)
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="propertyName">Property Name</Label>
                  <Input
                    id="propertyName"
                    name="propertyName"
                    type="text"
                    value={formData.propertyName}
                    onChange={handleInputChange}
                    className="mt-1 rounded-lg"
                    placeholder="e.g., Luxury Manor House"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    You can add multiple properties later from your dashboard
                  </p>
                </div>
                <div>
                  <Label htmlFor="propertyAddress">Property Address</Label>
                  <Input
                    id="propertyAddress"
                    name="propertyAddress"
                    type="text"
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                    className="mt-1 rounded-lg"
                    placeholder="e.g., 123 Main Street, London, UK"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-relaxed"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-[#17a2b8] hover:underline"
                  target="_blank"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-[#17a2b8] hover:underline"
                  target="_blank"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg py-6 text-base font-medium"
              style={{
                backgroundColor: "#17a2b8",
                color: "white",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Owner Account"
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/"
                  className="text-[#17a2b8] hover:underline font-medium"
                >
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}





