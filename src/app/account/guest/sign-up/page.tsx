import { UnifiedAuthForm } from "@/components/auth/UnifiedAuthForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account | Group Escape Houses",
  description: "Join Group Escape Houses to save properties, track enquiries, and manage bookings.",
};

export default function GuestSignUpPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg-primary)] pt-32 pb-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          <UnifiedAuthForm initialMode="initial" />
        </div>
      </main>
      <Footer />
    </>
  );
}
