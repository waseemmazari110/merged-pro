"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export default function BreadcrumbSchema() {
  const pathname = usePathname();
  const baseUrl = "https://www.groupescapehouses.co.uk";

  // Don't add to homepage
  if (pathname === "/" || !pathname) return null;

  // Split path into segments and remove empty ones
  const segments = pathname.split("/").filter(Boolean);
  
  // Build breadcrumbs
  const breadcrumbs = [
    { name: "Home", url: `${baseUrl}/` }
  ];

  let currentUrl = "";
  segments.forEach((segment, index) => {
    currentUrl += `/${segment}`;
    
    // Format name: replace hyphens with spaces and capitalize
    const name = segment
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      name,
      url: `${baseUrl}${currentUrl}`
    });
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => {
      const item: any = {
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
      };

      // Omit 'item' field for the final position (current page)
      if (index < breadcrumbs.length - 1) {
        item.item = crumb.url;
      }

      return item;
    })
  };

  return (
    <Script
      id="breadcrumb-schema-script"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
