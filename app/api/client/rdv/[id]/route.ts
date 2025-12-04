import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError, ensureClientOwnership } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/client/rdv/[id]
 * Get a specific appointment detail
 */
export async function GET(req: NextRequest, context: RouteContext) {
    try {
        const { client, entrepriseId } = await requireClientAuth(req);
        const { id } = await context.params;

        const rendezVous = await prisma.rendezVous.findFirst({
            where: {
                id,
                entrepriseId,
            },
            include: {
                prestation: {
                    select: {
                        id: true,
                        nom: true,
                        description: true,
                        duree: true,
                        prix: true,
                        categorie: true,
                    },
                },
                employe: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        couleur: true,
                        bio: true,
                    },
                },
                cabine: {
                    select: {
                        id: true,
                        nom: true,
                        type: true,
                    },
                },
            },
        });

        if (!rendezVous) {
            return NextResponse.json(
                { error: "Rendez-vous non trouvé" },
                { status: 404 }
            );
        }

        // Ensure client can only access their own appointments
        if (rendezVous.clientId) {
            ensureClientOwnership(client.id, rendezVous.clientId);
        }

        return NextResponse.json({ rendezVous });
    } catch (error) {
        if (error instanceof Error && error.message.includes("Access denied")) {
            return NextResponse.json(
                { error: "Vous n'avez pas accès à ce rendez-vous" },
                { status: 403 }
            );
        }
        return handleClientAuthError(error);
    }
}

/**
 * DELETE /api/client/rdv/[id]
 * Cancel an appointment
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
    try {
        const { client, entrepriseId } = await requireClientAuth(req);
        const { id } = await context.params;

        // Find the appointment
        const rendezVous = await prisma.rendezVous.findFirst({
            where: {
                id,
                entrepriseId,
            },
        });

        if (!rendezVous) {
            return NextResponse.json(
                { error: "Rendez-vous non trouvé" },
                { status: 404 }
            );
        }

        // Ensure client can only cancel their own appointments
        if (rendezVous.clientId) {
            ensureClientOwnership(client.id, rendezVous.clientId);
        }

        // Check if appointment can be cancelled
        if (["ANNULE", "NO_SHOW", "TERMINE"].includes(rendezVous.statut)) {
            return NextResponse.json(
                { error: "Ce rendez-vous ne peut plus être annulé" },
                { status: 400 }
            );
        }

        // Check if appointment is not too close (24h rule)
        const rdvDateTime = new Date(rendezVous.date);
        const [hours, minutes] = rendezVous.heure.split(":").map(Number);
        rdvDateTime.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const hoursUntilRdv = (rdvDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilRdv < 24) {
            return NextResponse.json(
                { error: "Impossible d'annuler un rendez-vous moins de 24h avant" },
                { status: 400 }
            );
        }

        // Cancel the appointment
        const updated = await prisma.rendezVous.update({
            where: { id },
            data: {
                statut: "ANNULE",
            },
        });

        // TODO: Send notification to admin about cancellation

        return NextResponse.json({
            message: "Rendez-vous annulé avec succès",
            rendezVous: updated,
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes("Access denied")) {
            return NextResponse.json(
                { error: "Vous n'avez pas accès à ce rendez-vous" },
                { status: 403 }
            );
        }
        return handleClientAuthError(error);
    }
}
