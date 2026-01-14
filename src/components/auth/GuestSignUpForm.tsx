"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { trackEvent, AuthEvents } from "@/lib/analytics";

export function GuestSignUpForm() {
  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    trackEvent(AuthEvents.VIEW_SIGNUP_PAGE);
    emailInputRef.current?.focus();
  }, []);

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailError("");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) {
      setPasswordError("");
      return false;
    }
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const isFormValid = email && validateEmail(email) && password.length >= 8 && agreeTerms;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    trackEvent(AuthEvents.SUBMIT_EMAIL_SIGNUP, { method: "email" });
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: name || undefined,
        role: "guest",
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      trackEvent(AuthEvents.SIGNUP_SUCCESS, { method: "email", role: "guest" });
      toast.success("Account created successfully!");
      router.push("/account/dashboard");
    } catch (err) {
      console.error("Sign up error:", err);
      toast.error("An error occurred during sign up");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
          Create your account
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Save properties, track enquiries, and manage bookings in one place
        </p>
      </div>

      <SocialLoginButtons callbackURL="/account/dashboard" />

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
          <Input
            ref={emailInputRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (e.target.value) validateEmail(e.target.value);
            }}
            onBlur={() => {
              if (email && !validateEmail(email)) {
                trackEvent(AuthEvents.SIGNUP_ABANDON_EMAIL);
              }
            }}
            required
            className={`rounded-xl border-gray-300 h-11 ${emailError ? "border-red-500 focus:ring-red-500" : "focus:ring-[var(--color-accent-sage)]"}`}
            aria-describedby={emailError ? "email-error" : undefined}
            aria-invalid={!!emailError}
          />
          {emailError && (
            <p id="email-error" className="text-xs text-red-500 mt-1">{emailError}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium">
            Full name <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border-gray-300 h-11 focus:ring-[var(--color-accent-sage)]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">Create password</Label>
          <div className="relative">
            <Input
              id="password"
              name="new-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder=""
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value) validatePassword(e.target.value);
              }}
              onBlur={() => {
                if (password && !validatePassword(password)) {
                  trackEvent(AuthEvents.SIGNUP_ABANDON_PASSWORD);
                }
              }}
              required
              minLength={8}
              className={`rounded-xl border-gray-300 pr-10 h-11 ${passwordError ? "border-red-500 focus:ring-red-500" : "focus:ring-[var(--color-accent-sage)]"}`}
              aria-describedby="password-helper"
              aria-invalid={!!passwordError}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p id="password-helper" className={`text-xs mt-1 ${passwordError ? "text-red-500" : "text-gray-500"}`}>
            {passwordError || "Minimum 8 characters"}
          </p>
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox 
            id="terms" 
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked === true)}
            className="mt-0.5"
          />
          <label
            htmlFor="terms"
            className="text-xs sm:text-sm text-gray-600 leading-snug"
          >
            I agree to the{" "}
            <Link href="/terms" target="_blank" className="text-[var(--color-accent-sage)] hover:underline font-medium">
              Terms and Conditions
            </Link>
            {" "}and{" "}
            <Link href="/privacy" target="_blank" className="text-[var(--color-accent-sage)] hover:underline font-medium">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full rounded-xl py-6 text-base font-semibold bg-[var(--color-accent-sage)] hover:bg-[#4a7c6d] text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          Continue
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[var(--color-accent-sage)] hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
