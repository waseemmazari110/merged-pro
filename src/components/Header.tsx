"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, LogOut, User as UserIcon, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import dynamic from "next/dynamic";
import { SignInModal } from "./auth/SignInModal";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isHousesOpen, setIsHousesOpen] = useState(false);
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const [isOccasionsOpen, setIsOccasionsOpen] = useState(false);
  const [isExperiencesOpen, setIsExperiencesOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize auth state once after first check
  useEffect(() => {
    if (!isPending && !isInitialized) {
      setIsInitialized(true);
    }
  }, [isPending, isInitialized]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    
    if (error) {
      toast.error("Error signing out");
    } else {
      refetch();
      toast.success("Signed out successfully");
      router.push("/");
    }
  };

  const houseStyles = [
    { title: "Manor Houses", slug: "manor-houses" },
    { title: "Country Houses", slug: "country-houses" },
    { title: "Luxury Houses", slug: "luxury-houses" },
    { title: "Castles", slug: "castles" },
    { title: "Party Houses", slug: "party-houses" },
    { title: "Large Holiday Homes", slug: "large-holiday-homes" },
    { title: "Large Cottages", slug: "large-cottages" },
    { title: "Stately Houses", slug: "stately-houses" },
  ];

  const features = [
    { title: "Hot Tub", slug: "hot-tub" },
    { title: "Swimming Pool", slug: "swimming-pool" },
    { title: "Games Room", slug: "games-room" },
    { title: "Cinema Room", slug: "cinema-room" },
    { title: "Tennis Court", slug: "tennis-court" },
    { title: "EV Charging", slug: "ev-charging" },
    { title: "Ground Floor Bedroom", slug: "ground-floor-bedroom" },
    { title: "Indoor Swimming Pool", slug: "indoor-swimming-pool" },
  ];

  const destinations = [
    { title: "Brighton", slug: "brighton" },
    { title: "Bath", slug: "bath" },
    { title: "London", slug: "london" },
    { title: "Manchester", slug: "manchester" },
    { title: "Bournemouth", slug: "bournemouth" },
    { title: "York", slug: "york" },
    { title: "Cardiff", slug: "cardiff" },
    { title: "Newcastle", slug: "newcastle" },
  ];

  const occasions = [
    { title: "Weddings & Celebrations", slug: "weddings", description: "Perfect for your special day" },
    { title: "Weekend Breaks", slug: "weekend-breaks", description: "Relaxing group getaways" },
    { title: "Special Celebrations", slug: "special-celebrations", description: "Birthdays & milestones" },
    { title: "Hen Parties", slug: "hen-party-houses", description: "Memorable hen weekends" },
    { title: "Christmas Gatherings", slug: "christmas", description: "Festive celebrations" },
    { title: "New Year Events", slug: "new-year", description: "Ring in the new year" },
  ];

  const experiences = [
    { title: "Cocktail Masterclass", slug: "cocktail-masterclass" },
    { title: "Sip & Paint", slug: "sip-and-paint" },
    { title: "Butlers in the Buff", slug: "butlers-in-the-buff" },
    { title: "Life Drawing", slug: "life-drawing" },
    { title: "Private Chef", slug: "private-chef" },
    { title: "Spa Treatments", slug: "spa-treatments" },
    { title: "Mobile Beauty Bar", slug: "mobile-beauty-bar" },
    { title: "Pamper Party Package", slug: "pamper-party-package" },
    { title: "Make-up Artist", slug: "make-up-artist" },
    { title: "Hair Styling", slug: "hair-styling" },
    { title: "Personalised Robes", slug: "personalised-robes" },
    { title: "Prosecco Reception", slug: "prosecco-reception" },
    { title: "Afternoon Tea", slug: "afternoon-tea" },
    { title: "BBQ Catering", slug: "bbq-catering" },
    { title: "Pizza Making Class", slug: "pizza-making-class" },
    { title: "Bottomless Brunch", slug: "bottomless-brunch" },
    { title: "Gin Tasting", slug: "gin-tasting" },
    { title: "Wine Tasting", slug: "wine-tasting" },
    { title: "Flower Crown Making", slug: "flower-crown-making" },
    { title: "Dance Class", slug: "dance-class" },
    { title: "Karaoke Night", slug: "karaoke-night" },
    { title: "Yoga Session", slug: "yoga-session" },
    { title: "Photography Package", slug: "photography-package" },
    { title: "DJ Entertainment", slug: "dj-entertainment" },
    { title: "Games & Activities Pack", slug: "games-activities-pack" },
    { title: "Decorations & Balloons", slug: "decorations-balloons" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-md"
        } z-50`}
      >
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center relative z-[60] flex-shrink-0 -ml-2"
            >
                <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/stacked_logo-1760785640378.jpg"
                    alt="Group Escape Houses"
                    width={160}
                    height={100}
                    className="h-20 w-auto"
                    priority
                  />
              </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
              {/* Properties Dropdown */}
              <div
                className="relative flex-1 flex justify-center px-1"
                onMouseEnter={() => setIsHousesOpen(true)}
                onMouseLeave={() => setIsHousesOpen(false)}
              >
                <button
                  className="text-[14px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group flex items-center gap-1.5 py-7 whitespace-nowrap"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Properties
                  <ChevronDown className="w-4 h-4" />
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </button>

                {/* Dropdown Menu */}
                {isHousesOpen && (
                  <div className="absolute top-full left-0 w-[640px] bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <div className="grid grid-cols-2 gap-10">
                      <div>
                        <h3 className="text-sm font-semibold mb-4 text-[var(--color-accent-sage)] uppercase tracking-wide">
                          House Styles
                        </h3>
                        <ul className="space-y-2.5">
                          {houseStyles.map((style) => (
                            <li key={style.slug}>
                              <Link
                                href={`/house-styles/${style.slug}`}
                                className="text-[15px] text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors block py-1.5"
                              >
                                {style.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold mb-4 text-[var(--color-accent-sage)] uppercase tracking-wide">
                          Must-Have Features
                        </h3>
                        <ul className="space-y-2.5">
                          {features.map((feature) => (
                            <li key={feature.slug}>
                              <Link
                                href={`/features/${feature.slug}`}
                                className="text-[15px] text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors block py-1.5"
                              >
                                {feature.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <Link
                        href="/properties"
                        className="text-sm font-semibold text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors"
                      >
                        Browse All Properties →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Occasions Dropdown */}
              <div
                className="relative flex-1 flex justify-center px-1"
                onMouseEnter={() => setIsOccasionsOpen(true)}
                onMouseLeave={() => setIsOccasionsOpen(false)}
              >
                <button
                  className="text-[14px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group flex items-center gap-1.5 py-7 whitespace-nowrap"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Occasions
                  <ChevronDown className="w-4 h-4" />
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </button>

                {/* Dropdown Menu */}
                {isOccasionsOpen && (
                  <div className="absolute top-full left-0 w-[420px] bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-semibold mb-4 text-[var(--color-accent-sage)] uppercase tracking-wide">
                      Perfect For Your Celebration
                    </h3>
                    <ul className="space-y-3">
                      {occasions.map((occasion) => (
                        <li key={occasion.slug}>
                          <Link
                            href={`/${occasion.slug}`}
                            className="group/item flex flex-col py-2 hover:bg-[var(--color-bg-secondary)] rounded-lg px-3 -mx-3 transition-all"
                          >
                            <span className="text-[15px] font-medium text-[var(--color-text-primary)] group-hover/item:text-[var(--color-accent-sage)] transition-colors">
                              {occasion.title}
                            </span>
                            <span className="text-xs text-[var(--color-neutral-dark)]">
                              {occasion.description}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <Link
                        href="/special-celebrations"
                        className="text-sm font-semibold text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors"
                      >
                        View All Occasions →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Experiences Dropdown */}
              <div
                className="relative flex-1 flex justify-center px-1"
                onMouseEnter={() => setIsExperiencesOpen(true)}
                onMouseLeave={() => setIsExperiencesOpen(false)}
              >
                <button
                  className="text-[14px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group flex items-center gap-1.5 py-7 whitespace-nowrap"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Experiences
                  <ChevronDown className="w-4 h-4" />
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </button>

                {/* Dropdown Menu */}
                {isExperiencesOpen && (
                  <div className="absolute top-full left-0 w-[480px] bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-semibold mb-4 text-[var(--color-accent-sage)] uppercase tracking-wide">
                      Add To Your Stay
                    </h3>
                    <div className="grid grid-cols-2 gap-x-6 max-h-[420px] overflow-y-auto pr-2 scrollbar-hide">
                      <ul className="space-y-2.5">
                        {experiences.slice(0, Math.ceil(experiences.length / 2)).map((experience) => (
                          <li key={experience.slug}>
                            <Link
                              href={`/experiences/${experience.slug}`}
                              className="text-[14px] text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors block py-1.5"
                            >
                              {experience.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-2.5">
                        {experiences.slice(Math.ceil(experiences.length / 2)).map((experience) => (
                          <li key={experience.slug}>
                            <Link
                              href={`/experiences/${experience.slug}`}
                              className="text-[14px] text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors block py-1.5"
                            >
                              {experience.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <Link
                        href="/experiences"
                        className="text-sm font-semibold text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors"
                      >
                        View All Experiences →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Destinations Dropdown */}
              <div
                className="relative flex-1 flex justify-center px-1"
                onMouseEnter={() => setIsDestinationsOpen(true)}
                onMouseLeave={() => setIsDestinationsOpen(false)}
              >
                <button
                  className="text-[14px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group flex items-center gap-1.5 py-7 whitespace-nowrap"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Destinations
                  <ChevronDown className="w-4 h-4" />
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </button>

                {/* Dropdown Menu */}
                {isDestinationsOpen && (
                  <div className="absolute top-full left-0 w-[320px] bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                    <h3 className="text-sm font-semibold mb-4 text-[var(--color-accent-sage)] uppercase tracking-wide">
                      Popular Destinations
                    </h3>
                    <ul className="space-y-2.5">
                      {destinations.map((destination) => (
                        <li key={destination.slug}>
                          <Link
                            href={`/destinations/${destination.slug}`}
                            className="text-[15px] text-[var(--color-neutral-dark)] hover:text-[var(--color-accent-sage)] transition-colors block py-1.5"
                          >
                            {destination.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <Link
                        href="/destinations"
                        className="text-sm font-semibold text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors"
                      >
                        See all locations →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* How It Works */}
              <Link
                href="/how-it-works"
                className="text-[14px] font-medium hover:text-[var(--color-accent-sage)] transition-colors relative group py-7 flex-1 flex justify-center px-2 whitespace-nowrap"
                style={{ fontFamily: "var(--font-body)" }}
              >
                How It Works
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-sage)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
              </Link>

              {/* List Your Property */}
              <Link
                href="/register-your-property"
                className="text-[14px] font-semibold text-[var(--color-accent-sage)] hover:text-[var(--color-accent-gold)] transition-colors relative group py-7 flex-1 flex justify-center px-2 whitespace-nowrap"
                style={{ fontFamily: "var(--font-body)" }}
              >
                List Your Property
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-[var(--color-accent-gold)] transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
              </Link>
            </nav>

            {/* Auth & CTA Buttons - Desktop */}
            <div className="hidden lg:flex items-center gap-4 ml-auto flex-shrink-0">
              <a
                href="tel:+441273569301"
                className="group flex items-center gap-2 px-4 py-2 bg-[var(--color-accent-sage)]/10 hover:bg-[var(--color-accent-sage)] rounded-xl transition-all duration-200 border border-[var(--color-accent-sage)]/20"
                aria-label="Call us at 01273 569301"
              >
                <Phone className="w-4 h-4 text-[var(--color-accent-sage)] group-hover:text-white" />
                <span className="text-sm font-medium text-[var(--color-accent-sage)] group-hover:text-white">
                  01273 569301
                </span>
              </a>
              
              {isPending ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : isInitialized && session?.user ? (
                <>
                  {session.user.role === "guest" && (
                    <Link
                      href="/account/dashboard"
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group"
                      title="Saved Items"
                    >
                      <Heart className="w-5 h-5 text-[var(--color-accent-sage)]" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></span>
                    </Link>
                  )}
                  <div className="flex items-center gap-3">
                      <Link
                        href={session.user.role === "owner" ? "/owner-dashboard" : "/account/dashboard"}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-secondary)] rounded-xl hover:bg-gray-100 transition-all"
                      >
                        <UserIcon className="w-4 h-4 text-[var(--color-accent-sage)]" />
                        <span className="text-sm font-medium text-[var(--color-text-primary)]">
                          {session.user.role === "owner" ? "Owner Dashboard" : "My Account"}
                        </span>
                      </Link>
                    <button
                      onClick={handleSignOut}
                      className="p-2 hover:text-red-600 transition-colors"
                      title="Sign Out"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
                  ) : (
                    <>
                      <div className="relative group">
                        <button
                          className="text-[14px] font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent-sage)] transition-colors px-4 py-2 flex items-center gap-1"
                        >
                          Login
                          <ChevronDown className="w-4 h-4" />
                        </button>
                          <div className="absolute top-full right-0 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                              <button
                                  onClick={() => {
                                    router.push("/login");
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-gray-50 hover:text-[var(--color-accent-sage)] transition-colors"
                                >
                                  Customer Login
                                </button>
                                <Link
                                  href="/owner-login"
                                  className="block w-full text-left px-4 py-2 text-sm text-[var(--color-text-primary)] hover:bg-gray-50 hover:text-[var(--color-accent-sage)] transition-colors"
                                >
                                  Owner Login
                                </Link>
                          </div>
                      </div>
                      <Button
                        asChild
                        className="rounded-xl px-6 py-2 text-white font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                        style={{
                          background: "var(--color-accent-gold)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        <Link href="/account/guest/sign-up">Sign Up</Link>
                      </Button>
                    </>
                  )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-3 min-h-[48px] min-w-[48px] flex items-center justify-center gap-2 relative z-[60]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
                <span className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  {isMobileMenuOpen ? "Close" : "Menu"}
                </span>
              </button>
            </div>
          </div>
        </header>
    
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          session={session}
          isPending={isPending}
          onSignOut={handleSignOut}
          houseStyles={houseStyles}
          features={features}
          destinations={destinations}
          occasions={occasions}
          experiences={experiences}
        />

        <SignInModal 
          isOpen={isSignInModalOpen} 
          onOpenChange={setIsSignInModalOpen} 
        />
    </>
  );
}
