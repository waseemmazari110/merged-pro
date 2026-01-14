interface UKServiceSchemaProps {
  type: "home" | "breadcrumb" | "itemList" | "faq" | "default" | "property" | "article" | "organization" | "website" | "home_graph";
  data?: any;
  includeSiteWide?: boolean;
}

export default function UKServiceSchema({ type, data, includeSiteWide = false }: UKServiceSchemaProps) {
  return <SchemaRenderer type={type} data={data} includeSiteWide={includeSiteWide} />;
}

export function SchemaRenderer({ type, data, includeSiteWide = false }: UKServiceSchemaProps) {
  const baseUrl = "https://www.groupescapehouses.co.uk";
  const siteName = "Group Escape Houses";
  
  // Organization schema is now handled by OrganizationSchema.tsx sitewide
  // to avoid duplication and maintain a single source of truth.

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": `${baseUrl}/`,
    "name": siteName,
    "publisher": { "@id": `${baseUrl}/#organization` },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/properties?destination={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const webPageSchema = type !== "default" ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}${data?.url || "/"}#webpage`,
    "url": `${baseUrl}${data?.url || "/"}`,
    "name": data?.name || `Group Escape Houses | Large Group Accommodation UK`,
    "description": data?.description || "Discover large group accommodation and escape houses across the UK. Sleeps 10 to 30 guests. Book direct with property owners.",
    "isPartOf": `${baseUrl}/#website`,
    "about": `${baseUrl}/#organization`
  } : null;

  const breadcrumbSchema = (type === "breadcrumb" && data?.breadcrumbs) ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": data.breadcrumbs.map((crumb: any, index: number) => {
      const item = {
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
      };
      
      // Final position, current page title, omit the item field for the current page
      if (index < data.breadcrumbs.length - 1) {
        (item as any).item = crumb.url.startsWith("http") ? crumb.url : `${baseUrl}${crumb.url.startsWith("/") ? "" : "/"}${crumb.url}`;
      }
      
      return item;
    })
  } : null;

  const itemListSchema = (type === "itemList" && data?.items) ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": data.items.map((item: any, index: number) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": item.url ? (item.url.startsWith("http") ? item.url : `${baseUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`) : `${baseUrl}/properties/${item.slug}`
    }))
  } : null;

  const faqSchema = (type === "faq" && data?.faqs) ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

    const propertySchema = (type === "property" && data) ? {
      "@context": "https://schema.org",
      "@type": "Accommodation",
      "name": data.name,
      "description": data.description,
      "image": data.image,
      "url": `${baseUrl}/properties/${data.slug}`,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": data.location,
        "addressCountry": "GB"
      },
      "provider": { "@id": `${baseUrl}/#organization` },
      ...(data.priceFrom && {
        "offers": {
          "@type": "Offer",
          "priceCurrency": "GBP",
          "price": data.priceFrom,
          "availability": "https://schema.org/InStock"
        }
      })
    } : null;

  const articleSchema = (type === "article" && data) ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.title,
    "description": data.description,
    "image": data.image,
    "datePublished": data.datePublished,
    "dateModified": data.dateModified || data.datePublished,
    "author": {
      "@type": "Organization",
      "name": siteName,
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": siteName,
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/icon-512x512.png`
      }
    }
  } : null;

  return (
    <>
      {/* Site-wide schema */}
      {includeSiteWide && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      )}

      {/* Individual schema types */}
      {type === "website" && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      )}
      
      {/* Page specific schema */}
      {webPageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {propertySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
        />
      )}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
    </>
  );
}
