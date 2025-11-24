import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { isDashboardEnabled, isPublicRoute } from "@/lib/dashboard-enabled";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Vérifier si le dashboard est désactivé
  if (!isDashboardEnabled()) {
    // Si la route n'est pas publique, rediriger vers la landing page
    if (!isPublicRoute(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Si c'est une route publique, laisser passer
    return NextResponse.next();
  }

  // Le dashboard est activé, continuer avec la logique d'authentification normale
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");
  const isOnboarding = pathname.startsWith("/onboarding");

  // Si l'utilisateur n'est pas connecté et essaie d'accéder au dashboard ou onboarding
  if ((isDashboard || isOnboarding) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Si l'utilisateur est connecté
  if (token) {
    const onboardingComplete = (token as { onboardingComplete?: boolean }).onboardingComplete;

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
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
