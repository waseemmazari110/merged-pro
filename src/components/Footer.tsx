import Link from "next/link";
import { Instagram, Facebook, Twitter, Youtube, Linkedin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Logo and Tagline */}
            <div className="col-span-1">
              <h3
                className="text-2xl mb-4"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-gold)" }}
              >
                Group Escape Houses
              </h3>
              <p className="text-sm text-[var(--color-bg-secondary)] leading-relaxed mb-4">
                Exceptional large group accommodation across the UK with premium facilities and outstanding service.
              </p>
            <Link href="/our-story" className="text-sm hover:text-[var(--color-accent-sage)] transition-colors">
              Read our story →
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="hover:text-[var(--color-accent-sage)] transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="hover:text-[var(--color-accent-sage)] transition-colors">
                  Activities & Services
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-[var(--color-accent-sage)] transition-colors">
                  UK Destinations
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[var(--color-accent-sage)] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-[var(--color-accent-sage)] transition-colors">
                  Guest Reviews
                </Link>
              </li>
                <li>
                  <Link href="/inspiration" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Inspiration
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Guides & Resources
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Contact & Enquiries
                  </Link>
                </li>
                <li>
                  <a href="https://butlersinthebuff.co.uk/" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Butlers in the Buff UK
                  </a>
                </li>
                <li>
                  <a href="https://butlerswithbums.com/" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Butlers with Bums
                  </a>
                </li>
              </ul>
            </div>

            {/* Property Owners */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Property Owners</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/why-list-with-escape-houses" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Why List With Us?
                  </Link>
                </li>
                <li>
                  <Link href="/advertise-with-us" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    List Your Property
                  </Link>
                </li>
                <li>
                  <Link href="/advertise-with-us#pricing" className="hover:text-[var(--color-accent-sage)] transition-colors">
                    Fixed Fee Pricing
                  </Link>
                </li>
                  <li>
                    <Link href="/login" className="hover:text-[var(--color-accent-sage)] transition-colors">
                      Customer Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/owner-login" className="hover:text-[var(--color-accent-sage)] transition-colors">
                      Owner Login
                    </Link>
                  </li>

              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact Us</h4>
              <ul className="space-y-3 text-sm text-[var(--color-bg-secondary)] mb-6">
                <li>Office, 11a North Street</li>
                <li>Brighton</li>
                <li>BN41 1DH</li>
                <li className="pt-2">
                  <a
                    href="tel:+441273569301"
                    className="hover:text-[var(--color-accent-sage)] transition-colors flex items-center gap-2 font-medium"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>01273 569301</span>
                  </a>
                </li>
                  <li>
                    <a
                      href="mailto:hello@groupescapehouses.co.uk"
                      className="hover:text-[var(--color-accent-sage)] transition-colors block"
                    >
                      hello@groupescapehouses.co.uk
                    </a>
                  </li>

              </ul>

              <h4 className="font-semibold mb-4 text-white">Top Destinations</h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <li><Link href="/destinations/bath" className="hover:text-[var(--color-accent-sage)]">Bath</Link></li>
                <li><Link href="/destinations/brighton" className="hover:text-[var(--color-accent-sage)]">Brighton</Link></li>
                <li><Link href="/destinations/cotswolds" className="hover:text-[var(--color-accent-sage)]">Cotswolds</Link></li>
                <li><Link href="/destinations/lake-district" className="hover:text-[var(--color-accent-sage)]">Lake District</Link></li>
                <li><Link href="/destinations/london" className="hover:text-[var(--color-accent-sage)]">London</Link></li>
                <li><Link href="/destinations/york" className="hover:text-[var(--color-accent-sage)]">York</Link></li>
              </ul>
            </div>

              {/* Occasions & Features */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Popular Occasions</h4>
                <ul className="space-y-2 text-sm mb-6">
                  <li><Link href="/hen-party-houses" className="hover:text-[var(--color-accent-sage)] transition-colors">Hen Party Houses</Link></li>
                  <li><Link href="/special-celebrations" className="hover:text-[var(--color-accent-sage)] transition-colors">Special Celebrations</Link></li>
                  <li><Link href="/weddings" className="hover:text-[var(--color-accent-sage)] transition-colors">Wedding Venues</Link></li>
                  <li><Link href="/weekend-breaks" className="hover:text-[var(--color-accent-sage)] transition-colors">Weekend Breaks</Link></li>
                  <li><Link href="/christmas" className="hover:text-[var(--color-accent-sage)] transition-colors">Christmas Houses</Link></li>
                  <li><Link href="/new-year" className="hover:text-[var(--color-accent-sage)] transition-colors">New Year Eve Party Houses</Link></li>
                </ul>

                  <h4 className="font-semibold mb-4 text-white">House Features</h4>
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    <li><Link href="/features/hot-tub" className="hover:text-[var(--color-accent-sage)]">Hot Tub</Link></li>
                    <li><Link href="/features/swimming-pool" className="hover:text-[var(--color-accent-sage)]">Swimming Pool</Link></li>
                    <li><Link href="/features/indoor-swimming-pool" className="hover:text-[var(--color-accent-sage)]">Indoor Pool</Link></li>
                    <li><Link href="/features/games-room" className="hover:text-[var(--color-accent-sage)]">Games Room</Link></li>
                    <li><Link href="/features/cinema-room" className="hover:text-[var(--color-accent-sage)]">Cinema Room</Link></li>
                    <li><Link href="/features/tennis-court" className="hover:text-[var(--color-accent-sage)]">Tennis Court</Link></li>
                    <li><Link href="/features/direct-beach-access" className="hover:text-[var(--color-accent-sage)]">Beach Access</Link></li>
                    <li><Link href="/features/ev-charging" className="hover:text-[var(--color-accent-sage)]">EV Charging</Link></li>
                    <li><Link href="/features/fishing-lake" className="hover:text-[var(--color-accent-sage)]">Fishing Lake</Link></li>
                    <li><Link href="/features/ground-floor-bedroom" className="hover:text-[var(--color-accent-sage)]">Ground Floor Bed</Link></li>
                  </ul>
                </div>


        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-accent-gold)] opacity-30 mb-8"></div>

          {/* Bottom Bar */}
          <div className="border-t border-[var(--color-accent-gold)] opacity-30 mb-8 pt-8 text-center max-w-4xl mx-auto">
            <p className="text-xs text-[var(--color-bg-secondary)] mb-6 italic">
              Group Escape Houses is an advertising platform. Bookings, payments and contracts are handled directly between guests and property owners.
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--color-bg-secondary)]">
          <p>&copy; 2025 Group Escape Houses. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/terms" className="hover:text-[var(--color-accent-sage)] transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/booking-terms" className="hover:text-[var(--color-accent-sage)] transition-colors">
              Booking Terms
            </Link>
            <Link href="/privacy" className="hover:text-[var(--color-accent-sage)] transition-colors">
              Privacy & GDPR
            </Link>
            <Link href="/our-story" className="hover:text-[var(--color-accent-sage)] transition-colors">
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}