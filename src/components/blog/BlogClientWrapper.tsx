"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin } from "lucide-react";

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  content: string;
  slug: string;
}

interface BlogClientWrapperProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogClientWrapper({ post, relatedPosts }: BlogClientWrapperProps) {
  return (
    <article className="pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Breadcrumbs & Back */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-[var(--color-accent-sage)] hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-accent-sage)]/10 text-[var(--color-accent-sage)] text-sm font-semibold mb-4">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--color-neutral-dark)]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>5 min read</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-16 shadow-xl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-[var(--color-text-primary)] prose-p:text-[var(--color-neutral-dark)] prose-a:text-[var(--color-accent-sage)] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Share Section */}
            <div className="mt-16 pt-8 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-[var(--color-text-primary)]">Share this post</div>
                <div className="flex gap-4">
                  <button className="p-2 rounded-full bg-gray-50 hover:bg-[var(--color-accent-pink)] hover:text-white transition-all">
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-50 hover:bg-[var(--color-accent-pink)] hover:text-white transition-all">
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-50 hover:bg-[var(--color-accent-pink)] hover:text-white transition-all">
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-50 hover:bg-[var(--color-accent-pink)] hover:text-white transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-12">
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-display)" }}>
                    Related Posts
                  </h3>
                  <div className="space-y-8">
                    {relatedPosts.map((rPost) => (
                      <Link 
                        key={rPost.slug} 
                        href={`/blog/${rPost.slug}`}
                        className="group flex gap-4"
                      >
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={rPost.image}
                            alt={rPost.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm line-clamp-2 group-hover:text-[var(--color-accent-sage)] transition-colors mb-2">
                            {rPost.title}
                          </h4>
                          <span className="text-xs text-[var(--color-neutral-dark)]">{rPost.date}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[var(--color-accent-pink)] to-[var(--color-accent-pink)]/80 text-white">
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Stay Inspired
                </h3>
                <p className="text-sm opacity-90 mb-6">
                  Get the latest hen party ideas, destination guides, and luxury house reveals straight to your inbox.
                </p>
                <form className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Email address"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30"
                  />
                  <button className="w-full px-4 py-3 rounded-xl bg-white text-[var(--color-accent-pink)] font-bold hover:bg-gray-50 transition-colors">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
