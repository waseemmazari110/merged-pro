"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Waves, 
  Flame, 
  Gamepad2, 
  Film, 
  Utensils, 
  Trees, 
  Car, 
  Wifi, 
  Dog, 
  Accessibility, 
  Zap, 
  Trophy, 
  Umbrella, 
  Fish,
  Home,
  Search
} from "lucide-react";

interface AmenitiesSelectorProps {
  selectedAmenities: string[];
  onAmenitiesChange: (amenities: string[]) => void;
}

const AMENITY_CATEGORIES = {
  "Luxury Features": [
    { name: "Hot Tub", icon: Flame },
    { name: "Swimming Pool", icon: Waves },
    { name: "Games Room", icon: Gamepad2 },
    { name: "Cinema Room", icon: Film },
  ],
  "Outdoor Amenities": [
    { name: "BBQ", icon: Utensils },
    { name: "Garden", icon: Trees },
    { name: "Tennis Court", icon: Trophy },
    { name: "Beach Access", icon: Umbrella },
    { name: "Fishing Lake", icon: Fish },
  ],
  "Essential Facilities": [
    { name: "WiFi", icon: Wifi },
    { name: "Parking", icon: Car },
    { name: "EV Charging", icon: Zap },
  ],
  "Accessibility": [
    { name: "Pet Friendly", icon: Dog },
    { name: "Accessible", icon: Accessibility },
  ],
};

export function AmenitiesSelector({ selectedAmenities, onAmenitiesChange }: AmenitiesSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      onAmenitiesChange(selectedAmenities.filter(a => a !== amenity));
    } else {
      onAmenitiesChange([...selectedAmenities, amenity]);
    }
  };

  const filteredCategories = Object.entries(AMENITY_CATEGORIES).reduce((acc, [category, amenities]) => {
    const filtered = amenities.filter(amenity => 
      amenity.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, typeof AMENITY_CATEGORIES[keyof typeof AMENITY_CATEGORIES]>);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search amenities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Selected Count */}
      <div className="flex items-center justify-between">
        <Label className="text-gray-900">Select Amenities</Label>
        <span className="text-sm text-gray-500">
          {selectedAmenities.length} selected
        </span>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {Object.entries(filteredCategories).map(([category, amenities]) => (
          <div key={category} className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {amenities.map(({ name, icon: Icon }) => {
                const isSelected = selectedAmenities.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleAmenity(name)}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-sm">{name}</span>
                    {isSelected && (
                      <div className="ml-auto w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {searchQuery && Object.keys(filteredCategories).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Home className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No amenities found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
