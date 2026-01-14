/**
 * Admin Login Layout
 * This layout bypasses the parent admin layout protection
 * to allow unauthenticated users to access the login page
 */

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Simply render children without authentication check
  // The login page handles its own auth logic
  return <>{children}</>;
}
