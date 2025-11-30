import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/charges/[id] - Get single appel de charges
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("charges_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const appelCharges = await prisma.appelCharges.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                        adresse: true,
                        ville: true,
                    },
                },
                lignes: {
                    include: {
                        lot: {
                            select: {
                                id: true,
                                numero: true,
                                typeLot: true,
                                tantiemesGeneraux: true,
                                coproprietaire: {
                                    select: {
                                        id: true,
                                        nom: true,
                                        prenom: true,
                                        telephone: true,
                                        email: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!appelCharges) {
            return NextResponse.json(
                { error: "Appel de charges non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ appelCharges });
    } catch (error) {
        console.error("Error fetching charges:", error);
        return NextResponse.json(
            { error: "Failed to fetch charges" },
            { status: 500 }
        );
    }
}

// PATCH /api/syndic/charges/[id] - Update appel de charges
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("charges_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify appel exists and belongs to entreprise
        const existing = await prisma.appelCharges.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Appel de charges non trouvé" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.statut !== undefined) {
            updateData.statut = body.statut;
        }

        if (body.montantTotal !== undefined) {
            updateData.montantTotal = body.montantTotal;
        }

        if (body.dateEcheance !== undefined) {
            updateData.dateEcheance = new Date(body.dateEcheance);
        }

        if (body.dateEnvoi !== undefined) {
            updateData.dateEnvoi = new Date(body.dateEnvoi);
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes;
        }

        const appelCharges = await prisma.appelCharges.update({
            where: { id },
            data: updateData,
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
                lignes: {
                    include: {
                        lot: {
                            select: {
                                id: true,
                                numero: true,
                                coproprietaire: {
                                    select: {
                                        nom: true,
                                        prenom: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ appelCharges });
    } catch (error) {
        console.error("Error updating charges:", error);
        return NextResponse.json(
            { error: "Failed to update charges" },
            { status: 500 }
        );
    }
}

// DELETE /api/syndic/charges/[id] - Delete appel de charges
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("charges_copro");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify appel exists and belongs to entreprise
        const existing = await prisma.appelCharges.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                lignes: true,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Appel de charges non trouvé" },
                { status: 404 }
            );
        }

        // Prevent deletion if any payment received
        const hasPayments = existing.lignes.some(l => Number(l.montantPaye) > 0);
        if (hasPayments) {
            return NextResponse.json(
                { error: "Impossible de supprimer un appel avec des paiements reçus" },
                { status: 400 }
            );
        }

        // Delete lignes first
        await prisma.ligneAppelCharges.deleteMany({
            where: { appelId: id },
        });

        await prisma.appelCharges.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting charges:", error);
        return NextResponse.json(
            { error: "Failed to delete charges" },
            { status: 500 }
        );
    }
}
