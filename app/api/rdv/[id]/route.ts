import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface RouteContext {
    params: Promise<{ id: string }>;
}

// Includes communs pour les rendez-vous
const rdvInclude = {
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
} as const;

// Helper pour formater le rendez-vous
function formatRdv(item: Record<string, unknown>) {
    const prestation = item.prestation as Record<string, unknown> | null;
    return {
        ...item,
        prestation: prestation
            ? { ...prestation, prix: Number(prestation.prix) }
            : null,
    };
}

// Schema de validation pour la mise à jour
const rdvUpdateSchema = z.object({
    clientId: z.string().nullable().optional(),
    nomClient: z.string().min(1, "Le nom du client est requis").optional(),
    telephone: z.string().nullable().optional(),
    email: z.string().email("Email invalide").nullable().optional(),
    date: z.string().optional(),
    heure: z.string().regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Format d'heure invalide (HH:MM)"
    ).optional(),
    duree: z.number().int().positive("La durée doit être positive").optional(),
    prestationId: z.string().nullable().optional(),
    employeId: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    statut: z.enum(["EN_ATTENTE", "CONFIRME", "EN_COURS", "TERMINE", "ANNULE"]).optional(),
});

/**
 * GET /api/rdv/[id]
 * Get a single rendez-vous
 */
export async function GET(_request: NextRequest, context: RouteContext) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await context.params;

            const item = await prisma.rendezVous.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: rdvInclude,
            });

            if (!item) {
                throw new NotFoundError("Rendez-vous non trouvé");
            }

            return NextResponse.json(formatRdv(item));
        },
        {
            capability: "agenda",
            context: { resourceName: "RendezVous", operation: "get" },
        }
    );
}

/**
 * PUT /api/rdv/[id]
 * Update a rendez-vous
 */
export async function PUT(request: NextRequest, context: RouteContext) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await context.params;
            const body = await request.json();

            // Validate input
            const validation = rdvUpdateSchema.safeParse(body);
            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            // Check item exists and belongs to entreprise
            const existing = await prisma.rendezVous.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Rendez-vous non trouvé");
            }

            const data = validation.data;
            const updateData: Record<string, unknown> = {};

            // Validate and set clientId
            if (data.clientId !== undefined) {
                if (data.clientId) {
                    const client = await prisma.client.findFirst({
                        where: {
                            id: data.clientId,
                            entrepriseId: ctx.entrepriseId,
                        },
                    });
                    if (!client) {
                        throw new NotFoundError("Client non trouvé");
                    }
                }
                updateData.clientId = data.clientId;
            }

            // Validate and set prestationId
            if (data.prestationId !== undefined) {
                if (data.prestationId) {
                    const prestation = await prisma.prestation.findFirst({
                        where: {
                            id: data.prestationId,
                            entrepriseId: ctx.entrepriseId,
                            actif: true,
                        },
                    });
                    if (!prestation) {
                        throw new NotFoundError("Prestation non trouvée ou inactive");
                    }
                }
                updateData.prestationId = data.prestationId;
            }

            // Validate and set employeId
            if (data.employeId !== undefined) {
                if (data.employeId) {
                    const employee = await prisma.employe.findFirst({
                        where: {
                            id: data.employeId,
                            entrepriseId: ctx.entrepriseId,
                            actif: true,
                        },
                    });
                    if (!employee) {
                        throw new NotFoundError("Employé non trouvé ou inactif");
                    }
                }
                updateData.employeId = data.employeId;
            }

            // Set simple fields
            if (data.nomClient !== undefined) updateData.nomClient = data.nomClient.trim();
            if (data.telephone !== undefined) updateData.telephone = data.telephone?.trim() || null;
            if (data.email !== undefined) updateData.email = data.email?.trim() || null;
            if (data.date !== undefined) updateData.date = new Date(data.date);
            if (data.heure !== undefined) updateData.heure = data.heure;
            if (data.duree !== undefined) updateData.duree = data.duree;
            if (data.notes !== undefined) updateData.notes = data.notes?.trim() || null;
            if (data.statut !== undefined) updateData.statut = data.statut;

            // Update
            const item = await prisma.rendezVous.update({
                where: { id },
                data: updateData,
                include: rdvInclude,
            });

            return NextResponse.json(formatRdv(item));
        },
        {
            capability: "agenda",
            context: { resourceName: "RendezVous", operation: "update" },
        }
    );
}

/**
 * DELETE /api/rdv/[id]
 * Delete a rendez-vous
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await context.params;

            // Check item exists and belongs to entreprise
            const existing = await prisma.rendezVous.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existing) {
                throw new NotFoundError("Rendez-vous non trouvé");
            }

            await prisma.rendezVous.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        },
        {
            capability: "agenda",
            context: { resourceName: "RendezVous", operation: "delete" },
        }
    );
}
