import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// POST: Convertir un devis en facture
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Récupérer le devis
        const devis = await prisma.document.findUnique({
            where: { id },
            include: {
                lignes: {
                    orderBy: { ordre: "asc" },
                },
                client: true,
            },
        });

        if (!devis) {
            return NextResponse.json(
                { message: "Devis non trouvé" },
                { status: 404 }
            );
        }

        if (devis.type !== "DEVIS") {
            return NextResponse.json(
                { message: "Ce document n'est pas un devis" },
                { status: 400 }
            );
        }

        if (devis.statut !== "ACCEPTE") {
            return NextResponse.json(
                { message: "Seuls les devis acceptés peuvent être convertis en facture" },
                { status: 400 }
            );
        }

        // Vérifier si le devis a déjà été converti
        const existingInvoice = await prisma.document.findFirst({
            where: { devisId: devis.id },
        });

        if (existingInvoice) {
            return NextResponse.json(
                { message: "Ce devis a déjà été converti en facture" },
                { status: 400 }
            );
        }

        // Get parametres to generate invoice number
        let parametres = await prisma.parametresEntreprise.findUnique({
            where: { entrepriseId: devis.entrepriseId },
        });

        // Create parametres if not exists
        if (!parametres) {
            parametres = await prisma.parametresEntreprise.create({
                data: {
                    entrepriseId: devis.entrepriseId,
                    nom_entreprise: "Mon Entreprise",
                },
            });
        }

        const prefixe = parametres.prefixe_facture;
        const prochainNumero = parametres.prochain_numero_facture;
        const numero = `${prefixe}${prochainNumero.toString().padStart(5, "0")}`;

        // Créer la facture à partir du devis
        const invoice = await prisma.document.create({
            data: {
                numero,
                type: "FACTURE",
                clientId: devis.clientId,
                entrepriseId: devis.entrepriseId,
                dateEmission: new Date(),
                dateEcheance: devis.dateEcheance || null,
                statut: "ENVOYE",
                notes: devis.notes,
                conditions_paiement: devis.conditions_paiement,
                validite_jours: devis.validite_jours,
                total_ht: devis.total_ht,
                total_tva: devis.total_tva,
                total_ttc: devis.total_ttc,
                reste_a_payer: devis.total_ttc,
                devisId: devis.id,
                lignes: {
                    create: devis.lignes.map((ligne) => ({
                        ordre: ligne.ordre,
                        articleId: ligne.articleId,
                        designation: ligne.designation,
                        description: ligne.description,
                        quantite: ligne.quantite,
                        prix_unitaire_ht: ligne.prix_unitaire_ht,
                        tva_taux: ligne.tva_taux,
                        remise_pourcent: ligne.remise_pourcent,
                        montant_ht: ligne.montant_ht,
                        montant_tva: ligne.montant_tva,
                        montant_ttc: ligne.montant_ttc,
                    })),
                },
            },
            include: {
                client: true,
                lignes: true,
            },
        });

        // Update prochain numero
        await prisma.parametresEntreprise.update({
            where: { entrepriseId: devis.entrepriseId },
            data: { prochain_numero_facture: prochainNumero + 1 },
        });

        return NextResponse.json({ invoice }, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de la conversion du devis:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
