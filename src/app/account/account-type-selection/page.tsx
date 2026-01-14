"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";
import { AccountTypeSelection } from "@/components/auth/AccountTypeSelection";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

export default function AccountTypeSelectionPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
    // If they already have a role that isn't the default 'guest' or 'customer' (if they chose it already)
    // Actually, we'll allow them to re-select if they landed here.
  }, [session, isPending, router]);

  const handleSelect = async (role: "customer" | "owner") => {
    setIsLoading(true);
    try {
      const { error } = await authClient.user.update({
        role: role,
      });

      if (error) {
        toast.error(error.message || "Failed to update account type");
        setIsLoading(false);
        return;
      }

      toast.success(`Account set up as ${role === "owner" ? "Owner" : "Customer"}`);
      router.push(role === "owner" ? "/owner-dashboard" : "/account/dashboard");
    } catch (err) {
      toast.error("An error occurred");
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg-primary)] pt-32 pb-20 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center">
          <AccountTypeSelection onSelect={handleSelect} isLoading={isLoading} />
        </div>
      </main>
      <Footer />
    </>
  );
}
