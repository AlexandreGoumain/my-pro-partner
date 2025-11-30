import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/gestion-locative/loyers/[id] - Get single loyer
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

        const capabilityCheck = await requireAnyCapability("loyers");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const loyer = await prisma.appelLoyer.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                bail: {
                    include: {
                        bien: {
                            select: {
                                id: true,
                                reference: true,
                                titre: true,
                                adresse: true,
                                ville: true,
                            },
                        },
                        locatairePrincipal: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                                telephone: true,
                                email: true,
                            },
                        },
                        proprietaire: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                            },
                        },
                    },
                },
            },
        });

        if (!loyer) {
            return NextResponse.json(
                { error: "Loyer non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ loyer });
    } catch (error) {
        console.error("Error fetching loyer:", error);
        return NextResponse.json(
            { error: "Failed to fetch loyer" },
            { status: 500 }
        );
    }
}

// PATCH /api/gestion-locative/loyers/[id] - Update loyer (status, payment)
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

        const capabilityCheck = await requireAnyCapability("loyers");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify loyer exists and belongs to entreprise
        const existing = await prisma.appelLoyer.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Loyer non trouvé" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.statut) {
            updateData.statut = body.statut;
        }

        if (body.montantPaye !== undefined) {
            updateData.montantPaye = body.montantPaye;

            // Update status based on payment
            const totalDu = Number(existing.totalDu);
            const montantPaye = Number(body.montantPaye);

            if (montantPaye >= totalDu) {
                updateData.statut = "PAYE";
            } else if (montantPaye > 0) {
                updateData.statut = "PARTIELLEMENT_PAYE";
            }
        }

        if (body.datePaiement) {
            updateData.datePaiement = new Date(body.datePaiement);
        }

        if (body.dateEnvoi) {
            updateData.dateEnvoi = new Date(body.dateEnvoi);
            if (!body.statut && existing.statut === "A_ENVOYER") {
                updateData.statut = "ENVOYE";
            }
        }

        if (body.quittanceUrl) {
            updateData.quittanceUrl = body.quittanceUrl;
            updateData.quittanceGeneree = true;
        }

        const loyer = await prisma.appelLoyer.update({
            where: { id },
            data: updateData,
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
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ loyer });
    } catch (error) {
        console.error("Error updating loyer:", error);
        return NextResponse.json(
            { error: "Failed to update loyer" },
            { status: 500 }
        );
    }
}

// DELETE /api/gestion-locative/loyers/[id] - Delete loyer
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

        const capabilityCheck = await requireAnyCapability("loyers");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify loyer exists and belongs to entreprise
        const existing = await prisma.appelLoyer.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Loyer non trouvé" },
                { status: 404 }
            );
        }

        // Only allow deletion if not already paid
        if (existing.statut === "PAYE") {
            return NextResponse.json(
                { error: "Impossible de supprimer un loyer déjà payé" },
                { status: 400 }
            );
        }

        await prisma.appelLoyer.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting loyer:", error);
        return NextResponse.json(
            { error: "Failed to delete loyer" },
            { status: 500 }
        );
    }
}
