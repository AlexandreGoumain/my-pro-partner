import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DocumentStatut, DocumentType } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const documentSchema = z.object({
    numero: z.string().min(1, "Numéro requis"),
    type: z.enum(["DEVIS", "FACTURE", "AVOIR"]),
    clientId: z.string().min(1, "Client requis"),
    dateEmission: z.string().transform((s) => new Date(s)),
    dateEcheance: z
        .string()
        .transform((s) => new Date(s))
        .optional(),
    notes: z.string().optional(),
    conditions_paiement: z.string().optional(),
    validite_jours: z.number().default(30),
});

// GET: Récupérer tous les documents
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const typeParam = searchParams.get("type");
        const clientId = searchParams.get("clientId");
        const statutParam = searchParams.get("statut");

        // Type-safe enum validation
        const type =
            typeParam && Object.values(DocumentType).includes(typeParam as DocumentType)
                ? (typeParam as DocumentType)
                : undefined;
        const statut =
            statutParam && Object.values(DocumentStatut).includes(statutParam as DocumentStatut)
                ? (statutParam as DocumentStatut)
                : undefined;

        const documents = await prisma.document.findMany({
            where: {
                ...(type && { type }),
                ...(clientId && { clientId }),
                ...(statut && { statut }),
            },
            include: {
                client: true,
                lignes: {
                    include: {
                        article: true,
                    },
                },
                paiements: true,
            },
            orderBy: { dateEmission: "desc" },
        });

        return NextResponse.json(documents);
    } catch (error) {
        console.error("Erreur lors de la récupération des documents:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// POST: Créer un nouveau document
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { message: "Non autorisé" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const validation = documentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        // Get client to verify existence and get entrepriseId
        const client = await prisma.client.findUnique({
            where: { id: validation.data.clientId },
            select: { id: true, entrepriseId: true },
        });

        if (!client) {
            return NextResponse.json(
                { message: "Client non trouvé" },
                { status: 404 }
            );
        }

        // Vérifier si le numéro existe déjà pour cette entreprise
        const existingDoc = await prisma.document.findUnique({
            where: {
                entrepriseId_numero: {
                    entrepriseId: client.entrepriseId,
                    numero: validation.data.numero,
                },
            },
        });

        if (existingDoc) {
            return NextResponse.json(
                { message: "Ce numéro de document existe déjà" },
                { status: 400 }
            );
        }

        const document = await prisma.document.create({
            data: {
                ...validation.data,
                statut: "BROUILLON",
                entrepriseId: client.entrepriseId,
            },
            include: {
                client: true,
                lignes: true,
            },
        });

        return NextResponse.json(document, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de la création du document:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
