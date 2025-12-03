import { withApiHandler } from "@/lib/api/api-handler";
import { ValidationError, NotFoundError, BusinessError } from "@/lib/errors";
import { FECService } from "@/lib/services/fec.service";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// GET /api/export/fec - Export FEC (Fichier des Écritures Comptables)
// ============================================

export async function GET(req: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { searchParams } = new URL(req.url);
            const dateDebut = searchParams.get("dateDebut");
            const dateFin = searchParams.get("dateFin");
            const format = searchParams.get("format") || "file"; // "file" ou "stats"

            // Validation des dates
            if (!dateDebut || !dateFin) {
                throw new ValidationError(
                    "Les paramètres dateDebut et dateFin sont requis (format: YYYY-MM-DD)"
                );
            }

            const dateDebutObj = new Date(dateDebut);
            const dateFinObj = new Date(dateFin);

            if (isNaN(dateDebutObj.getTime()) || isNaN(dateFinObj.getTime())) {
                throw new ValidationError("Format de date invalide (attendu: YYYY-MM-DD)");
            }

            if (dateDebutObj > dateFinObj) {
                throw new ValidationError("La date de début doit être antérieure à la date de fin");
            }

            // Récupérer les informations de l'entreprise
            const entreprise = await prisma.entreprise.findUnique({
                where: { id: ctx.entrepriseId },
                select: {
                    id: true,
                    nom: true,
                    siret: true,
                },
            });

            if (!entreprise) {
                throw new NotFoundError("Entreprise non trouvée");
            }

            if (!entreprise.siret) {
                throw new BusinessError(
                    "Le SIRET de l'entreprise doit être renseigné pour générer le FEC"
                );
            }

            // Si format=stats, retourner uniquement les statistiques
            if (format === "stats") {
                const stats = await FECService.getFECStats({
                    entrepriseId: ctx.entrepriseId,
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
                entrepriseId: ctx.entrepriseId,
                dateDebut: dateDebutObj,
                dateFin: dateFinObj,
            });

            // Valider le fichier généré
            const validation = FECService.validateFEC(fecContent);

            if (!validation.valid) {
                console.error("[FEC_VALIDATION_ERROR]", validation.errors);
                throw new BusinessError("Le fichier FEC généré contient des erreurs");
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
        },
        {
            context: { resourceName: "Export", operation: "fec" },
        }
    );
}
