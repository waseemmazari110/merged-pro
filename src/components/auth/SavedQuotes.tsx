"use client";

import { useState, useEffect } from "react";
import { Loader2, Quote, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function SavedQuotes() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const res = await fetch("/api/account/save-quote");
      const data = await res.json();
      setQuotes(data.quotes || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this saved quote?")) return;

    try {
      const res = await fetch("/api/account/save-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });

      if (res.ok) {
        setQuotes(quotes.filter((q) => q.id !== id));
        toast.success("Quote removed");
      }
    } catch (error) {
      toast.error("Failed to remove quote");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" />
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <Quote className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">No saved quotes yet</h3>
        <p className="text-gray-600 mt-1 mb-6">Request quotes and save them to review later.</p>
        <Link
          href="/properties"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-[var(--color-accent-sage)] text-white font-semibold hover:shadow-lg transition-all"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <div key={quote.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-lg text-[var(--color-text-primary)]">
                {quote.quotePayload?.propertyTitle || "Property Quote"}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Saved on {new Date(quote.createdAt).toLocaleDateString()}
              </p>
              
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Price</p>
                  <p className="font-bold text-[var(--color-accent-sage)]">£{quote.quotePayload?.price || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Dates</p>
                  <p className="text-sm font-medium">{quote.quotePayload?.dates || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold">Guests</p>
                  <p className="text-sm font-medium">{quote.quotePayload?.groupSize || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(quote.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Remove"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
