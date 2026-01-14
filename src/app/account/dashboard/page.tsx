import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SavedProperties } from "@/components/auth/SavedProperties";
import { SavedQuotes } from "@/components/auth/SavedQuotes";
import { EnquiryHistory } from "@/components/auth/EnquiryHistory";
import { ExperienceEnquiryForm } from "@/components/auth/ExperienceEnquiryForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Heart, Quote, Mail } from "lucide-react";

export default async function GuestDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "owner") {
    redirect("/owner/dashboard");
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--color-bg-primary)] pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Welcome Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Welcome back, {session.user.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage your saved properties, quotes, and enquiries in one place.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[var(--color-accent-sage)]/10 flex items-center justify-center">
                <User className="w-6 h-6 text-[var(--color-accent-sage)]" />
              </div>
              <div>
                <p className="text-sm font-bold">{session.user.name}</p>
                <p className="text-xs text-gray-500">{session.user.email}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="flex w-full md:w-auto bg-white p-1 rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-x-auto whitespace-nowrap">
              <TabsTrigger 
                value="saved" 
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-[var(--color-accent-sage)] data-[state=active]:text-white transition-all"
              >
                <Heart className="w-4 h-4" />
                Saved Properties
              </TabsTrigger>
              <TabsTrigger 
                value="quotes" 
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-[var(--color-accent-sage)] data-[state=active]:text-white transition-all"
              >
                <Quote className="w-4 h-4" />
                Saved Quotes
              </TabsTrigger>
              <TabsTrigger 
                value="enquiries" 
                className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-[var(--color-accent-sage)] data-[state=active]:text-white transition-all"
              >
                <Mail className="w-4 h-4" />
                Enquiry History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="saved" className="focus-visible:outline-none">
              <div className="grid grid-cols-1 gap-8">
                <section>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    Your Saved Properties
                  </h2>
                  <SavedProperties />
                </section>
              </div>
            </TabsContent>

            <TabsContent value="quotes" className="focus-visible:outline-none">
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Quote className="w-6 h-6 text-[var(--color-accent-sage)]" />
                  Your Saved Quotes
                </h2>
                <SavedQuotes />
              </section>
            </TabsContent>

            <TabsContent value="enquiries" className="focus-visible:outline-none">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Mail className="w-6 h-6 text-blue-500" />
                    Your Enquiry History
                  </h2>
                  <EnquiryHistory />
                </div>
                <div className="lg:col-span-1">
                  <ExperienceEnquiryForm />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}
