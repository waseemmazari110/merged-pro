"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function DualAuthForm({ onSuccess, initialTab }: { onSuccess?: () => void; initialTab?: "guest" | "owner" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = initialTab || searchParams.get("tab") || "guest";
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Sync activeTab with searchParams if initialTab is not provided
  useEffect(() => {
    if (initialTab) return;
    const tab = searchParams.get("tab");
    if (tab === "guest" || tab === "owner") {
      setActiveTab(tab);
    }
  }, [searchParams, initialTab]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

        toast.success("Signed in successfully!");
        
        if (onSuccess) {
          onSuccess();
        }

        // Use the user data from the response for immediate redirection
        const user = data?.user as any;

        if (user?.role === "owner") {
          router.push("/owner-dashboard");
        } else {
          router.push("/account/dashboard");
        }
    } catch (err) {
      console.error("Sign in error:", err);
      toast.error("An error occurred during sign in");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-center mb-8 text-[var(--color-text-primary)]">
          Sign In to your Account
        </h2>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="guest"
              className="rounded-md py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[var(--color-accent-sage)] data-[state=active]:shadow-sm"
            >
              Customer
            </TabsTrigger>
            <TabsTrigger 
              value="owner"
              className="rounded-md py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[var(--color-accent-sage)] data-[state=active]:shadow-sm"
            >
              Owner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guest">
            <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address..</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email address.."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl border-gray-300 focus:ring-[var(--color-accent-sage)]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password..</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Password.."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-xl border-gray-300 pr-10 focus:ring-[var(--color-accent-sage)]"
                    />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/account/forgot-password"
                  className="text-sm font-medium text-gray-500 hover:text-[var(--color-accent-sage)] transition-colors underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full py-6 text-lg font-semibold bg-[var(--color-accent-sage)] hover:bg-[#4a7c6d] text-white transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Log In
              </Button>

              <div className="text-center">
                <Link
                  href="/account/guest/sign-up"
                  className="text-sm font-bold text-gray-900 hover:text-[var(--color-accent-sage)] transition-colors border-b-2 border-gray-900 hover:border-[var(--color-accent-sage)]"
                >
                  Create an Account
                </Link>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="owner">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="owner-email">Email address..</Label>
                <Input
                  id="owner-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email address.."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl border-gray-300 focus:ring-[var(--color-accent-sage)]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="owner-password">Password..</Label>
                </div>
                <div className="relative">
                  <Input
                    id="owner-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Password.."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl border-gray-300 pr-10 focus:ring-[var(--color-accent-sage)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="owner-remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <label
                    htmlFor="owner-remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  href="/account/forgot-password"
                  className="text-sm font-medium text-gray-500 hover:text-[var(--color-accent-sage)] transition-colors underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full py-6 text-lg font-semibold bg-[var(--color-accent-sage)] hover:bg-[#4a7c6d] text-white transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Log In
              </Button>

              <div className="text-center">
                <Link
                  href="/register-your-property"
                  className="text-sm font-bold text-gray-900 hover:text-[var(--color-accent-sage)] transition-colors border-b-2 border-gray-900 hover:border-[var(--color-accent-sage)]"
                >
                  Register Your Property
                </Link>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
