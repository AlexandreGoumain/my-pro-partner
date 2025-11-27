import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/rdv/[id]
 * Get a single rendez-vous
 */
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;

        const item = await prisma.rendezVous.findFirst({
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
                        telephone: true,
                        email: true,
                    },
                },
                prestation: {
                    select: {
                        id: true,
                        nom: true,
                        duree: true,
                        prix: true,
                    },
                },
                employe: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        couleur: true,
                    },
                },
            },
        });

        if (!item) {
            return NextResponse.json(
                { error: "Rendez-vous non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            ...item,
            prestation: item.prestation
                ? {
                      ...item.prestation,
                      prix: Number(item.prestation.prix),
                  }
                : null,
        });
    } catch (error) {
        console.error("Error fetching rendez-vous:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/rdv/[id]
 * Update a rendez-vous
 */
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;
        const body = await request.json();

        // Check item exists and belongs to entreprise
        const existing = await prisma.rendezVous.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Rendez-vous non trouvé" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: Record<string, unknown> = {};

        if (body.clientId !== undefined) {
            if (body.clientId) {
                const client = await prisma.client.findFirst({
                    where: {
                        id: body.clientId,
                        entrepriseId: session.user.entrepriseId,
                    },
                });
                if (!client) {
                    return NextResponse.json(
                        { error: "Client non trouvé" },
                        { status: 400 }
                    );
                }
            }
            updateData.clientId = body.clientId || null;
        }

        if (body.nomClient !== undefined) {
            if (!body.nomClient || body.nomClient.trim() === "") {
                return NextResponse.json(
                    { error: "Le nom du client est requis" },
                    { status: 400 }
                );
            }
            updateData.nomClient = body.nomClient.trim();
        }

        if (body.telephone !== undefined) {
            updateData.telephone = body.telephone?.trim() || null;
        }

        if (body.email !== undefined) {
            updateData.email = body.email?.trim() || null;
        }

        if (body.date !== undefined) {
            updateData.date = new Date(body.date);
        }

        if (body.heure !== undefined) {
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(body.heure)) {
                return NextResponse.json(
                    { error: "Format d'heure invalide (HH:MM)" },
                    { status: 400 }
                );
            }
            updateData.heure = body.heure;
        }

        if (body.duree !== undefined) {
            if (body.duree <= 0) {
                return NextResponse.json(
                    { error: "La durée doit être positive" },
                    { status: 400 }
                );
            }
            updateData.duree = body.duree;
        }

        if (body.prestationId !== undefined) {
            if (body.prestationId) {
                const prestation = await prisma.prestation.findFirst({
                    where: {
                        id: body.prestationId,
                        entrepriseId: session.user.entrepriseId,
                        actif: true,
                    },
                });
                if (!prestation) {
                    return NextResponse.json(
                        { error: "Prestation non trouvée ou inactive" },
                        { status: 400 }
                    );
                }
            }
            updateData.prestationId = body.prestationId || null;
        }

        if (body.employeId !== undefined) {
            if (body.employeId) {
                const employee = await prisma.employe.findFirst({
                    where: {
                        id: body.employeId,
                        entrepriseId: session.user.entrepriseId,
                        actif: true,
                    },
                });
                if (!employee) {
                    return NextResponse.json(
                        { error: "Employé non trouvé ou inactif" },
                        { status: 400 }
                    );
                }
            }
            updateData.employeId = body.employeId || null;
        }

        if (body.notes !== undefined) {
            updateData.notes = body.notes?.trim() || null;
        }

        if (body.statut !== undefined) {
            updateData.statut = body.statut;
        }

        // Update
        const item = await prisma.rendezVous.update({
            where: { id },
            data: updateData,
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                    },
                },
                prestation: {
                    select: {
                        id: true,
                        nom: true,
                        duree: true,
                        prix: true,
                    },
                },
                employe: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        couleur: true,
                    },
                },
            },
        });

        return NextResponse.json({
            ...item,
            prestation: item.prestation
                ? {
                      ...item.prestation,
                      prix: Number(item.prestation.prix),
                  }
                : null,
        });
    } catch (error) {
        console.error("Error updating rendez-vous:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/rdv/[id]
 * Delete a rendez-vous
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;

        // Check item exists and belongs to entreprise
        const existing = await prisma.rendezVous.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Rendez-vous non trouvé" },
                { status: 404 }
            );
        }

        // Delete
        await prisma.rendezVous.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting rendez-vous:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
