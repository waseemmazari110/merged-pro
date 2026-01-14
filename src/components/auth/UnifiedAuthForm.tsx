"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ArrowRight, ChevronLeft } from "lucide-react";
import { SocialLoginButtons } from "./SocialLoginButtons";
import { AccountTypeSelection } from "./AccountTypeSelection";
import { trackEvent, AuthEvents } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type AuthMode = "initial" | "login" | "signup" | "account-type";

export function UnifiedAuthForm({ initialMode = "initial" }: { initialMode?: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userRole, setUserRole] = useState<"customer" | "owner">("customer");

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "initial") {
      emailInputRef.current?.focus();
      trackEvent(AuthEvents.VIEW_SIGNUP_PAGE);
    }
  }, [mode]);

  const validateEmail = (value: string) => {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

    useEffect(() => {
      if (mode === "initial" && validateEmail(email) && !isLoading) {
        const timer = setTimeout(() => {
          handleInitialSubmit();
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [email, mode, isLoading]);


  const handleInitialSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setEmailError("");

    try {
      // Check if email exists by trying to sign in with a dummy password
      // In better-auth, we can't easily check if a user exists without a custom API or trying sign in/up
      // For now, we'll try to sign in with a blank password to see the error, or just proceed to a unified next step
      // A better way: try to sign up, if it fails with "User already exists", go to login mode.
      
      // Let's assume for now we just show a "Next" button and then ask for password.
      // If we want to be smart about existing users, we'd need an API route.
      setMode("signup"); // Default to signup for now, or we can make it more dynamic later
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      trackEvent(AuthEvents.LOGIN_SUCCESS);
      toast.success("Welcome back!");
      
      const user = data?.user as any;
      router.push(user?.role === "owner" ? "/owner-dashboard" : "/account/dashboard");
    } catch (err) {
      toast.error("An error occurred during sign in");
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.magicLink({
        email,
        callbackURL: "/account/dashboard",
      });
      if (error) {
        toast.error(error.message || "Failed to send magic link");
      } else {
        toast.success("Check your email for the login link!");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setPasswordError("Minimum 8 characters");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }

    setMode("account-type");
  };

  const handleFinalSignUp = async (role: "customer" | "owner") => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: name || undefined,
        role: role,
      });

      if (error) {
        if (error.message?.includes("already exists")) {
          toast.error("An account with this email already exists. Switching to login.");
          setMode("login");
          setIsLoading(false);
          return;
        }
        toast.error(error.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      trackEvent(AuthEvents.SIGNUP_SUCCESS, { method: "email", role });
      trackEvent(role === "owner" ? AuthEvents.SELECT_ACCOUNT_TYPE_OWNER : AuthEvents.SELECT_ACCOUNT_TYPE_CUSTOMER);
      
      toast.success("Account created successfully!");
      router.push(role === "owner" ? "/owner-dashboard" : "/account/dashboard");
    } catch (err) {
      toast.error("An error occurred during sign up");
      setIsLoading(false);
    }
  };

  if (mode === "account-type") {
    return <AccountTypeSelection onSelect={handleFinalSignUp} isLoading={isLoading} />;
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
      {mode !== "initial" && (
        <button
          onClick={() => setMode("initial")}
          className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      )}

      <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
            {mode === "login" ? "Welcome back" : (mode === "initial" ? "Create your account" : "Create your account")}
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            {mode === "login" 
              ? "Sign in to manage your bookings" 
              : "Save properties, track enquiries, and manage bookings in one place"}
          </p>

      </div>

      {mode === "initial" && (
        <>
          <SocialLoginButtons callbackURL="/account/dashboard" />
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or continue with email</span>
            </div>
          </div>
        </>
      )}

      <form 
        onSubmit={mode === "initial" ? handleInitialSubmit : (mode === "login" ? handleSignIn : handleSignUpStep)} 
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
          <Input
            ref={emailInputRef}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              setEmailError("");
              if (mode === "initial" && validateEmail(value)) {
                // Optional: Auto-advance could be jarring, but the user requested it
                // We'll add a slight delay or just keep it simple
              }
            }}
            disabled={mode !== "initial"}
            required
            className={cn(
              "rounded-xl border-gray-300 h-12 focus:ring-[var(--color-accent-sage)]",
              emailError && "border-red-500"
            )}
          />
          {emailError && <p className="text-xs text-red-500">{emailError}</p>}
        </div>

        {mode === "signup" && (
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium">
              Full name <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-gray-300 h-12 focus:ring-[var(--color-accent-sage)]"
            />
          </div>
        )}

        {(mode === "login" || mode === "signup") && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  {mode === "login" ? "Password" : "Create password"}
                </Label>

              {mode === "login" && (
                <Link
                  href="/account/forgot-password"
                  className="text-xs font-medium text-[var(--color-accent-sage)] hover:underline"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder={mode === "login" ? "Password" : ""}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                required
                className={cn(
                  "rounded-xl border-gray-300 pr-10 h-12 focus:ring-[var(--color-accent-sage)]",
                  passwordError && "border-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === "signup" && (
              <p className={cn("text-xs", passwordError ? "text-red-500" : "text-gray-500")}>
                {passwordError || "Minimum 8 characters"}
              </p>
            )}
          </div>
        )}

        {mode === "login" && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
              />
              <label htmlFor="remember" className="text-sm text-gray-600 font-medium">
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={handleMagicLink}
              className="text-xs font-medium text-[var(--color-accent-sage)] hover:underline"
            >
              Forgot password?
            </button>
          </div>
        )}

          {mode === "signup" && (
            <div className="flex items-start space-x-2 py-2">
              <Checkbox 
                id="agreeTerms" 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                required
              />
              <label htmlFor="agreeTerms" className="text-xs text-gray-600 leading-tight cursor-pointer">
                I agree to the <Link href="/terms" className="text-[var(--color-accent-sage)] hover:underline">Terms and Conditions</Link> and <Link href="/privacy" className="text-[var(--color-accent-sage)] hover:underline">Privacy Policy</Link>
              </label>
            </div>
          )}

          <div className="pt-4 sm:pt-0 sticky bottom-0 sm:static bg-white/80 backdrop-blur-sm sm:bg-transparent -mx-6 px-6 pb-6 sm:pb-0 sm:mx-0">
            <Button
              type="submit"
              disabled={isLoading || (mode === "initial" && !validateEmail(email)) || (mode === "signup" && (!agreeTerms || password.length < 8))}
              className="w-full rounded-xl py-6 text-base font-semibold bg-[var(--color-accent-sage)] hover:bg-[#4a7c6d] text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              {mode === "initial" ? "Continue" : (mode === "login" ? "Log in" : "Continue")}
              {mode === "initial" && !isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>

          
          {mode === "login" && (
            <button
              type="button"
              onClick={handleMagicLink}
              disabled={isLoading}
              className="w-full mt-4 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Email me a secure login link
            </button>
          )}
        </div>

        {mode === "initial" && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="font-semibold text-[var(--color-accent-sage)] hover:underline"
            >
              Log in
            </button>
          </p>
        )}

        {mode === "login" && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("signup")}
              className="font-semibold text-[var(--color-accent-sage)] hover:underline"
            >
              Create account
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
