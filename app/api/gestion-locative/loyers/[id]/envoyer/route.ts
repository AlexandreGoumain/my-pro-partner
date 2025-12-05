import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, BusinessError } from "@/lib/errors";
import { emailService } from "@/lib/email/email-service";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

const MOIS_LABELS: Record<number, string> = {
    1: "Janvier",
    2: "Février",
    3: "Mars",
    4: "Avril",
    5: "Mai",
    6: "Juin",
    7: "Juillet",
    8: "Août",
    9: "Septembre",
    10: "Octobre",
    11: "Novembre",
    12: "Décembre",
};

function getLoyerEmailTemplate(data: {
    locataireNom: string;
    bienTitre: string;
    bienAdresse?: string;
    mois: number;
    annee: number;
    totalDu: number;
    loyerHC: number;
    provisions: number;
    entrepriseName: string;
    dateEcheance?: string;
}): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appel de loyer</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #000000;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin: 0;">Appel de loyer - ${MOIS_LABELS[data.mois]} ${data.annee}</h1>
        </div>

        <div style="background-color: #fafafa; border: 1px solid rgba(0,0,0,0.08); border-radius: 8px; padding: 32px;">
            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 20px 0;">
                Bonjour ${data.locataireNom},
            </p>

            <p style="font-size: 15px; line-height: 1.6; color: rgba(0,0,0,0.8); margin: 0 0 24px 0;">
                Veuillez trouver ci-dessous le détail de votre appel de loyer pour le mois de <strong>${MOIS_LABELS[data.mois]} ${data.annee}</strong>.
            </p>

            <div style="background-color: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 6px; padding: 20px; margin: 24px 0;">
                <p style="font-size: 13px; color: rgba(0,0,0,0.5); margin: 0 0 12px 0; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                    Bien concerné
                </p>
                <p style="font-size: 14px; color: #000000; font-weight: 500; margin: 0 0 4px 0;">${data.bienTitre}</p>
                ${data.bienAdresse ? `<p style="font-size: 13px; color: rgba(0,0,0,0.6); margin: 0;">${data.bienAdresse}</p>` : ""}
            </div>

            <div style="background-color: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 6px; padding: 20px; margin: 24px 0;">
                <p style="font-size: 13px; color: rgba(0,0,0,0.5); margin: 0 0 16px 0; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                    Détail du loyer
                </p>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="font-size: 14px; color: rgba(0,0,0,0.6);">Loyer hors charges</span>
                    <span style="font-size: 14px; color: #000000;">${data.loyerHC.toFixed(2)} €</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                    <span style="font-size: 14px; color: rgba(0,0,0,0.6);">Provisions sur charges</span>
                    <span style="font-size: 14px; color: #000000;">${data.provisions.toFixed(2)} €</span>
                </div>
                <div style="border-top: 1px solid rgba(0,0,0,0.08); padding-top: 12px; display: flex; justify-content: space-between;">
                    <span style="font-size: 15px; font-weight: 600; color: #000000;">Total à payer</span>
                    <span style="font-size: 15px; font-weight: 600; color: #000000;">${data.totalDu.toFixed(2)} €</span>
                </div>
            </div>

            ${data.dateEcheance ? `
            <div style="background-color: rgba(0,0,0,0.03); border-radius: 6px; padding: 16px; margin-top: 24px;">
                <p style="font-size: 13px; line-height: 1.6; color: rgba(0,0,0,0.6); margin: 0;">
                    Date d'échéance : <strong>${data.dateEcheance}</strong>
                </p>
            </div>
            ` : ""}
        </div>

        <div style="text-align: center; margin-top: 40px;">
            <p style="font-size: 12px; color: rgba(0,0,0,0.4); margin: 0;">
                Cordialement,<br>${data.entrepriseName}
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
}

/**
 * PATCH /api/gestion-locative/loyers/[id]/envoyer
 * Mark loyer as sent
 */
export async function PATCH(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existing = await prisma.appelLoyer.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Loyer non trouvé");
            }

            if (existing.statut !== "A_ENVOYER") {
                throw new BusinessError("Ce loyer a déjà été envoyé");
            }

            const loyer = await prisma.appelLoyer.update({
                where: { id },
                data: {
                    statut: "ENVOYE",
                },
                include: {
                    bail: {
                        include: {
                            bien: {
                                select: {
                                    id: true,
                                    reference: true,
                                    titre: true,
                                },
                            },
                            locatairePrincipal: {
                                select: {
                                    nom: true,
                                    prenom: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });

            let emailSent = false;
            if (loyer.bail?.locatairePrincipal?.email) {
                const parametres = await prisma.parametresEntreprise.findUnique({
                    where: { entrepriseId: ctx.entrepriseId },
                    select: { nom_entreprise: true },
                });

                const locataire = loyer.bail.locatairePrincipal;
                const bien = loyer.bail.bien;
                const locataireNom = [locataire.prenom, locataire.nom].filter(Boolean).join(" ") || "Locataire";

                const emailHtml = getLoyerEmailTemplate({
                    locataireNom,
                    bienTitre: bien?.titre || "Bien",
                    mois: loyer.mois,
                    annee: loyer.annee,
                    totalDu: Number(loyer.totalDu),
                    loyerHC: Number(loyer.loyerHC),
                    provisions: Number(loyer.provisions),
                    entrepriseName: parametres?.nom_entreprise || "Votre gestionnaire",
                });

                const result = await emailService.sendEmail({
                    to: locataire.email!,
                    subject: `Appel de loyer - ${MOIS_LABELS[loyer.mois]} ${loyer.annee}`,
                    html: emailHtml,
                    fromName: parametres?.nom_entreprise,
                });

                emailSent = result.success;
            }

            return NextResponse.json({
                loyer,
                emailSent,
                message: emailSent
                    ? "Appel de loyer envoyé par email"
                    : "Appel de loyer marqué comme envoyé",
            });
        },
        {
            anyCapability: ["loyers"],
            context: { resourceName: "AppelLoyer", operation: "send" },
        }
    );
}
