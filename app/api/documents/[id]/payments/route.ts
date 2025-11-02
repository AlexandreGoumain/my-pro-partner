import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const paymentSchema = z.object({
    montant: z.number().positive("Le montant doit être positif"),
    moyen_paiement: z.enum(["ESPECES", "CHEQUE", "VIREMENT", "CARTE", "PRELEVEMENT"]),
    date_paiement: z.string().transform((s) => new Date(s)),
    reference: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});

// POST: Ajouter un paiement à une facture
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
        const body = await req.json();

        const validation = paymentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        // Récupérer le document
        const document = await prisma.document.findUnique({
            where: { id },
            include: {
                paiements: true,
            },
        });

        if (!document) {
            return NextResponse.json(
                { message: "Document non trouvé" },
                { status: 404 }
            );
        }

        if (document.type !== "FACTURE") {
            return NextResponse.json(
                { message: "Seules les factures peuvent recevoir des paiements" },
                { status: 400 }
            );
        }

        if (document.statut === "ANNULE") {
            return NextResponse.json(
                { message: "Impossible d'ajouter un paiement à une facture annulée" },
                { status: 400 }
            );
        }

        // Vérifier que le montant ne dépasse pas le reste à payer
        if (validation.data.montant > Number(document.reste_a_payer)) {
            return NextResponse.json(
                { message: "Le montant du paiement dépasse le reste à payer" },
                { status: 400 }
            );
        }

        // Créer le paiement
        const paiement = await prisma.paiement.create({
            data: {
                documentId: document.id,
                montant: validation.data.montant,
                moyen_paiement: validation.data.moyen_paiement,
                date_paiement: validation.data.date_paiement,
                reference: validation.data.reference || null,
                notes: validation.data.notes || null,
            },
        });

        // Calculer le nouveau reste à payer
        const nouveauResteAPayer = Number(document.reste_a_payer) - validation.data.montant;

        // Mettre à jour le document
        const updatedDocument = await prisma.document.update({
            where: { id },
            data: {
                reste_a_payer: nouveauResteAPayer,
                statut: nouveauResteAPayer === 0 ? "PAYE" : document.statut,
            },
            include: {
                client: true,
                lignes: true,
                paiements: {
                    orderBy: { date_paiement: "desc" },
                },
            },
        });

        return NextResponse.json(
            {
                paiement,
                document: updatedDocument,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Erreur lors de l'ajout du paiement:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
