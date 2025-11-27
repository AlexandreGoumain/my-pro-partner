import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateAbonnementSchema = z.object({
    typeAbonnementId: z.string().optional(),
    dateDebut: z
        .string()
        .optional()
        .transform((str) => (str ? new Date(str) : undefined)),
    dateFin: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    dateResiliation: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    statut: z
        .enum(["ACTIF", "SUSPENDU", "EXPIRE", "RESILIE", "EN_ATTENTE"])
        .optional(),
    seancesRestantes: z.number().optional().nullable(),
    seancesUtilisees: z.number().optional(),
    montantPaye: z.number().optional(),
    prochainPaiement: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    modePaiement: z.string().optional().nullable(),
    numeroCarte: z.string().optional().nullable(),
    codeAcces: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/fitness/abonnements/[id]
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

        const abonnement = await prisma.abonnementFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                    },
                },
                typeAbonnement: true,
                presences: {
                    orderBy: { heureEntree: "desc" },
                    take: 20,
                },
                _count: {
                    select: { presences: true },
                },
            },
        });

        if (!abonnement) {
            return NextResponse.json(
                { error: "Abonnement non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(abonnement);
    } catch (error) {
        console.error("Erreur GET abonnement:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT /api/fitness/abonnements/[id]
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

        const existing = await prisma.abonnementFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Abonnement non trouvé" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validatedData = updateAbonnementSchema.parse(body);

        // Filtrer les valeurs undefined
        const updateData = Object.fromEntries(
            Object.entries(validatedData).filter(([, v]) => v !== undefined)
        );

        const abonnement = await prisma.abonnementFitness.update({
            where: { id },
            data: updateData,
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                    },
                },
                typeAbonnement: true,
            },
        });

        return NextResponse.json(abonnement);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur PUT abonnement:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/fitness/abonnements/[id]
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

        const existing = await prisma.abonnementFitness.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                _count: {
                    select: { presences: true },
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Abonnement non trouvé" },
                { status: 404 }
            );
        }

        if (existing._count.presences > 0) {
            return NextResponse.json(
                {
                    error: "Impossible de supprimer un abonnement avec des présences enregistrées. Résiliez-le plutôt.",
                },
                { status: 400 }
            );
        }

        await prisma.abonnementFitness.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur DELETE abonnement:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
