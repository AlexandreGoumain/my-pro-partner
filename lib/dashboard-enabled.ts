import { NextResponse } from "next/server";

/**
 * Vérifie si le dashboard est activé via la variable d'environnement
 * NEXT_PUBLIC_DASHBOARD_ENABLED
 */
export function isDashboardEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DASHBOARD_ENABLED === "true";
}

/**
 * Routes publiques qui restent accessibles même si le dashboard est désactivé
 */
export const PUBLIC_ROUTES = [
  "/",
  "/waitlist",
  "/pricing",
  "/contact",
  "/api/waitlist",
  "/api/contact",
];

/**
 * Préfixes de routes publiques (wildcards)
 */
export const PUBLIC_ROUTE_PREFIXES = [
  "/api/public/",
  "/api/waitlist/",
  "/api/contact/",
];

/**
 * Vérifie si une route est publique
 */
export function isPublicRoute(pathname: string): boolean {
  // Exact match
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }

  // Prefix match
  return PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Vérifie si le dashboard est activé et retourne une erreur 403 si désactivé
 * À utiliser dans les API routes
 */
export function checkDashboardEnabled(): NextResponse | null {
  if (!isDashboardEnabled()) {
    return NextResponse.json(
      {
        error: "Le dashboard n'est pas encore disponible. Rejoignez notre liste d'attente !",
        waitlistUrl: "/waitlist"
      },
      { status: 403 }
    );
  }
  return null;
}
