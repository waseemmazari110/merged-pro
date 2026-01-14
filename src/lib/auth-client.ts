import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  // Use relative URL for browser to avoid "Invalid origin" on cross-subdomain requests
  baseURL: typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || process.env.BETTER_AUTH_URL),
  plugins: [
    inferAdditionalFields<typeof auth>()
  ]
});

export const { useSession, signIn, signUp, signOut } = authClient;
