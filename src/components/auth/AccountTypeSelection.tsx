"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Home, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountTypeSelectionProps {
  onSelect: (type: "customer" | "owner") => void;
  isLoading?: boolean;
}

export function AccountTypeSelection({ onSelect, isLoading }: AccountTypeSelectionProps) {
  const [selected, setSelected] = useState<"customer" | "owner">("customer");

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">
          How will you use your account?
        </h2>
        <p className="text-gray-600 mt-2">
          You can change this later in your account settings
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setSelected("customer")}
          className={cn(
            "w-full p-5 rounded-2xl border-2 transition-all text-left flex items-start gap-4",
            selected === "customer"
              ? "border-[var(--color-accent-sage)] bg-[var(--color-accent-sage)]/5"
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <div className={cn(
            "p-3 rounded-xl",
            selected === "customer" ? "bg-[var(--color-accent-sage)] text-white" : "bg-gray-100 text-gray-500"
          )}>
            <Search className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-[var(--color-text-primary)]">
              Browse and enquire on properties
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Save favourites and send enquiries
            </p>
          </div>
          {selected === "customer" && (
            <div className="w-6 h-6 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          )}
        </button>

        <button
          onClick={() => setSelected("owner")}
          className={cn(
            "w-full p-5 rounded-2xl border-2 transition-all text-left flex items-start gap-4",
            selected === "owner"
              ? "border-[var(--color-accent-sage)] bg-[var(--color-accent-sage)]/5"
              : "border-gray-200 hover:border-gray-300 bg-white"
          )}
        >
          <div className={cn(
            "p-3 rounded-xl",
            selected === "owner" ? "bg-[var(--color-accent-sage)] text-white" : "bg-gray-100 text-gray-500"
          )}>
            <Home className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-[var(--color-text-primary)]">
              List and manage properties
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage listings, enquiries, and availability
            </p>
          </div>
          {selected === "owner" && (
            <div className="w-6 h-6 rounded-full bg-[var(--color-accent-sage)] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          )}
        </button>
      </div>

      <div className="mt-8">
        <Button
          onClick={() => onSelect(selected)}
          disabled={isLoading}
          className="w-full rounded-xl py-7 text-lg font-bold bg-[var(--color-accent-sage)] hover:bg-[#4a7c6d] text-white transition-all shadow-md hover:shadow-lg"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
          Continue
          {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
