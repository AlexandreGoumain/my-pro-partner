import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateCabineSchema = z.object({
    nom: z.string().min(1).optional(),
    description: z.string().optional(),
    type: z.string().optional(),
    capacite: z.number().min(1).optional(),
    equipements: z.string().optional(),
    couleur: z.string().optional(),
    actif: z.boolean().optional(),
    ordre: z.number().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/cabines/[id] - Détail d'une cabine
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

        const cabine = await prisma.cabine.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                _count: {
                    select: { rendezVous: true },
                },
            },
        });

        if (!cabine) {
            return NextResponse.json(
                { error: "Cabine non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json(cabine);
    } catch (error) {
        console.error("Erreur GET cabine:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// PUT /api/cabines/[id] - Modifier une cabine
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Vérifier que la cabine appartient à l'entreprise
        const existing = await prisma.cabine.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Cabine non trouvée" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validatedData = updateCabineSchema.parse(body);

        const cabine = await prisma.cabine.update({
            where: { id },
            data: validatedData,
        });

        return NextResponse.json(cabine);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur PUT cabine:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// DELETE /api/cabines/[id] - Supprimer une cabine
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Vérifier que la cabine appartient à l'entreprise
        const existing = await prisma.cabine.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                _count: {
                    select: { rendezVous: true },
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Cabine non trouvée" },
                { status: 404 }
            );
        }

        // Vérifier s'il y a des RDV associés
        if (existing._count.rendezVous > 0) {
            return NextResponse.json(
                {
                    error: "Impossible de supprimer une cabine avec des rendez-vous associés. Désactivez-la plutôt.",
                },
                { status: 400 }
            );
        }

        await prisma.cabine.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur DELETE cabine:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
