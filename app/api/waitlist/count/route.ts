import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/waitlist/count
 * Endpoint public pour récupérer le nombre d'inscrits à la waitlist
 * Utilisé pour afficher le compteur en temps réel sur la landing page
 */
export async function GET() {
  try {
    const count = await prisma.waitlist.count();

    return NextResponse.json(
      { count },
      {
        status: 200,
        headers: {
          // Cache pendant 5 minutes pour éviter trop de requêtes DB
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error("Waitlist count error:", error);
    // En cas d'erreur, retourner 0 plutôt qu'une erreur pour ne pas casser l'UI
    return NextResponse.json(
      { count: 0 },
      { status: 200 }
    );
  }
}
