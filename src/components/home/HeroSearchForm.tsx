"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Calendar, User, Sparkles, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import dynamic from "next/dynamic";

const CalendarComponent = dynamic(() => import("@/components/ui/calendar").then(mod => mod.Calendar), {
  loading: () => <div className="h-[300px] w-[280px] bg-gray-50 animate-pulse rounded-xl" />,
  ssr: false
});
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

const allDestinations = [
  "All Locations", "Brighton", "Bath", "Bournemouth", "London", "Manchester", "Liverpool", "York", 
  "Newcastle", "Cardiff", "Edinburgh", "Scottish Highlands", "Snowdonia", "Newquay", "Devon", 
  "Cotswolds", "Lake District", "Birmingham", "Blackpool", "Bristol", "Cambridge", "Canterbury", 
  "Cheltenham", "Chester", "Durham", "Exeter", "Harrogate", "Leeds", "Margate", "Nottingham", 
  "Oxford", "Plymouth", "Sheffield", "St Ives", "Stratford-upon-Avon", "Windsor"
];

export default function HeroSearchForm() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [destination, setDestination] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [destinationOpen, setDestinationOpen] = useState(false);
  const [focusedDestinationIndex, setFocusedDestinationIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const announcementRef = useRef<HTMLDivElement>(null);
  const destinationButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const announce = (message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message;
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (dateRange?.from) params.set('checkIn', format(dateRange.from, 'yyyy-MM-dd'));
    if (dateRange?.to) params.set('checkOut', format(dateRange.to, 'yyyy-MM-dd'));
    params.set('guests', String(adults + children));
    if (pets > 0) params.set('pets', String(pets));
    
    window.location.href = `/properties?${params.toString()}`;
  };

  const handleDestinationSelect = (dest: string) => {
    setDestination(dest.toLowerCase().replace(/\s+/g, '-'));
    setDestinationOpen(false);
    setFocusedDestinationIndex(-1);
    announce(`${dest} selected`);
  };

  const dateRangeDisplay = dateRange?.from && dateRange?.to
    ? `${format(dateRange.from, 'dd MMM')} → ${format(dateRange.to, 'dd MMM')}`
    : dateRange?.from
    ? `${format(dateRange.from, 'dd MMM')} → ?`
    : "Select dates";

  const totalGuests = adults + children + infants;
  const guestsSummary = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''} - ${pets} pet${pets !== 1 ? 's' : ''}`;

  if (!mounted) {
    return (
      <div className="bg-white/95 rounded-2xl md:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-6 max-w-5xl mx-auto h-[300px] md:h-[112px] flex items-center justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
           {[1,2,3,4].map(i => <div key={i} className="h-14 md:h-16 bg-gray-100 animate-pulse rounded-xl md:rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-5 sm:p-6 md:p-6 max-w-5xl mx-auto">
      <div ref={announcementRef} className="sr-only" role="status" aria-live="polite" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 md:gap-4">
          {/* Destination */}
            <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-14 sm:h-14 md:h-16 justify-start text-left font-normal rounded-xl md:rounded-2xl border-2 hover:border-[var(--color-accent-sage)] transition-colors"
                  aria-label={`Destination: ${destination || "Search destinations"}`}
                >
                  <MapPin className="mr-2 h-5 w-5 text-[var(--color-accent-sage)] flex-shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs text-gray-500">Where</span>
                    <span className="text-sm font-medium truncate">{destination || "Search destinations"}</span>
                  </div>
                </Button>
              </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-40px)] md:w-80 p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search destinations..." />
                    <CommandList className="smooth-scroll">
                      <CommandEmpty>No destinations found.</CommandEmpty>
                      <CommandGroup heading="Popular Locations">
                        {allDestinations.map((dest, index) => (
                          <CommandItem
                            key={dest}
                            value={dest}
                            onSelect={() => handleDestinationSelect(dest)}
                            className="cursor-pointer"
                          >
                            {dest}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>

            </Popover>


          {/* Dates */}
          <div className="relative">
            <Button
              variant="outline"
              className="h-14 sm:h-14 md:h-16 w-full justify-start text-left font-normal rounded-xl md:rounded-2xl border-2 hover:border-[var(--color-accent-sage)] transition-colors"
              onClick={() => setDatePickerOpen(!datePickerOpen)}
              aria-label={`Dates: ${dateRangeDisplay}`}
            >
              <Calendar className="mr-2 h-5 w-5 text-[var(--color-accent-sage)] flex-shrink-0" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-gray-500">When</span>
                <span className="text-sm font-medium truncate">{dateRangeDisplay}</span>
              </div>
            </Button>
            {datePickerOpen && (
              <>
                <div className="fixed inset-0 z-[9998]" onClick={() => setDatePickerOpen(false)} />
                <div className="absolute top-full left-0 mt-2 z-[9999] bg-white rounded-xl shadow-2xl border p-4">
                  <CalendarComponent
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={isMobile ? 1 : 2}
                    disabled={(date) => date < new Date()}
                  />
                  <div className="flex justify-end pt-4 border-t mt-4">
                    <Button size="sm" onClick={() => setDatePickerOpen(false)} className="bg-[var(--color-accent-sage)] text-white">Done</Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Guests */}
          <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="h-14 sm:h-14 md:h-16 justify-start text-left font-normal rounded-xl md:rounded-2xl border-2 hover:border-[var(--color-accent-sage)] transition-colors"
                aria-label={`Guests: ${guestsSummary}`}
              >
                <User className="mr-2 h-5 w-5 text-[var(--color-accent-sage)] flex-shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs text-gray-500">Who</span>
                  <span className="text-sm font-medium truncate">{guestsSummary}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                {[
                  { label: 'Adults', sub: 'Age 13+', value: adults, min: 1, set: setAdults },
                  { label: 'Children', sub: 'Age 2-12', value: children, min: 0, set: setChildren },
                  { label: 'Infants', sub: 'Under 2', value: infants, min: 0, set: setInfants },
                  { label: 'Pets', sub: 'Bring a pet', value: pets, min: 0, set: setPets }
                ].map((group) => (
                  <div key={group.label} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{group.label}</div>
                      <div className="text-sm text-gray-500">{group.sub}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-12 w-12 min-h-[48px] min-w-[48px] rounded-full" 
                          onClick={() => group.set(Math.max(group.min, group.value - 1))} 
                          disabled={group.value <= group.min}
                          aria-label={`Decrease ${group.label}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-medium" aria-live="polite">{group.value}</span>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-12 w-12 min-h-[48px] min-w-[48px] rounded-full" 
                          onClick={() => group.set(group.value + 1)}
                          aria-label={`Increase ${group.label}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Search Button */}
          <Button 
            onClick={handleSearch} 
            size="lg" 
            className="h-14 sm:h-14 md:h-16 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg transition-all hover:scale-[1.02] bg-[var(--color-accent-sage)] text-[var(--color-text-primary)]"
            aria-label="Search properties"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>
    </div>
  );
}
