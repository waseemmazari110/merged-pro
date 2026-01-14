"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UKServiceSchema from "@/components/UKServiceSchema";
import Link from "next/link";
import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "10 Hen Party Ideas That Aren't the Usual Spa Day",
      excerpt: "Looking for something different? From cocktail making to life drawing, here are our favourite alternative hen party activities that your group will love.",
      category: "Hen Do Ideas",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-hen-party-ac-2ed8f30b-20251018105832.jpg",
      date: "15 Jan 2025",
      slug: "alternative-hen-party-ideas",
      path: "/blog/alternative-hen-party-ideas"
    },
    {
      id: 6,
      title: "Your Complete Hen Party Planning Checklist",
      excerpt: "From booking the house to coordinating activities, this step-by-step checklist ensures nothing gets forgotten when planning the perfect hen weekend.",
      category: "Planning Tips",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-planning-che-9704c7d1-20251018105913.jpg",
      date: "29 Dec 2024",
      slug: "hen-party-checklist",
      path: "/blog/hen-party-checklist"
    },

    {
      id: 2,
      title: "The Ultimate Brighton Hen Do Guide: Where to Stay, Eat & Party",
      excerpt: "Brighton is the UK's hen party capital for a reason. Our complete guide covers the best houses, restaurants, bars, and activities for an unforgettable weekend.",
      category: "City Guides",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-brighton-uk--0e8a0dba-20251018105838.jpg",
      date: "12 Jan 2025",
      slug: "brighton-hen-do-guide",
    },
    {
      id: 3,
      title: "How to Split Costs Fairly on a Hen Weekend",
      excerpt: "Money can be awkward, but it doesn't have to be. Our practical tips for managing group expenses, deposits, and add-ons without the drama.",
      category: "Planning Tips",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-showing-split-c-189baecf-20251018105904.jpg",
      date: "8 Jan 2025",
      slug: "split-costs-hen-weekend",
    },
    {
      id: 4,
      title: "House Spotlight: Inside The Brighton Manor",
      excerpt: "Take a tour of one of our most popular properties. With space for 16, a hot tub, games room, and walking distance to the beach, it's perfect for hen parties.",
      category: "House Spotlights",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-luxury-holid-f27f8e6d-20251018105853.jpg",
      date: "5 Jan 2025",
      slug: "brighton-manor-spotlight",
    },
    {
      id: 5,
      title: "Bath vs Brighton: Which City for Your Hen Weekend?",
      excerpt: "Can't decide between these two amazing cities? We break down the pros and cons of Bath and Brighton to help you choose the perfect destination.",
      category: "City Guides",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-women-friend-01b63e10-20251018105846.jpg",
      date: "2 Jan 2025",
      slug: "bath-vs-brighton",
    },
    {
      id: 6,
      title: "Your Complete Hen Party Planning Checklist",
      excerpt: "From booking the house to coordinating activities, this step-by-step checklist ensures nothing gets forgotten when planning the perfect hen weekend.",
      category: "Planning Tips",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/professional-stock-photo-of-planning-che-9704c7d1-20251018105913.jpg",
      date: "29 Dec 2024",
      slug: "hen-party-checklist",
    },
  ];

  const categories = [
    "All Posts",
    "Hen Do Ideas",
    "City Guides",
    "Planning Tips",
    "House Spotlights",
  ];

  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "How often do you publish new blog posts?",
      answer: "We publish new planning tips, destination guides, and hen party inspiration at least twice a week. Subscribe to our newsletter to get the latest posts delivered to your inbox."
    },
    {
      question: "Can I request a specific topic or destination guide?",
      answer: "Absolutely! We love hearing what our readers want to know. Contact us with your suggestions and we'll do our best to cover topics that help you plan the perfect hen weekend."
    },
    {
      question: "Are the experiences and venues you mention available to book?",
      answer: "Yes! Many of the experiences, venues, and properties featured in our blog posts can be booked directly through our platform or via our partner network. Look for booking links within each article."
    },
    {
      question: "Can I share your articles with my hen party group?",
      answer: "Please do! All our content is designed to be shared. Use the share buttons on each post or copy the URL to send to your group chat."
    },
    {
      question: "Do you accept guest posts or contributions?",
      answer: "We're always interested in authentic hen party stories and destination recommendations. If you have a unique experience or expert knowledge to share, get in touch with our editorial team."
    }
  ];

  return (
    <div className="min-h-screen">
      <UKServiceSchema 
        type="breadcrumb" 
        data={{
          breadcrumbs: [
            { name: "Home", url: "/" },
            { name: "Blog", url: "/blog" }
          ]
        }}
      />
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <h1 className="mb-6" style={{ fontFamily: "var(--font-display)" }}>
            Planning Tips & Inspiration
          </h1>
          <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl">
            Everything you need to plan the perfect hen weekend, from destination guides to party ideas
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white sticky top-20 z-10 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border-2 border-[var(--color-accent-sage)] text-[var(--color-accent-sage)] hover:bg-[var(--color-accent-sage)] hover:text-white transition-colors font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={post.path || `/inspiration/${post.slug}`}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                  {/* Image */}
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <div
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                      style={{
                        background: "var(--color-accent-sage)",
                        color: "white",
                      }}
                    >
                      {post.category}
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl font-semibold mb-3 group-hover:text-[var(--color-accent-sage)] transition-colors"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-[var(--color-neutral-dark)] mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-dark)]">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            <button className="px-4 py-2 rounded-xl bg-[var(--color-accent-sage)] text-white font-medium">
              1
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[var(--color-bg-primary)]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-[var(--color-neutral-dark)] max-w-2xl mx-auto">
              Everything you need to know about our planning tips and inspiration
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-[var(--color-accent-gold)]/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg bg-white"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-[var(--color-bg-primary)]"
                >
                  <h3
                    className="text-lg font-semibold pr-4"
                    style={{ fontFamily: "var(--font-body)", color: "var(--color-text-primary)" }}
                  >
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                    style={{ color: "var(--color-accent-gold)" }}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-6 pb-5 text-[var(--color-neutral-dark)]">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-[var(--color-neutral-dark)] mb-4">
              Looking for more hen party inspiration?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-lg font-semibold hover:underline"
              style={{ color: "var(--color-accent-gold)" }}
            >
              Get in touch with our team
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}