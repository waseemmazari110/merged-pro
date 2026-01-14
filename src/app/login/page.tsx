import { UnifiedAuthForm } from "@/components/auth/UnifiedAuthForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Group Escape Houses",
  description: "Sign in to your account on Group Escape Houses.",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg-primary)] pt-32 pb-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          <UnifiedAuthForm initialMode="login" />
        </div>
      </main>
      <Footer />
    </>
  );
}
