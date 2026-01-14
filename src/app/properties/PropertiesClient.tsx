"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  SlidersHorizontal, 
  MapPin, 
  Users, 
  PoundSterling,
  Sparkles,
  Waves,
  Gamepad2,
  PawPrint,
  Accessibility,
  Clapperboard,
  Flame,
  Trees,
  Check,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  location: string;
  sleeps: number;
  bedrooms: number;
  priceFrom: number;
  image: string;
  features: string[];
  slug: string;
  description?: string;
}

interface PropertiesClientProps {
  initialProperties: Property[];
}

const destinations = [
  { name: "Bath", slug: "bath" },
  { name: "Birmingham", slug: "birmingham" },
  { name: "Blackpool", slug: "blackpool" },
  { name: "Bournemouth", slug: "bournemouth" },
  { name: "Brighton", slug: "brighton" },
  { name: "Bristol", slug: "bristol" },
  { name: "Cambridge", slug: "cambridge" },
  { name: "Canterbury", slug: "canterbury" },
  { name: "Cardiff", slug: "cardiff" },
  { name: "Cheltenham", slug: "cheltenham" },
  { name: "Chester", slug: "chester" },
  { name: "Cornwall", slug: "cornwall" },
  { name: "Cotswolds", slug: "cotswolds" },
  { name: "Devon", slug: "devon" },
  { name: "Durham", slug: "durham" },
  { name: "Exeter", slug: "exeter" },
  { name: "Harrogate", slug: "harrogate" },
  { name: "Lake District", slug: "lake-district" },
  { name: "Leeds", slug: "leeds" },
  { name: "Liverpool", slug: "liverpool" },
  { name: "London", slug: "london" },
  { name: "Manchester", slug: "manchester" },
  { name: "Margate", slug: "margate" },
  { name: "Newcastle", slug: "newcastle" },
  { name: "Newquay", slug: "newquay" },
  { name: "Norfolk", slug: "norfolk" },
  { name: "Nottingham", slug: "nottingham" },
  { name: "Oxford", slug: "oxford" },
  { name: "Peak District", slug: "peak-district" },
  { name: "Plymouth", slug: "plymouth" },
  { name: "Sheffield", slug: "sheffield" },
  { name: "St Ives", slug: "st-ives" },
  { name: "Stratford-upon-Avon", slug: "stratford-upon-avon" },
  { name: "Suffolk", slug: "suffolk" },
  { name: "Sussex", slug: "sussex" },
  { name: "Windsor", slug: "windsor" },
  { name: "York", slug: "york" },
  { name: "Yorkshire", slug: "yorkshire" },
].sort((a, b) => a.name.localeCompare(b.name));

const featureOptions = [
  { icon: Waves, label: "Hot Tub" },
  { icon: Waves, label: "Pool" },
  { icon: Gamepad2, label: "Games Room" },
  { icon: PawPrint, label: "Pet Friendly" },
  { icon: Accessibility, label: "Accessible" },
  { icon: Clapperboard, label: "Cinema" },
  { icon: Flame, label: "BBQ" },
  { icon: Trees, label: "Garden" },
];

export default function PropertiesClient({ initialProperties }: PropertiesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(6);
  
  const destinationParam = searchParams.get("destination") || searchParams.get("location") || "";
  const guestsParam = searchParams.get("guests") || "0";
  
  const normalizedLocation = destinationParam === "all-locations" ? "" : destinationParam;
  
  const [filters, setFilters] = useState({
    location: normalizedLocation,
    groupSize: parseInt(guestsParam),
    priceMin: 50,
    priceMax: 3000,
    features: [] as string[],
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    params.delete("destination");
    
    if (filters.location) {
      params.set("location", filters.location);
    } else {
      params.delete("location");
    }
    router.replace(`/properties?${params.toString()}`, { scroll: false });
  }, [filters.location, router, searchParams]);

  useEffect(() => {
    setDisplayedCount(6);
  }, [filters]);

  const toggleFeature = (feature: string) => {
    setFilters((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const filteredProperties = useMemo(() => {
    return initialProperties.filter((property) => {
      if (filters.location) {
        const filterSlug = filters.location.toLowerCase().replace(/-/g, " ");
        const filterName = destinations.find(d => d.slug === filters.location)?.name.toLowerCase() || filterSlug;
        const propertyLocation = property.location.toLowerCase();
        
        const locationMatch = 
          propertyLocation.includes(filterSlug) ||
          propertyLocation.includes(filterName) ||
          propertyLocation.startsWith(filterName.split(",")[0]);
        if (!locationMatch) return false;
      }

      if (filters.groupSize > 0 && property.sleeps < filters.groupSize) {
        return false;
      }

      if (property.priceFrom < filters.priceMin || property.priceFrom > filters.priceMax) {
        return false;
      }

      return true;
    });
  }, [filters, initialProperties]);

  const visibleProperties = filteredProperties.slice(0, displayedCount);
  const hasMore = displayedCount < filteredProperties.length;

  const loadMore = () => {
    setDisplayedCount(prev => Math.min(prev + 6, filteredProperties.length));
  };

  return (
    <>
      <div className="md:hidden mb-6">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full rounded-xl py-6 font-medium transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: "var(--color-accent-sage)",
            color: "white",
          }}
        >
          <SlidersHorizontal className="w-5 h-5 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className={`md:w-80 ${showFilters ? "block" : "hidden md:block"}`}>
          <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
                <SlidersHorizontal className="w-5 h-5 text-[var(--color-accent-sage)]" />
                Filters
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFilters({
                    location: "",
                    groupSize: 0,
                    priceMin: 50,
                    priceMax: 3000,
                    features: [],
                  })
                }
                className="hover:text-[var(--color-accent-pink)] transition-colors"
              >
                Clear all
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--color-accent-pink)]" />
                  Location
                </label>
                <select
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent-sage)] focus:border-transparent"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                >
                  <option value="">All locations</option>
                  {destinations.map((destination) => (
                    <option key={destination.slug} value={destination.slug}>
                      {destination.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-[var(--color-accent-gold)]" />
                  Group size: {filters.groupSize > 0 ? `${filters.groupSize}+` : "Any"}
                </label>
                <Slider
                  value={[filters.groupSize]}
                  onValueChange={([value]) => setFilters({ ...filters, groupSize: value })}
                  max={30}
                  step={2}
                  className="py-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <PoundSterling className="w-4 h-4 text-[var(--color-accent-sage)]" />
                  Price per night: £{filters.priceMin} - £{filters.priceMax}
                </label>
                <Slider
                  value={[filters.priceMin, filters.priceMax]}
                  onValueChange={([min, max]) =>
                    setFilters({ ...filters, priceMin: min, priceMax: max })
                  }
                  max={3000}
                  step={10}
                  className="py-4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--color-accent-pink)]" />
                  Features
                </label>
                <div className="space-y-2">
                  {featureOptions.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <label 
                        key={feature.label} 
                        className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[var(--color-bg-primary)] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature.label)}
                          onChange={() => toggleFeature(feature.label)}
                          className="w-4 h-4 rounded accent-[var(--color-accent-pink)]"
                        />
                        <Icon className="w-4 h-4 text-[var(--color-accent-sage)]" />
                        <span className="text-sm">{feature.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label 
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[var(--color-bg-primary)] transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-[var(--color-accent-pink)]"
                  />
                  <Check className="w-4 h-4 text-[var(--color-accent-gold)]" />
                  <span className="text-sm font-medium">Instant enquiry only</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[var(--color-neutral-dark)] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--color-accent-gold)]" />
              Showing {visibleProperties.length} of {filteredProperties.length} properties
            </p>
            <select className="px-4 py-2 rounded-xl border border-gray-300 text-sm transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent-sage)] focus:border-transparent">
              <option>Sort by: Price (Low to High)</option>
              <option>Sort by: Price (High to Low)</option>
              <option>Sort by: Sleeps (Most first)</option>
              <option>Sort by: Newest</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {visibleProperties.length > 0 ? (
              visibleProperties.map((property, index) => (
                <div key={property.id}>
                  <PropertyCard {...property} priority={index < 2} />
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-xl text-[var(--color-neutral-dark)]">
                  No properties match your filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>

          {hasMore && (
            <div className="text-center mt-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={loadMore}
                  size="lg"
                  className="rounded-2xl px-10 py-6 font-medium transition-all duration-300 hover:scale-[1.05] hover:shadow-lg"
                  style={{
                    background: "var(--color-accent-sage)",
                    color: "white",
                  }}
                >
                  Load More Properties
                </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-2xl px-10 py-6 font-medium border-2 transition-all duration-300 hover:bg-[var(--color-accent-gold)] hover:text-white hover:border-[var(--color-accent-gold)]"
                    style={{
                      borderColor: "var(--color-accent-gold)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <Link href="/contact">Request a Quote</Link>
                  </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
