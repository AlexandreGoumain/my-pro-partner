import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
        const type = searchParams.get("type");
        const clientId = searchParams.get("clientId");
        const statut = searchParams.get("statut");

        const documents = await prisma.document.findMany({
            where: {
                ...(type && { type: type as any }),
                ...(clientId && { clientId }),
                ...(statut && { statut: statut as any }),
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

        // Vérifier si le numéro existe déjà
        const existingDoc = await prisma.document.findUnique({
            where: { numero: validation.data.numero },
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
