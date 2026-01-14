/**
 * Admin-specific authentication client
 * Stores admin sessions in separate cookie: admin-session-token
 * This ensures admins have completely isolated sessions from public users
 */
import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const adminAuthClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL),
  fetchOptions: {
    credentials: "include", // Always send cookies
    headers: {
      "X-Auth-Context": "admin" // Mark requests as admin
    }
  },
  plugins: [
    inferAdditionalFields<typeof auth>()
  ]
});

export const { signOut: adminSignOut } = adminAuthClient;
