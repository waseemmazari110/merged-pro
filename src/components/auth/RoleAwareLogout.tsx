"use client";

import { authClient } from "@/lib/auth-client";
import { logoutWithRole, type UserRole } from "@/lib/auth-helpers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

interface RoleAwareLogoutProps {
  userRole: UserRole;
  children: React.ReactNode;
  className?: string;
  onLogoutStart?: () => void;
  onLogoutComplete?: () => void;
}

/**
 * Role-aware logout component
 * Handles logout with proper cleanup and role-based redirect
 * 
 * Usage:
 * <RoleAwareLogout userRole="admin">
 *   <LogOut /> Sign Out
 * </RoleAwareLogout>
 */
export function RoleAwareLogout({ 
  userRole, 
  children, 
  className = "",
  onLogoutStart,
  onLogoutComplete 
}: RoleAwareLogoutProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    onLogoutStart?.();

    try {
      // Get redirect URL for this role
      const redirectUrl = await logoutWithRole(userRole);
      
      toast.success("Logged out successfully");
      
      // Redirect to role-specific login page
      router.push(redirectUrl);
      router.refresh();
      
      onLogoutComplete?.();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? "Logging out..." : children}
    </button>
  );
}

/**
 * Simple logout button without role awareness
 * For use in contexts where role is not available
 */
export function LogoutButton({ 
  children, 
  className = "",
  redirectTo = "/" 
}: { 
  children: React.ReactNode; 
  className?: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);

    try {
      await authClient.signOut();
      
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }
      
      toast.success("Logged out successfully");
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? "Logging out..." : children}
    </button>
  );
}
