"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { SaveButton } from "@/components/auth/SaveButton";

interface PropertyClientActionsProps {
  propertyId: number;
  propertyTitle: string;
}

export default function PropertyClientActions({ propertyId, propertyTitle }: PropertyClientActionsProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: propertyTitle,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex gap-4">
      <SaveButton propertyId={propertyId} variant="full" />
      <Button 
        variant="outline" 
        className="rounded-xl min-h-[48px] px-6 border-2 border-gray-200"
        onClick={handleShare}
        aria-label="Share property"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
    </div>
  );
}
