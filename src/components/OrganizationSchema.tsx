import Script from "next/script";

export default function OrganizationSchema() {
  const baseUrl = "https://www.groupescapehouses.co.uk";
  
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "Group Escape Houses",
      "url": `${baseUrl}/`,
      "logo": {
        "@type": "ImageObject",
        "url": "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/stacked_logo-1760785640378.jpg"
      },
      "sameAs": [
        "https://www.instagram.com/groupescapehouses/",
        "https://www.facebook.com/profile.php?id=61580927195664",
        "https://www.tiktok.com/@groupescapehouses"
      ]
    };

  return (
    <Script
      id="organization-schema-script"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
