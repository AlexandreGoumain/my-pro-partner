import {
  handleTenantError,
  requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { FECService } from "@/lib/services/fec.service";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET /api/export/fec - Export FEC (Fichier des Écritures Comptables)
// ============================================

export async function GET(req: NextRequest) {
  try {
    const { entrepriseId } = await requireTenantAuth();

    const { searchParams } = new URL(req.url);
    const dateDebut = searchParams.get("dateDebut");
    const dateFin = searchParams.get("dateFin");
    const format = searchParams.get("format") || "file"; // "file" ou "stats"

    // Validation des dates
    if (!dateDebut || !dateFin) {
      return NextResponse.json(
        {
          message:
            "Les paramètres dateDebut et dateFin sont requis (format: YYYY-MM-DD)",
        },
        { status: 400 }
      );
    }

    const dateDebutObj = new Date(dateDebut);
    const dateFinObj = new Date(dateFin);

    if (isNaN(dateDebutObj.getTime()) || isNaN(dateFinObj.getTime())) {
      return NextResponse.json(
        { message: "Format de date invalide (attendu: YYYY-MM-DD)" },
        { status: 400 }
      );
    }

    if (dateDebutObj > dateFinObj) {
      return NextResponse.json(
        { message: "La date de début doit être antérieure à la date de fin" },
        { status: 400 }
      );
    }

    // Récupérer les informations de l'entreprise
    const entreprise = await prisma.entreprise.findUnique({
      where: { id: entrepriseId },
      select: {
        id: true,
        nom: true,
        siret: true,
      },
    });

    if (!entreprise) {
      return NextResponse.json(
        { message: "Entreprise non trouvée" },
        { status: 404 }
      );
    }

    if (!entreprise.siret) {
      return NextResponse.json(
        {
          message:
            "Le SIRET de l'entreprise doit être renseigné pour générer le FEC",
        },
        { status: 400 }
      );
    }

    // Si format=stats, retourner uniquement les statistiques
    if (format === "stats") {
      const stats = await FECService.getFECStats({
        entrepriseId,
        dateDebut: dateDebutObj,
        dateFin: dateFinObj,
      });

      return NextResponse.json({
        success: true,
        stats,
      });
    }

    // Générer le fichier FEC
    const fecContent = await FECService.generateFEC({
      entrepriseId,
      dateDebut: dateDebutObj,
      dateFin: dateFinObj,
    });

    // Valider le fichier généré
    const validation = FECService.validateFEC(fecContent);

    if (!validation.valid) {
      console.error("[FEC_VALIDATION_ERROR]", validation.errors);
      return NextResponse.json(
        {
          message: "Le fichier FEC généré contient des erreurs",
          errors: validation.errors,
        },
        { status: 500 }
      );
    }

    // Générer le nom du fichier selon la nomenclature légale
    const fileName = FECService.generateFileName(entreprise.siret, dateFinObj);

    // Retourner le fichier pour téléchargement
    return new NextResponse(fecContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=UTF-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("[FEC_EXPORT_ERROR]", error);
    return handleTenantError(error);
  }
}
