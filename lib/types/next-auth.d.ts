import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    plan?: string;
    entrepriseId?: string;
    onboardingComplete?: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      plan: string;
      entrepriseId: string;
      onboardingComplete: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    plan: string;
    entrepriseId?: string;
    onboardingComplete?: boolean;
  }
}
