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
const pageUrl = data.url.startsWith("http") ? data.url : `${baseUrl}${data.url.startsWith("/") ? "" : "/"}${data.url}`;

const schemas = [];

// Organization
schemas.push({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${baseUrl}/#organization`,
  "name": "Group Escape Houses",
  "url": `${baseUrl}/`,
  "email": "hello@groupescapehouses.co.uk",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "11a North St, Brighton and Hove, Brighton BN41 1DH, United Kingdom"
  },
  "areaServed": "United Kingdom",
  "inLanguage": "en-GB"
});

// WebSite
schemas.push({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  "url": `${baseUrl}/`,
  "name": "Group Escape Houses",
  "publisher": { "@id": `${baseUrl}/#organization` },
  "inLanguage": "en-GB",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${baseUrl}/search?query={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
});

// WebPage
schemas.push({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}/#webpage`,
  "url": pageUrl,
  "name": data.name,
  "description": data.description,
  "isPartOf": { "@id": `${baseUrl}/#website` },
  "about": { "@id": `${baseUrl}/#organization` },
  "inLanguage": "en-GB"
});

console.log(JSON.stringify(schemas, null, 2));
