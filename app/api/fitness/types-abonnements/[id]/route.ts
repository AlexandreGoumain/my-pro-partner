import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateTypeAbonnementSchema = z.object({
    nom: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    prix: z.number().min(0).optional(),
    periodicite: z
        .enum([
            "JOURNALIER",
            "HEBDOMADAIRE",
            "MENSUEL",
            "TRIMESTRIEL",
            "SEMESTRIEL",
            "ANNUEL",
            "ILLIMITE",
        ])
        .optional(),
    dureeJours: z.number().optional().nullable(),
    nombreSeances: z.number().optional().nullable(),
    accesIllimite: z.boolean().optional(),
    nombreAccesSemaine: z.number().optional().nullable(),
    accesCours: z.boolean().optional(),
    accesZonesPremium: z.boolean().optional(),
    engagementMois: z.number().optional(),
    fraisInscription: z.number().optional(),
    actif: z.boolean().optional(),
    ordre: z.number().optional(),
    couleur: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/fitness/types-abonnements/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const type = await prisma.typeAbonnementFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                _count: {
                    select: { abonnements: true },
                },
            },
        });

        if (!type) {
            return NextResponse.json(
                { error: "Type d'abonnement non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(type);
    } catch (error) {
        console.error("Erreur GET type-abonnement:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT /api/fitness/types-abonnements/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("abonnements_fitness");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const existing = await prisma.typeAbonnementFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Type d'abonnement non trouvé" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validatedData = updateTypeAbonnementSchema.parse(body);

        const type = await prisma.typeAbonnementFitness.update({
            where: { id },
            data: validatedData,
        });

        return NextResponse.json(type);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur PUT type-abonnement:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/fitness/types-abonnements/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("abonnements_fitness");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const existing = await prisma.typeAbonnementFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                _count: {
                    select: { abonnements: true },
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Type d'abonnement non trouvé" },
                { status: 404 }
            );
        }

        if (existing._count.abonnements > 0) {
            return NextResponse.json(
                {
                    error: "Impossible de supprimer un type d'abonnement avec des abonnements actifs. Désactivez-le plutôt.",
                },
                { status: 400 }
            );
        }

        await prisma.typeAbonnementFitness.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur DELETE type-abonnement:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
