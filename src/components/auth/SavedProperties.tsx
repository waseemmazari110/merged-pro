"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import { Loader2, HeartOff } from "lucide-react";
import Link from "next/link";

export function SavedProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const res = await fetch("/api/account/saved-properties-details");
        const data = await res.json();
        setProperties(data.properties || []);
      } catch (error) {
        console.error("Error fetching saved properties:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSaved();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-sage)]" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <HeartOff className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">No saved properties yet</h3>
        <p className="text-gray-600 mt-1 mb-6">Start browsing and save your favourites!</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} {...property} id={property.id.toString()} />
      ))}
    </div>
  );
}
