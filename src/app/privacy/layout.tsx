import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | How We Handle Your Personal Data | GDPR Compliant",
  description: "Privacy policy and GDPR-compliant practices. How we protect your personal data, cookies and your rights.",
  keywords: ["privacy policy", "data protection", "GDPR compliance", "personal data"],
  openGraph: {
    title: "Privacy Policy",

    description: "GDPR-compliant privacy practices. How we protect and handle your personal data.",
    url: "https://www.groupescapehouses.co.uk/privacy",
  },
  alternates: {
    canonical: "https://www.groupescapehouses.co.uk/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}