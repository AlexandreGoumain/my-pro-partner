import { prisma } from "@/lib/prisma";
import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";
import { TypeSegment } from "@/lib/generated/prisma";

const predefinedSegments = [
  {
    nom: "Tous les clients",
    description: "Tous les clients de votre base de données",
    type: "PREDEFINED" as TypeSegment,
    icone: "Users",
    couleur: "#f3f4f6",
    criteres: {
      type: "all",
    },
  },
  {
    nom: "Clients avec email",
    description: "Clients ayant une adresse email enregistrée",
    type: "PREDEFINED" as TypeSegment,
    icone: "Mail",
    couleur: "#f3f4f6",
    criteres: {
      type: "with-email",
    },
  },
  {
    nom: "Clients avec téléphone",
    description: "Clients ayant un numéro de téléphone enregistré",
    type: "PREDEFINED" as TypeSegment,
    icone: "Phone",
    couleur: "#f3f4f6",
    criteres: {
      type: "with-phone",
    },
  },
  {
    nom: "Clients par ville",
    description: "Clients dont la ville est renseignée",
    type: "PREDEFINED" as TypeSegment,
    icone: "MapPin",
    couleur: "#f3f4f6",
    criteres: {
      type: "by-city",
    },
  },
  {
    nom: "Nouveaux clients",
    description: "Clients ajoutés au cours des 30 derniers jours",
    type: "PREDEFINED" as TypeSegment,
    icone: "Clock",
    couleur: "#f3f4f6",
    criteres: {
      type: "recent",
    },
  },
  {
    nom: "Clients inactifs",
    description: "Clients sans activité depuis plus de 90 jours",
    type: "PREDEFINED" as TypeSegment,
    icone: "UserX",
    couleur: "#f3f4f6",
    criteres: {
      type: "inactive",
    },
  },
  {
    nom: "Programme de fidélité",
    description: "Clients ayant des points de fidélité",
    type: "PREDEFINED" as TypeSegment,
    icone: "Star",
    couleur: "#f3f4f6",
    criteres: {
      type: "loyalty",
    },
  },
];

// ============================================
// POST /api/segments/seed - Seed predefined segments
// ============================================

export async function POST(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const created: string[] = [];
    const skipped: string[] = [];

    for (const segmentData of predefinedSegments) {
      // Check if segment already exists
      const existing = await prisma.segment.findUnique({
        where: {
          entrepriseId_nom: {
            entrepriseId,
            nom: segmentData.nom,
          },
        },
      });

      if (existing) {
        skipped.push(segmentData.nom);
        continue;
      }

      // Create segment
      await prisma.segment.create({
        data: {
          ...segmentData,
          entrepriseId,
          nombreClients: 0,
          actif: true,
        },
      });

      created.push(segmentData.nom);
    }

    return NextResponse.json(
      {
        message: "Segments prédéfinis créés avec succès",
        created: created.length,
        skipped: skipped.length,
        createdSegments: created,
        skippedSegments: skipped,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleTenantError(error);
  }
}
