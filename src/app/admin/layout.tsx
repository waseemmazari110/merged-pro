import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// Force dynamic rendering for all admin routes
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  
  const session = await auth.api.getSession({
    headers: headersList,
  });

  const user = session?.user as any;
  const role = user?.role;

  // Redirect unauthenticated users to public admin login page
  if (!user) {
    redirect("/auth/admin-login");
  }

  // STRICT: Only admins can access admin routes (not even owners)
  if (role !== "admin") {
    // Redirect non-admins to their appropriate dashboard
    if (role === "owner") {
      redirect("/owner/dashboard");
    } else {
      redirect("/");
    }
  }

  return <>{children}</>;
}
