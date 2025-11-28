import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { EcheanceFiscaleUpdateInput } from "@/lib/types/mission";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET /api/echeances/[id] - Get single échéance
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const echeance = await prisma.echeanceFiscale.findFirst({
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
                mission: {
                    select: {
                        id: true,
                        numero: true,
                        nom: true,
                        typeDossier: true,
                    },
                },
            },
        });

        if (!echeance) {
            return NextResponse.json(
                { error: "Échéance introuvable" },
                { status: 404 }
            );
        }

        // Convert montant to number
        const formattedEcheance = {
            ...echeance,
            montant: echeance.montant ? Number(echeance.montant) : null,
        };

        return NextResponse.json({ echeance: formattedEcheance });
    } catch (error) {
        console.error("Error fetching echeance:", error);
        return NextResponse.json(
            { error: "Failed to fetch echeance" },
            { status: 500 }
        );
    }
}

// PUT /api/echeances/[id] - Update échéance
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body: EcheanceFiscaleUpdateInput = await request.json();

        // Verify échéance exists and belongs to enterprise
        const existing = await prisma.echeanceFiscale.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Échéance introuvable" },
                { status: 404 }
            );
        }

        const echeance = await prisma.echeanceFiscale.update({
            where: { id },
            data: {
                ...(body.type && { type: body.type }),
                ...(body.libelle && { libelle: body.libelle.trim() }),
                ...(body.dateEcheance && {
                    dateEcheance: new Date(body.dateEcheance),
                }),
                ...(body.dateRealisation !== undefined && {
                    dateRealisation: body.dateRealisation
                        ? new Date(body.dateRealisation)
                        : null,
                }),
                ...(body.dateDepot !== undefined && {
                    dateDepot: body.dateDepot ? new Date(body.dateDepot) : null,
                }),
                ...(body.statut && { statut: body.statut }),
                ...(body.periodicite && { periodicite: body.periodicite }),
                ...(body.exerciceFiscal !== undefined && {
                    exerciceFiscal: body.exerciceFiscal || null,
                }),
                ...(body.periodeDebut !== undefined && {
                    periodeDebut: body.periodeDebut
                        ? new Date(body.periodeDebut)
                        : null,
                }),
                ...(body.periodeFin !== undefined && {
                    periodeFin: body.periodeFin
                        ? new Date(body.periodeFin)
                        : null,
                }),
                ...(body.montant !== undefined && {
                    montant: body.montant || null,
                }),
                ...(body.reference !== undefined && {
                    reference: body.reference || null,
                }),
                ...(body.notes !== undefined && {
                    notes: body.notes || null,
                }),
                ...(body.rappelEnvoye !== undefined && {
                    rappelEnvoye: body.rappelEnvoye,
                }),
                ...(body.dateRappel !== undefined && {
                    dateRappel: body.dateRappel
                        ? new Date(body.dateRappel)
                        : null,
                }),
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
                mission: {
                    select: {
                        id: true,
                        numero: true,
                        nom: true,
                    },
                },
            },
        });

        // Convert montant to number
        const formattedEcheance = {
            ...echeance,
            montant: echeance.montant ? Number(echeance.montant) : null,
        };

        return NextResponse.json({ echeance: formattedEcheance });
    } catch (error) {
        console.error("Error updating echeance:", error);
        return NextResponse.json(
            { error: "Failed to update echeance" },
            { status: 500 }
        );
    }
}

// DELETE /api/echeances/[id] - Delete échéance
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify échéance exists and belongs to enterprise
        const existing = await prisma.echeanceFiscale.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Échéance introuvable" },
                { status: 404 }
            );
        }

        await prisma.echeanceFiscale.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting echeance:", error);
        return NextResponse.json(
            { error: "Failed to delete echeance" },
            { status: 500 }
        );
    }
}
