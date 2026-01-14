const data = {
  name: "Large Group Accommodation Across the UK | Group Escape Houses",
  description: "Luxury large group accommodation across the UK with hot tubs, pools, and stylish interiors. Book direct with owners.",
  url: "/",
  faqs: [
    { question: "How do I book?", answer: "Enquire directly with the owner." }
  ],
  items: [
    { name: "London", url: "/destinations/london", image: "https://example.com/img.jpg", description: "City" }
  ]
};

const baseUrl = "https://www.groupescapehouses.co.uk";
const includeSiteWide = false;

// 1) Organization (Nationwide Schema)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${baseUrl}/#organization`,
  "name": "Group Escape Houses",
  "url": `${baseUrl}/`,
  "logo": {
    "@type": "ImageObject",
    "url": `${baseUrl}/logo.png`
  },
  "email": "hello@groupescapehouses.co.uk",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "11a North St, Portslade",
    "addressLocality": "Brighton and Hove",
    "addressRegion": "East Sussex",
    "postalCode": "BN41 1DH",
    "addressCountry": "GB"
  },
  "areaServed": {
    "@type": "Country",
    "name": "United Kingdom"
  },
  "inLanguage": "en-GB"
};

// 2) WebSite
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  "url": `${baseUrl}/`,
  "name": "Group Escape Houses",
  "publisher": { "@id": `${baseUrl}/#organization` },
  "inLanguage": "en-GB",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseUrl}/search?query={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

const pageUrl = data.url ? (data.url.startsWith("http") ? data.url : `${baseUrl}${data.url.startsWith("/") ? "" : "/"}${data.url}`) : baseUrl;

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl.replace(/\/$/, "")}/#webpage`,
  "url": pageUrl,
  "name": data.name,
  "description": data.description,
  "isPartOf": { "@id": `${baseUrl}/#website` },
  "about": { "@id": `${baseUrl}/#organization` },
  "inLanguage": "en-GB"
};

const breadcrumbSchema = (data.breadcrumbs && data.breadcrumbs.length > 0) ? {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${pageUrl.replace(/\/$/, "")}/#breadcrumb`,
  "itemListElement": data.breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url.startsWith("http") ? crumb.url : `${baseUrl}${crumb.url.startsWith("/") ? "" : "/"}${crumb.url}`
  }))
} : null;

const faqSchema = (data.faqs && data.faqs.length > 0) ? {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": data.faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
} : null;

const itemListSchema = (data.items && data.items.length > 0) ? {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "numberOfItems": data.items.length,
  "itemListElement": data.items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Thing",
      "url": item.url.startsWith("http") ? item.url : `${baseUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
      "name": item.name,
      "image": item.image,
      "description": item.description
    }
  }))
} : null;

const allSchemas = [
  includeSiteWide && organizationSchema,
  includeSiteWide && websiteSchema,
  !includeSiteWide && webPageSchema,
  !includeSiteWide && breadcrumbSchema,
  !includeSiteWide && faqSchema,
  !includeSiteWide && itemListSchema
].filter(Boolean);

console.log(JSON.stringify(allSchemas, null, 2));
