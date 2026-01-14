# Structured Data Schema Reference Guide

## Schema Architecture Overview

```
groupescapehouses.co.uk/
├── / (Homepage)
│   ├── Organization ✓
│   ├── WebSite ✓
│   └── Service ✓
│
├── /blog/[slug] (Blog Posts)
│   └── Article ✓
│       ├── headline
│       ├── description
│       ├── datePublished
│       ├── author (Organization)
│       └── publisher (Organization)
│
├── /properties/[slug] (Property Detail)
│   └── LodgingBusiness ✓
│       ├── name
│       ├── address
│       ├── priceRange
│       ├── image
│       └── potentialAction (ReserveAction)
│
├── /destinations/[slug] (Destination Listing)
│   └── ItemList ✓
│       ├── itemListElement[0]
│       │   └── ListItem (position, name, url)
│       ├── itemListElement[1]
│       └── ... more properties
│
└── /[pages-with-faqs] (FAQ Pages)
    └── FAQPage ✓
        └── mainEntity
            ├── Question
            │   └── acceptedAnswer
            ├── Question
            │   └── acceptedAnswer
            └── ...
```

## Schema Definitions

### 1. Organization Schema (Homepage Only)

**Purpose:** Identify the company to Google
**Properties Required:**
- `name`: "Group Escape Houses"
- `url`: https://groupescapehouses.co.uk
- `address`: PostalAddress (Brighton, UK)
- `contactPoint`: Customer service phone/email
- `sameAs`: Social media profiles

**Example Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Group Escape Houses",
  "url": "https://groupescapehouses.co.uk",
  "logo": "https://groupescapehouses.co.uk/logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "11a North Street",
    "addressLocality": "Brighton",
    "addressRegion": "East Sussex",
    "postalCode": "BN41 1DH",
    "addressCountry": "UK"
  }
}
```

### 2. WebSite Schema (Homepage Only)

**Purpose:** Enable site search in Google results
**Properties Required:**
- `name`: Site name
- `url`: Homepage URL
- `potentialAction`: SearchAction with urlTemplate

**Example Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Group Escape Houses",
  "url": "https://groupescapehouses.co.uk",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://groupescapehouses.co.uk/properties?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### 3. Service Schema (Homepage Only)

**Purpose:** Describe what the website does
**Properties Required:**
- `name`: "Group Accommodation Listings and Enquiry Platform"
- `description`: What the service offers
- `provider`: Organization reference
- `areaServed`: Geographic service area

**Example Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Group Accommodation Listings and Enquiry Platform",
  "description": "Online platform for browsing and enquiring about luxury group accommodation properties across the UK",
  "provider": {
    "@type": "Organization",
    "name": "Group Escape Houses",
    "url": "https://groupescapehouses.co.uk"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United Kingdom"
  }
}
```

### 4. Article Schema (Blog Posts Only)

**Purpose:** Enable rich snippets in Google search results
**Properties Required:**
- `headline`: Article title
- `description`: Article summary
- `datePublished`: ISO 8601 format
- `author`: Organization
- `publisher`: Organization with logo
- `mainEntityOfPage`: WebPage with @id

**Conditional Rendering:**
```tsx
const articleSchema = type === "blog" && data ? { /* schema */ } : null;
```

**Example Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The Ultimate Brighton Hen Do Guide: Where to Stay, Eat & Party",
  "description": "Complete Brighton hen party guide with best houses, restaurants & activities",
  "datePublished": "2025-01-12T00:00:00Z",
  "dateModified": "2025-01-12T00:00:00Z",
  "author": {
    "@type": "Organization",
    "name": "Group Escape Houses"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Group Escape Houses",
    "url": "https://groupescapehouses.co.uk"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://groupescapehouses.co.uk/blog/brighton-hen-do-guide"
  }
}
```

### 5. LodgingBusiness Schema (Property Pages Only)

**Purpose:** Show property details in search results
**Properties Required:**
- `name`: Property name/title
- `url`: Property page URL
- `address`: PostalAddress
- `priceRange`: Price per night range
- `image`: Property hero image
- `potentialAction`: ReserveAction

**Conditional Rendering:**
```tsx
const accommodationSchema = type === "property" && data ? { /* schema */ } : null;
```

**Example Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "The Brighton Manor - Luxury Hen Party House",
  "url": "https://groupescapehouses.co.uk/properties/brighton-manor",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Brighton",
    "addressRegion": "East Sussex",
    "addressCountry": "UK"
  },
  "image": "https://cdn.example.com/brighton-manor.jpg",
  "description": "Luxury hen party house sleeping 16 guests with hot tub and swimming pool",
  "priceRange": "£79-£150",
  "accommodationCategory": "House",
  "potentialAction": {
    "@type": "ReserveAction",
    "target": "https://groupescapehouses.co.uk/properties/brighton-manor"
  }
}
```

### 6. ItemList Schema (Destination/Listing Pages Only)

**Purpose:** Show list of properties in search results
**Properties Required:**
- `name`: List name
- `itemListElement`: Array of ListItem objects
  - `position`: Index (1-based)
  - `name`: Item name
  - `url`: Item URL

**Conditional Rendering:**
```tsx
const itemListSchema = (type === "listing" || type === "destination") ? { /* schema */ } : null;
```

**Example Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Group Accommodation in Brighton",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "The Brighton Manor",
      "url": "https://groupescapehouses.co.uk/properties/brighton-manor"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Brighton Waterfront Villa",
      "url": "https://groupescapehouses.co.uk/properties/brighton-villa"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Brighton Beachside House",
      "url": "https://groupescapehouses.co.uk/properties/brighton-beach"
    }
  ]
}
```

### 7. FAQPage Schema (Pages with FAQs Only)

**Purpose:** Show FAQ rich snippets in search results
**Properties Required:**
- `mainEntity`: Array of Questions
  - Each Question has `name` and `acceptedAnswer`
  - Answer has `text` property

**Conditional Rendering:**
```tsx
const faqSchema = type === "faq" && data?.faqs ? { /* schema */ } : null;
```

**Example Output:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I book a hen party house?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Browse our properties, select your preferred house, and submit an enquiry with your dates..."
      }
    },
    {
      "@type": "Question",
      "name": "What is the deposit and payment schedule?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We require a 25-30% deposit to secure booking..."
      }
    }
  ]
}
```

## Schema Placement by Page Type

| Page Type | Schemas | File Location | Status |
|-----------|---------|---------------|--------|
| Homepage | Organization, WebSite, Service | `src/app/layout.tsx` | ✅ Implemented |
| Blog Post | Article | `src/app/blog/[slug]/layout.tsx` | ✅ Implemented |
| Property Detail | LodgingBusiness | `src/app/properties/[slug]/layout.tsx` | ✅ Implemented |
| Destination/Listing | ItemList | `src/app/destinations/[slug]/layout.tsx` | ✅ Implemented |
| FAQ Pages | FAQPage | Pages with FAQs | ✅ Ready |

## Removed Schemas (Why)

### ❌ RealEstateAgent
- **Reason:** Site is NOT a real estate agency
- **What it claimed:** This is an agency selling properties
- **Why wrong:** Group Escape Houses facilitates short-term holiday rentals, not property sales
- **Impact:** Confused Google about business model, hurt ranking for accommodation queries

### ❌ LocalBusiness
- **Reason:** Site is NOT a walk-in business
- **What it claimed:** This is a physical location customers visit
- **Why wrong:** Fully online platform with no physical customer presence
- **Impact:** Irrelevant schema type for SaaS/web application

### ❌ HowTo (Generic)
- **Reason:** Only valid if page shows actual numbered steps
- **What it claimed:** Here's how to do something step-by-step
- **Why wrong:** Can't place arbitrary HowTo schema on homepage without visible numbered steps
- **Impact:** Schema validation warning, Google ignores it

### ❌ VideoObject (Unfilled)
- **Reason:** Only valid if ALL required properties present
- **What it claimed:** Here's an embedded video
- **Why wrong:** Missing required contentUrl, thumbnailUrl, uploadDate, duration properties
- **Impact:** Schema validation error, Google ignores it

## Implementation Checklist

### StructuredData.tsx
- [x] Removed RealEstateAgent schema definition
- [x] Removed LocalBusiness schema definition
- [x] Removed generic HowTo schema
- [x] Removed unfilled VideoObject schema
- [x] Added conditional Organization schema (homepage only)
- [x] Added conditional WebSite schema (homepage only)
- [x] Added conditional Service schema (homepage only)
- [x] Added conditional ItemList schema
- [x] Added conditional FAQPage schema
- [x] Added conditional Article schema
- [x] Added conditional LodgingBusiness schema

### Root Layout (Homepage)
- [x] Kept Organization schema
- [x] Kept WebSite schema
- [x] Added Service schema (was missing)
- [x] Verified no duplicate schemas

### Blog Layout
- [x] Added Article schema generation
- [x] Properly mapped blog post data to schema fields
- [x] Used async component for data fetching
- [x] Included publisher and author references

### Property Layout
- [x] Added LodgingBusiness schema generation
- [x] Fetches property data from API
- [x] Includes address and pricing information
- [x] Adds ReserveAction for booking

### Destination Layout
- [x] Added ItemList schema generation
- [x] Fetches destination properties
- [x] Limits to 10 items per page
- [x] Properly ordered list items

## Validation Testing

### Test with Google Rich Results Tool
1. Go to https://search.google.com/test/rich-results
2. Input URL: https://groupescapehouses.co.uk
3. Expected result: Valid structured data for Organization, WebSite, Service

### Browser DevTools Verification
```javascript
// Run in browser console to view all schema markup:
document.querySelectorAll('script[type="application/ld+json"]').forEach(el => {
  console.log(JSON.parse(el.textContent));
});
```

### Schema.org Validator
- Homepage: https://validator.schema.org/?url=https://groupescapehouses.co.uk
- Blog: https://validator.schema.org/?url=https://groupescapehouses.co.uk/blog/brighton-hen-do-guide
- Property: https://validator.schema.org/?url=https://groupescapehouses.co.uk/properties/[slug]

## Key Metrics to Monitor

### Google Search Console
- **Enhancements > Rich Results** → Check for schema errors
- **Coverage > Valid with warnings** → Monitor schema.org compliance
- **Performance** → Track CTR for articles and properties
- **Indexing > Coverage** → Verify all pages indexed

### Expected Search Changes
- **Timeline:** 2-4 weeks for full impact
- **Blog posts:** Expect expanded search snippets
- **Properties:** Appear with amenities/pricing in results
- **Destinations:** Browsable property lists in results

---

**Last Updated:** 2025-01-15  
**Schema.org Version:** Latest (schema.org)  
**Next.js Version:** 15.3.6
