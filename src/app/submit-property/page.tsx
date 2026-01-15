"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertySubmissionForm from "@/components/PropertySubmissionForm";

export default function SubmitPropertyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-12">
        <PropertySubmissionForm />
      </main>
      <Footer />
    </div>
  );
}
