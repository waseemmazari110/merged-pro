# Group Escape Houses - Developer Handoff Guide

## 🎯 Project Overview

**Group Escape Houses** is a luxury party house booking platform for UK group celebrations. The site showcases premium properties with hot tubs, pools, and games rooms, plus add-on experiences like cocktail classes and private chefs.

**Live Site Goal:** groupescapehouses.co.uk (currently hosted via GoDaddy)

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn/UI
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Package Manager:** npm

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Homepage
│   ├── properties/              # Property listings & detail pages
│   ├── experiences/             # Experience listings
│   ├── destinations/            # City guides
│   ├── contact/                 # Contact form
│   ├── reviews/                 # Customer reviews
│   ├── how-it-works/           # Booking process
│   ├── features/               # Feature pages (hot-tub, pool, etc)
│   ├── house-styles/           # House category pages
│   ├── occasions/              # Occasion-specific pages
│   └── api/                    # API routes (chatbot, WhatsApp webhook)
│
├── components/
│   ├── Header.tsx              # Site navigation
│   ├── Footer.tsx              # Site footer
│   ├── PropertyCard.tsx        # Property card component
│   ├── ExperienceCard.tsx      # Experience card component
│   ├── ReviewSlider.tsx        # Review carousel
│   ├── FAQSection.tsx          # FAQ accordion
│   ├── LoadingScreen.tsx       # Initial page loader
│   └── ui/                     # Shadcn UI components
│
├── lib/                        # Utility functions
├── hooks/                      # Custom React hooks
└── app/globals.css            # Global styles (Tailwind v4)
```

---

## 🚀 Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- npm or bun package manager
- Code editor (VS Code recommended)

### 2. Installation

```bash
# Clone or extract the project
cd group-escape-houses

# Install dependencies
npm install

# Run development server
npm run dev
```

The site will be available at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
npm start
```

---

## 🎨 Design System

### Brand Colors (CSS Variables)
```css
--color-bg-primary: #F5F3F0      /* Warm white background */
--color-bg-secondary: #E5D8C5    /* Sand beige sections */
--color-text-primary: #1F2937    /* Charcoal text */
--color-accent-sage: #89A38F     /* Primary buttons */
--color-accent-gold: #C6A76D     /* Accents & highlights */
--color-accent-pink: #F2C6C2     /* Secondary CTAs */
--color-neutral-dark: #374151    /* Body text */
```

### Typography
- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)

### Key UI Patterns
- Rounded corners: `rounded-2xl` (16px)
- Card shadows: `shadow-lg` with hover lift
- Scroll animations: Intersection Observer with fade-up
- Mobile-first responsive design

---

## 🔑 Key Features

### 1. Homepage (`src/app/page.tsx`)
- Hero video background
- Featured properties carousel
- Trust signals (3,000+ reviews, UK support)
- Experiences grid
- Destinations showcase
- How it works section
- Instagram feed integration
- FAQ accordion
- Newsletter signup

### 2. Property Pages
- Filter by location, size, price, features
- Property detail pages with galleries
- Enquiry forms with date/group size
- Related properties suggestions

### 3. Experiences
- Curated activities (cocktails, spa, chef, etc)
- Pricing "from £X per person"
- Duration and group size info

### 4. Destinations
- City guide pages for Brighton, Bath, Manchester, etc
- Travel tips and venue recommendations
- Featured properties per location

### 5. Contact Form
- Instant enquiry submission
- Office details: 11a North St, Brighton BN41 1DH
- Email: hello@groupescapehouses.co.uk

---

## 📧 API Integrations

### WhatsApp Webhook (`src/app/api/whatsapp/webhook/`)
- Handles incoming WhatsApp messages
- Requires Meta Business API credentials
- See `WHATSAPP_SETUP.md` for configuration

### Chatbot API (`src/app/api/chatbot/`)
- Custom chatbot endpoint
- Can be integrated with AI services

---

## 🌐 SEO & Meta Tags

Every page includes:
- Custom title and meta descriptions
- Open Graph tags for social sharing
- Structured data (JSON-LD schema)
- Clean URLs (lowercase, hyphenated)
- XML sitemap ready

**Target Keywords:**
- Hen Party Houses UK
- Luxury Party Houses with Hot Tubs
- Group Accommodation UK
- Large Holiday Homes

---

## 📱 Mobile Optimization

- Fully responsive (mobile-first approach)
- Breakpoints: `sm:640px`, `md:768px`, `lg:1024px`, `xl:1280px`
- Touch-friendly buttons (44px minimum)
- Optimized images with lazy loading
- Reduced motion support for accessibility

---

## 🎬 Animations

Handled via CSS animations in `globals.css`:
- `animate-fade-up`: Hero text entrance
- `animate-float`: Floating icons
- `animate-slide-left`: Instagram carousel
- `scroll-reveal`: Section fade-in on scroll

All animations respect `prefers-reduced-motion` setting.

---

## 🚨 Important Notes

### Styling Rules
- **NEVER use styled-jsx** (incompatible with Next.js 15)
- Always use Tailwind CSS classes
- CSS variables for colors: `var(--color-accent-sage)`
- Avoid inline styles unless absolutely necessary

### Export Conventions
- Components: **Named exports** (`export const Header = ...`)
- Pages: **Default exports** (`export default function HomePage()`)

### Browser Compatibility
- **Never use** `alert()`, `confirm()`, or `prompt()` (breaks iframes)
- Use React-based dialogs from Shadcn UI instead
- Avoid `window.location.reload()` - use router navigation

---

## 🔧 Environment Variables

No environment variables currently required for basic functionality.

**Future integrations may need:**
```env
# If adding database
DATABASE_URL=

# If adding email service
SMTP_HOST=
SMTP_USER=
SMTP_PASS=

# WhatsApp (already configured)
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_VERIFY_TOKEN=
```

---

## 📦 Dependencies

**Main packages:**
- `next` - React framework
- `react` & `react-dom` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `framer-motion` - Animations

**UI components:**
- All Shadcn UI components in `src/components/ui/`

See `package.json` for full list.

---

## 🌍 Deployment

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Connect custom domain (groupescapehouses.co.uk)
4. Auto-deploys on every push

### Option 2: Traditional Hosting
1. Build: `npm run build`
2. Upload `.next` folder, `public/`, and `package.json`
3. Run `npm start` on server
4. Point domain to server IP

### GoDaddy Domain Setup
- Update nameservers to Vercel's
- Or add A/CNAME records pointing to hosting

---

## 🐛 Known Issues / TODO

- [ ] Connect real property database (currently static data)
- [ ] Implement booking/payment system (Stripe)
- [ ] Add Google Analytics tracking
- [ ] Connect email marketing (newsletter signups)
- [ ] Add property availability calendar
- [ ] Optimize largest contentful paint (LCP)

---

## 📞 Support & Contact

**Project Owner:**
- Email: hello@groupescapehouses.co.uk
- Office: 11a North St, Brighton BN41 1DH

**Technical Questions:**
- Review code comments in key files
- Check Next.js 15 App Router docs
- Shadcn UI component library

---

## ✅ Pre-Deployment Checklist

Before going live:
- [ ] Test all pages on mobile/tablet/desktop
- [ ] Verify all internal links work
- [ ] Check contact form submissions
- [ ] Run Lighthouse performance audit
- [ ] Confirm all images load correctly
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)
- [ ] Set up 404 page
- [ ] Add Google Analytics
- [ ] Submit sitemap to Google Search Console
- [ ] Test page load speed on 4G

---

## 🎓 Learning Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Happy coding! 🚀**

For questions or issues, refer to inline code comments or reach out to the project owner.
