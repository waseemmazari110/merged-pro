import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

// Force dynamic rendering for all owner routes
export const dynamic = 'force-dynamic';

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const user = session?.user as any;
    const role = user?.role;

    // Redirect if not authenticated
    if (!user) {
      redirect("/auth/sign-in?redirect=/owner/dashboard");
    }

    // STRICT: Only owners can access owner routes (not even admins)
    if (role !== "owner") {
      // Redirect non-owners to their appropriate dashboard
      if (role === "admin") {
        redirect("/admin/dashboard");
      } else {
        redirect("/");
      }
    }

    return <>{children}</>;
  } catch (error) {
    console.error("Session check error:", error);
    // If there's an error checking session, redirect to signin
    redirect("/auth/sign-in?redirect=/owner/dashboard");
  }
}
