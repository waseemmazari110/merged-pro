"use client";

import { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
  propertyId: number;
  className?: string;
  variant?: "icon" | "full";
}

export function SaveButton({ propertyId, className = "", variant = "icon" }: SaveButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (session?.user) {
      const checkSaved = async () => {
        try {
          const res = await fetch("/api/account/save-property");
          const data = await res.json();
          if (data.savedIds?.includes(propertyId)) {
            setIsSaved(true);
          }
        } catch (error) {
          console.error("Error checking saved status:", error);
        } finally {
          setIsInitialized(true);
        }
      };
      checkSaved();
    } else {
      setIsInitialized(true);
    }
  }, [session, propertyId]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.info("Please sign in to save properties");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    const action = isSaved ? "unsave" : "save";

    try {
      const res = await fetch("/api/account/save-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, action }),
      });

      if (res.ok) {
        setIsSaved(!isSaved);
        toast.success(isSaved ? "Property removed from saved" : "Property saved to your account");
      } else {
        toast.error("Failed to update saved status");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleToggleSave}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 font-medium ${
          isSaved 
            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" 
            : "border-gray-200 text-gray-700 hover:bg-gray-50"
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
        )}
        {isSaved ? "Saved" : "Save Property"}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading}
      className={`relative w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-sm group ${className}`}
      aria-label={isSaved ? "Remove from saved" : "Save property"}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      ) : (
        <Heart
          className={`w-5 h-5 transition-colors ${
            isSaved ? "fill-red-500 text-red-500" : "text-gray-700 group-hover:text-red-500"
          }`}
        />
      )}
    </button>
  );
}
