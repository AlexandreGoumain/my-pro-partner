import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isOnboarding = request.nextUrl.pathname.startsWith("/onboarding");

  // Si l'utilisateur n'est pas connecté et essaie d'accéder au dashboard ou onboarding
  if ((isDashboard || isOnboarding) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Si l'utilisateur est connecté
  if (token) {
    const onboardingComplete = (token as any).onboardingComplete;

    // Si onboarding non complété et essaie d'accéder au dashboard
    if (!onboardingComplete && isDashboard) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // Si onboarding complété et essaie d'accéder à /onboarding
    if (onboardingComplete && isOnboarding) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Si connecté avec onboarding complété et essaie d'accéder aux pages auth
    if (onboardingComplete && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Si connecté mais onboarding non complété et essaie d'accéder aux pages auth
    if (!onboardingComplete && isAuthPage) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/onboarding"],
};
