import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-6">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <h1 
            className="text-[120px] md:text-[180px] font-bold leading-none mb-4"
            style={{ 
              fontFamily: "var(--font-display)",
              color: "var(--color-accent-sage)"
            }}
          >
            404
          </h1>
          <h2 
            className="text-3xl md:text-4xl mb-4"
            style={{ 
              fontFamily: "var(--font-display)",
              color: "var(--color-text-primary)"
            }}
          >
            Page Not Found
          </h2>
          <p className="text-xl text-[var(--color-neutral-dark)] mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            asChild
            size="lg"
            className="rounded-2xl px-10 py-6 text-lg font-medium"
            style={{
              background: "var(--color-accent-sage)",
              color: "white",
            }}
          >
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-2xl px-10 py-6 text-lg font-medium border-2"
            style={{
              borderColor: "var(--color-accent-gold)",
              color: "var(--color-text-primary)",
            }}
          >
            <Link href="/properties">
              <Search className="w-5 h-5 mr-2" />
              Browse Properties
            </Link>
          </Button>
        </div>

        <div className="pt-8 border-t border-[var(--color-accent-gold)]/30">
          <p className="text-[var(--color-neutral-dark)] mb-4">
            Need help finding something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link 
              href="/properties" 
              className="text-[var(--color-accent-sage)] hover:underline"
            >
              Properties
            </Link>
            <Link 
              href="/experiences" 
              className="text-[var(--color-accent-sage)] hover:underline"
            >
              Experiences
            </Link>
            <Link 
              href="/destinations" 
              className="text-[var(--color-accent-sage)] hover:underline"
            >
              Destinations
            </Link>
            <Link 
              href="/how-it-works" 
              className="text-[var(--color-accent-sage)] hover:underline"
            >
              How It Works
            </Link>
            <Link 
              href="/contact" 
              className="text-[var(--color-accent-sage)] hover:underline"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}