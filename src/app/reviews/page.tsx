import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import UKServiceSchema from "@/components/UKServiceSchema";

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      property: "The Brighton Manor",
      rating: 5,
      date: "December 2024",
      comment: "Absolutely perfect for our hen weekend! The hot tub was amazing, the house was spotless, and the location was ideal for getting into Brighton. The cocktail class we booked was such a laugh. Can't recommend enough!",
    },
    {
      id: 2,
      name: "Emma L.",
      property: "Bath Spa Retreat",
      rating: 5,
      date: "November 2024",
      comment: "Stunning property with so much space for our group of 18. The games room kept us entertained, and the cinema was perfect for a cosy night in. Group Escape Houses made everything so easy to organise.",
    },
    {
      id: 3,
      name: "Lucy R.",
      property: "York Georgian Townhouse",
      rating: 5,
      date: "October 2024",
      comment: "This house exceeded all expectations. Beautiful period features, modern amenities, and the most incredible hot tub overlooking the garden. The team were so helpful with our booking and answered all our questions quickly.",
    },
    {
      id: 4,
      name: "Jessica T.",
      property: "Manchester Party House",
      rating: 5,
      date: "October 2024",
      comment: "Perfect location for a Manchester hen do. We could walk to the Northern Quarter in 10 minutes. The house was exactly as pictured, and the private chef we booked cooked us the most amazing meal. Highly recommend!",
    },
    {
      id: 5,
      name: "Hannah W.",
      property: "Bournemouth Beach House",
      rating: 5,
      date: "September 2024",
      comment: "We had the best weekend here! The pool was incredible, and being so close to the beach made it extra special. The butlers in the buff we booked were hilarious and made the weekend unforgettable. Thank you Group Escape Houses!",
    },
    {
      id: 6,
      name: "Olivia P.",
      property: "Cardiff City Penthouse",
      rating: 5,
      date: "September 2024",
      comment: "Wow! The views from this penthouse are breathtaking. Right in the heart of Cardiff, perfect for exploring. The roof terrace was our favourite spot. Communication from the team was excellent throughout.",
    },
    {
      id: 7,
      name: "Chloe D.",
      property: "The Brighton Manor",
      rating: 5,
      date: "August 2024",
      comment: "Second time booking through Group Escape Houses and they never disappoint. The house was immaculate, check-in was seamless, and the life drawing class we organised was the highlight of the weekend!",
    },
    {
      id: 8,
      name: "Sophie K.",
      property: "Bath Spa Retreat",
      rating: 5,
      date: "August 2024",
      comment: "This property is a dream! So much space, beautifully decorated, and the hot tub was used every single day. The booking process was straightforward, and the deposit was returned within a week. Five stars!",
    },
    {
      id: 9,
      name: "Amy B.",
      property: "Manchester Party House",
      rating: 5,
      date: "July 2024",
      comment: "Perfect for our group of 14. The kitchen was massive which made cooking together so easy. The games room was brilliant entertainment. Would definitely book again for our next celebration.",
    },
    {
      id: 10,
      name: "Katie H.",
      property: "York Georgian Townhouse",
      rating: 5,
      date: "July 2024",
      comment: "Absolutely loved this house! The period features gave it so much character, and York is such a beautiful city to explore. The customer service from Group Escape Houses was outstanding from start to finish.",
    },
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema
        type="breadcrumb"
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Reviews", url: "/reviews" }
          ]
        }}
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h1 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
            3,000+ Five Star Reviews
          </h1>
          <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
            See what our guests say about their celebrations with Group Escape Houses
          </p>
          
          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-8 h-8 fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]"
              />
            ))}
            <span className="text-2xl font-semibold ml-2">5.0</span>
            <span className="text-lg text-[var(--color-neutral-dark)] ml-2">
              from 3,247 reviews
            </span>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[var(--color-bg-primary)] rounded-2xl p-8 shadow-md"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[var(--color-accent-gold)] text-[var(--color-accent-gold)]"
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-[var(--color-neutral-dark)] mb-6 leading-relaxed">
                  "{review.comment}"
                </p>

                {/* Author & Property */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-[var(--color-text-primary)]">{review.name}</p>
                  <p className="text-sm text-[var(--color-neutral-dark)]">{review.property}</p>
                  <p className="text-sm text-[var(--color-neutral-dark)] mt-1">{review.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="rounded-2xl px-10 py-6 font-medium"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              Load More Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* Submit Review CTA */}
      <section className="py-24 bg-[var(--color-bg-secondary)]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Stayed With Us?
          </h2>
          <p className="text-xl text-[var(--color-neutral-dark)] mb-8">
            We'd love to hear about your experience. Share your review and help future guests plan their perfect celebration.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-2xl px-10 py-6 text-lg font-medium transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
            style={{
              background: "var(--color-accent-sage)",
              color: "white",
            }}
          >
            <Link href="/contact">Submit a Review</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}