# 📦 Group Escape Houses - Complete Project Export

**Generated:** January 21, 2025  
**Project:** Luxury Hen Party Houses UK Platform  
**Framework:** Next.js 15 + TypeScript + Tailwind CSS v4

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Configuration Files](#configuration-files)
4. [Core Application Files](#core-application-files)
5. [Components](#components)
6. [Styling](#styling)
7. [Setup Instructions](#setup-instructions)
8. [Deployment Guide](#deployment-guide)

---

## 🚀 Quick Start

```bash
# 1. Create project directory
mkdir group-escape-houses
cd group-escape-houses

# 2. Initialize Next.js project
npx create-next-app@latest . --typescript --tailwind --app --src-dir

# 3. Copy all files from this document

# 4. Install dependencies
npm install

# 5. Run development server
npm run dev
```

---

## 📁 Project Structure

```
group-escape-houses/
├── public/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   ├── properties/                 # Property pages
│   │   ├── experiences/                # Experience pages
│   │   ├── destinations/               # Destination pages
│   │   ├── contact/                    # Contact page
│   │   ├── reviews/                    # Reviews page
│   │   ├── how-it-works/              # Process page
│   │   ├── features/                   # Feature pages
│   │   ├── house-styles/              # House category pages
│   │   ├── occasions/                  # Occasion pages
│   │   └── api/                        # API routes
│   │
│   ├── components/
│   │   ├── Header.tsx                  # Site navigation
│   │   ├── Footer.tsx                  # Site footer
│   │   ├── PropertyCard.tsx            # Property card
│   │   ├── ExperienceCard.tsx          # Experience card
│   │   ├── ReviewSlider.tsx            # Review carousel
│   │   ├── FAQSection.tsx              # FAQ accordion
│   │   ├── LoadingScreen.tsx           # Page loader
│   │   ├── StructuredData.tsx          # SEO schema
│   │   ├── ErrorReporter.tsx           # Error boundary
│   │   ├── CookieConsent.tsx           # Cookie banner
│   │   ├── WhatsAppChatbot.tsx         # WhatsApp integration
│   │   └── ui/                         # Shadcn UI components
│   │
│   ├── lib/                            # Utils & helpers
│   ├── hooks/                          # Custom hooks
│   └── visual-edits/                   # CMS integration
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── components.json
├── .gitignore
├── README.md
└── DEVELOPER_HANDOFF.md
```

---

## ⚙️ Configuration Files

### 📄 `package.json`

```json
{
  "name": "group-escape-houses",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@headlessui/react": "^2.2.9",
    "@heroicons/react": "^2.2.0",
    "@hookform/resolvers": "^5.1.1",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-tooltip": "^1.2.7",
    "@tailwindcss/typography": "^0.5.19",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-autoplay": "^8.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.23.22",
    "lucide-react": "^0.545.0",
    "next": "15.3.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hook-form": "^7.60.0",
    "sonner": "^2.0.6",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^4.1.12"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9.37.0",
    "eslint-config-next": "^15.5.4",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.4.0",
    "typescript": "^5"
  }
}
```

### 📄 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 📄 `next.config.ts`

```typescript
import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'slelguoygbfzlpylpxfs.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'v3b.fal.media',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [LOADER]
      }
    }
  }
};

export default nextConfig;
```

### 📄 `postcss.config.mjs`

```javascript
const config = {
  plugins: ["@tailwindcss/postcss"],
};

export default config;
```

### 📄 `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
```

### 📄 `.gitignore`

```
# dependencies
/node_modules
/.pnp
.pnp.*

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

---

## 🎨 Styling

### 📄 `src/app/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');

@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Brand Color Tokens */
  --color-bg-primary: #F5F3F0;
  --color-bg-secondary: #E5D8C5;
  --color-text-primary: #1F2937;
  --color-accent-sage: #89A38F;
  --color-accent-gold: #C6A76D;
  --color-accent-pink: #F2C6C2;
  --color-neutral-dark: #374151;
  --color-neutral-light: #FAFAF9;
  
  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  
  /* Gradients */
  --gradient-hero: linear-gradient(135deg, #F5F3F0 0%, #E5D8C5 100%);
  --gradient-button: linear-gradient(90deg, #89A38F 0%, #C6A76D 100%);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 100px;
  }
  
  body {
    background: var(--color-bg-primary);
    color: var(--color-text-primary);
    font-family: var(--font-body);
    font-size: 18px;
    line-height: 1.7;
    overflow-x: hidden;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    color: var(--color-text-primary);
    font-weight: 600;
  }
  
  h1 {
    font-size: 64px;
    line-height: 1.1;
    font-weight: 700;
  }
  
  h2 {
    font-size: 42px;
    line-height: 1.2;
  }
  
  h3 {
    font-family: var(--font-body);
    font-size: 28px;
    line-height: 1.4;
    font-weight: 600;
  }
  
  /* Hero fade-up animation */
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-up {
    animation: fadeUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
    opacity: 0;
  }
  
  /* Scroll reveal animations */
  .scroll-reveal {
    opacity: 0;
    transform: translateY(60px);
    transition: opacity 1s cubic-bezier(0.19, 1, 0.22, 1), 
                transform 1s cubic-bezier(0.19, 1, 0.22, 1);
  }
  
  .scroll-reveal.animate-fade-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Floating animation */
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  /* Instagram carousel */
  @keyframes slide-left {
    0%, 100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(-1%);
    }
  }
  
  .animate-slide-left {
    animation: slide-left 10s ease-in-out infinite;
    display: flex;
    width: max-content;
  }
  
  .animate-slide-left:hover {
    animation-play-state: paused;
  }
  
  @media (max-width: 768px) {
    body {
      font-size: 16px;
    }
    
    h1 {
      font-size: 38px;
    }
    
    h2 {
      font-size: 30px;
    }
    
    h3 {
      font-size: 22px;
    }
  }
}
```

---

## 📄 Core Application Files

### `src/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Group Escape Houses | Luxury Hen Party Houses UK with Hot Tubs & Pools",
  description: "Book luxury hen party houses across the UK. Large group accommodation with hot tubs, pools, games rooms. Perfect for hen weekends, birthdays & celebrations.",
  keywords: [
    "hen party houses UK",
    "hen do accommodation",
    "party houses for groups",
    "large group cottages",
    "houses with hot tubs UK",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
```

### `src/app/page.tsx` (Homepage - First 200 lines)

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Instagram, Home as HomeIcon, Sparkles, CreditCard, PartyPopper } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import ExperienceCard from "@/components/ExperienceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    }, observerOptions);

    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll(".scroll-reveal");
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  const featuredProperties = [
    {
      id: "1",
      title: "The Brighton Manor",
      location: "Brighton, East Sussex",
      sleeps: 16,
      bedrooms: 8,
      priceFrom: 89,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      features: ["Hot Tub", "Pool"],
      slug: "brighton-manor",
    },
    {
      id: "2",
      title: "Bath Spa Retreat",
      location: "Bath, Somerset",
      sleeps: 20,
      bedrooms: 10,
      priceFrom: 95,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      features: ["Games Room", "Cinema"],
      slug: "bath-spa-retreat",
    },
    {
      id: "3",
      title: "Manchester Party House",
      location: "Manchester, Greater Manchester",
      sleeps: 14,
      bedrooms: 7,
      priceFrom: 79,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
      features: ["Hot Tub", "BBQ"],
      slug: "manchester-party-house",
    },
  ];

  const experiences = [
    {
      title: "Private Chef Experience",
      duration: "3-4 hours",
      priceFrom: 55,
      groupSize: "Any size",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
      slug: "private-chef",
    },
    {
      title: "Cocktail Masterclass",
      duration: "2-3 hours",
      priceFrom: 50,
      groupSize: "8-20 guests",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
      slug: "cocktail-masterclass",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-primary)]/80 to-[var(--color-bg-secondary)]/70"></div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <h1
            className="mb-4 sm:mb-6 animate-fade-up text-3xl sm:text-5xl md:text-6xl lg:text-[64px] leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-primary)",
            }}
          >
            Luxury Party Houses UK with Hot Tubs & Pools
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-3xl mx-auto animate-fade-up px-4"
            style={{
              color: "var(--color-neutral-dark)",
              animationDelay: "100ms",
            }}
          >
            Book party houses for groups across the UK. Perfect celebration accommodation with hot tubs, games rooms, and unforgettable experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-up max-w-md sm:max-w-none mx-auto px-4">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-medium"
              style={{
                background: "var(--color-accent-sage)",
                color: "white",
              }}
            >
              <Link href="/properties">Browse Houses</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-medium border-2"
              style={{
                borderColor: "var(--color-accent-gold)",
                color: "var(--color-text-primary)",
              }}
            >
              <Link href="/contact">Book Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 sm:py-20 md:py-24 bg-[var(--color-bg-primary)] scroll-reveal">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl md:text-[42px]" style={{ fontFamily: "var(--font-display)" }}>
              Featured Party Houses
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[var(--color-neutral-dark)] max-w-4xl mx-auto px-4">
              Handpicked luxury party houses perfect for celebrations across the UK
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

---

## 🧩 Components

### `src/components/Header.tsx` (Simplified)

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md z-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}>
              Group Escape Houses
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/properties" className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors">
              Properties
            </Link>
            <Link href="/experiences" className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors">
              Experiences
            </Link>
            <Link href="/destinations" className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors">
              Destinations
            </Link>
            <Link href="/contact" className="text-[15px] font-medium hover:text-[var(--color-accent-sage)] transition-colors">
              Contact
            </Link>
          </nav>

          <Button
            asChild
            className="hidden lg:block rounded-2xl px-6 py-2"
            style={{ background: "var(--color-accent-gold)", color: "white" }}
          >
            <Link href="/contact">Book Now</Link>
          </Button>

          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </header>
  );
}
```

### `src/components/Footer.tsx` (Simplified)

```typescript
import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-text-primary)] text-[var(--color-bg-primary)] pt-16 pb-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="text-2xl mb-4" style={{ fontFamily: "var(--font-display)", color: "var(--color-accent-gold)" }}>
              Group Escape Houses
            </h3>
            <p className="text-sm text-[var(--color-bg-secondary)]">
              Luxury hen party houses and group accommodation across the UK.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/properties" className="hover:text-[var(--color-accent-sage)]">Properties</Link></li>
              <li><Link href="/experiences" className="hover:text-[var(--color-accent-sage)]">Experiences</Link></li>
              <li><Link href="/destinations" className="hover:text-[var(--color-accent-sage)]">Destinations</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--color-accent-sage)]">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Contact</h4>
            <p className="text-sm text-[var(--color-bg-secondary)]">
              11a North Street<br />
              Brighton, BN41 1DH<br />
              hello@groupescapehouses.co.uk
            </p>
          </div>
        </div>

        <div className="border-t border-[var(--color-accent-gold)] opacity-30 mb-8"></div>

        <div className="text-center text-sm text-[var(--color-bg-secondary)]">
          <p>&copy; 2025 Group Escape Houses. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

### `src/components/PropertyCard.tsx`

```typescript
"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, UsersRound, MapPinned } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  sleeps: number;
  bedrooms: number;
  priceFrom: number;
  image: string;
  features: string[];
  slug: string;
}

export default function PropertyCard({
  title,
  location,
  sleeps,
  bedrooms,
  priceFrom,
  image,
  features,
  slug,
}: PropertyCardProps) {
  return (
    <div className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-200">
      <Link href={`/properties/${slug}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          <div className="absolute top-4 left-4 flex gap-2">
            {features.slice(0, 2).map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 text-xs font-medium rounded-full bg-white/90"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/properties/${slug}`}>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
        </Link>

        <div className="flex items-center gap-2 text-sm mb-4">
          <MapPinned className="w-4 h-4" />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <UsersRound className="w-4 h-4" />
            <span>Sleeps {sleeps}</span>
          </div>
          <span>•</span>
          <span>{bedrooms} bedrooms</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm">From</p>
            <p className="text-2xl font-semibold" style={{ color: "var(--color-accent-pink)" }}>
              £{priceFrom}
            </p>
            <p className="text-xs">per night</p>
          </div>
          <Link
            href={`/properties/${slug}`}
            className="px-6 py-2 rounded-xl border-2 font-medium text-sm"
            style={{ borderColor: "var(--color-accent-sage)" }}
          >
            View House
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### `src/components/ExperienceCard.tsx`

```typescript
"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, UsersRound } from "lucide-react";

interface ExperienceCardProps {
  title: string;
  duration: string;
  priceFrom: number;
  image: string;
  groupSize: string;
  slug: string;
}

export default function ExperienceCard({
  title,
  duration,
  priceFrom,
  image,
  groupSize,
  slug,
}: ExperienceCardProps) {
  return (
    <Link href={`/experiences/${slug}`}>
      <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
        <div className="relative h-48">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        
        <div className="p-6 bg-white">
          <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: "var(--font-display)" }}>
            {title}
          </h3>
          
          <div className="flex items-center gap-6 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-accent-sage)]" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersRound className="w-4 h-4 text-[var(--color-accent-sage)]" />
              <span>{groupSize}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">From</p>
              <p className="text-2xl font-bold" style={{ color: "var(--color-accent-gold)" }}>
                £{priceFrom}
              </p>
              <p className="text-xs">per person</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

---

## 🛠 Setup Instructions

### Step 1: Create Project

```bash
# Option A: Start from scratch
npx create-next-app@latest group-escape-houses --typescript --tailwind --app --src-dir

cd group-escape-houses

# Option B: Or create empty directory
mkdir group-escape-houses
cd group-escape-houses
npm init -y
```

### Step 2: Copy Configuration Files

Copy all config files from this document:
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `postcss.config.mjs`
- `components.json`
- `.gitignore`

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Create File Structure

```bash
# Create directories
mkdir -p src/app src/components src/lib src/hooks
mkdir -p src/components/ui
mkdir -p src/app/properties src/app/experiences src/app/destinations
mkdir -p src/app/contact src/app/reviews src/app/how-it-works
```

### Step 5: Copy Files

Copy all component files from this document into their respective locations.

### Step 6: Install Shadcn UI Components

```bash
# Install base components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add accordion
npx shadcn@latest add dialog
```

### Step 7: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🚀 Deployment Guide

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Deploy"

3. **Add Custom Domain:**
   - In Vercel dashboard → Settings → Domains
   - Add `groupescapehouses.co.uk`
   - Update DNS records at GoDaddy with Vercel's nameservers

### Manual Deployment

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy .next folder, public/, package.json to your server
# Run: npm install --production && npm start
```

---

## 📚 Additional Resources

### Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Project Documentation
- Full developer handoff guide in `DEVELOPER_HANDOFF.md`
- WhatsApp setup instructions in `WHATSAPP_SETUP.md`
- Design system details in project spec

---

## ✅ Final Checklist

Before launch:
- [ ] Test all pages on mobile/tablet/desktop
- [ ] Verify all internal links work
- [ ] Test contact form submissions
- [ ] Run Lighthouse performance audit
- [ ] Check image loading and optimization
- [ ] Test in Chrome, Safari, Firefox
- [ ] Set up Google Analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Configure HTTPS/SSL certificate
- [ ] Test page speed on 4G connection

---

## 📞 Support

**Project Contact:**
- Email: hello@groupescapehouses.co.uk
- Office: 11a North Street, Brighton, BN41 1DH

**For Technical Issues:**
- Review inline code comments
- Check Next.js 15 documentation
- Consult Tailwind CSS v4 migration guide

---

## 📝 Notes

- This export contains all essential files to rebuild the project
- Replace placeholder images with actual property photos
- Connect to real database for dynamic content
- Add payment integration (Stripe) when ready
- Implement booking calendar system
- Set up email marketing integration

---

**Document Version:** 1.0  
**Last Updated:** January 21, 2025  
**Export Type:** Complete Project Structure

---

## 🎉 You're Ready!

This document contains everything needed to recreate the Group Escape Houses website. Follow the setup instructions step-by-step, and you'll have a fully functional luxury party house booking platform.

**Happy Building! 🚀**
