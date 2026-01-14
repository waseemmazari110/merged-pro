"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

function OwnerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"guest" | "owner">("owner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Account created successfully! Please log in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        toast.error("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Verify user role matches owner
      if (data?.user) {
        // Check if the logged-in user is an owner or admin
        const userResponse = await fetch("/api/user/profile", { cache: 'no-store' });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userRole = userData.role;
          
          // Redirect based on role
          if (userRole === "admin") {
            toast.success("Welcome back, Admin!");
            router.push("/admin/dashboard");
            return;
          } else if (userRole === "owner") {
            toast.success("Welcome back!");
            const redirectUrl = searchParams.get("redirect") || "/owner/dashboard";
            router.push(redirectUrl);
            return;
          } else {
            // Guest or other role
            toast.error("This login is for property owners only. Please use the guest login.");
            await authClient.signOut();
            setIsLoading(false);
            return;
          }
        } else {
          toast.error("Could not verify account. Please try again.");
          await authClient.signOut();
          setIsLoading(false);
        }
      } else {
        toast.error("Login failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sign In to your Account
          </h1>
        </div>

        {/* Login Form Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("guest")}
              className={`pb-3 px-1 text-base font-medium transition-colors relative ${
                activeTab === "guest"
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Guest
              {activeTab === "guest" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("owner")}
              className={`pb-3 px-1 text-base font-medium transition-colors relative ${
                activeTab === "owner"
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Owner
              {activeTab === "owner" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
              )}
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address.."
                className="h-14 rounded-full border-2 border-gray-900 focus:border-gray-900 px-6 text-gray-600 placeholder:text-gray-400"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password.."
                className="h-14 rounded-full border-2 border-gray-900 focus:border-gray-900 px-6 text-gray-600 placeholder:text-gray-400"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="size-3.5 sm:size-4 border-2 border-gray-900"
                />
                <label
                  htmlFor="remember"
                  className="text-gray-900 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-gray-600 hover:text-gray-900 underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-full font-medium text-base transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          {/* Signup Link */}
          <div className="text-center pt-4">
            <Link
              href={activeTab === "owner" ? "/owner/signup" : "/register"}
              className="text-sm text-gray-900 hover:underline font-medium"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OwnerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#17a2b8]" />
        </div>
      }
    >
      <OwnerLoginForm />
    </Suspense>
  );
}





