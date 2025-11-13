"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

export interface UserInfo {
  name: string;
  email: string;
  initials: string;
  avatarUrl?: string | null;
}

/**
 * Custom hook to get user information from session
 * Returns user name, email, initials, and avatar URL
 */
export function useUserInfo(): UserInfo {
  const { data: session } = useSession();

  return useMemo(() => {
    const name = session?.user?.name || "Utilisateur";
    const email = session?.user?.email || "";
    const avatarUrl = session?.user?.image;

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return {
      name,
      email,
      initials,
      avatarUrl,
    };
  }, [session]);
}
