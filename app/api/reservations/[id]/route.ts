import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reservationUpdateSchema = z.object({
    clientId: z.string().nullable().optional(),
    nomClient: z.string().min(1).optional(),
    telephone: z.string().nullable().optional(),
    email: z
        .string()
        .email("Email invalide")
        .nullable()
        .optional()
        .or(z.literal("")),
    date: z.string().optional(),
    heure: z
        .string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format d'heure invalide")
        .optional(),
    personnes: z.number().int().min(1).optional(),
    tableId: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    statut: z
        .enum([
            "EN_ATTENTE",
            "CONFIRMEE",
            "ARRIVEE",
            "TERMINEE",
            "ANNULEE",
            "NO_SHOW",
        ])
        .optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

const reservationInclude = {
    table: {
        select: {
            id: true,
            numero: true,
            nom: true,
            zone: true,
        },
    },
    client: {
        select: {
            id: true,
            nom: true,
            prenom: true,
            telephone: true,
            email: true,
        },
    },
} as const;

/**
 * GET /api/reservations/[id]
 * Get reservation details
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const reservation = await prisma.reservation.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    table: {
                        select: {
                            id: true,
                            numero: true,
                            nom: true,
                            zone: true,
                            capacite: true,
                            statut: true,
                        },
                    },
                    client: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                            adresse: true,
                        },
                    },
                },
            });

            if (!reservation) {
                throw new NotFoundError("Réservation non trouvée");
            }

            return NextResponse.json({ reservation });
        },
        {
            capability: "agenda",
            context: { resourceName: "Reservation", operation: "get" },
        }
    );
}

/**
 * PUT /api/reservations/[id]
 * Update a reservation
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existingReservation = await prisma.reservation.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existingReservation) {
                throw new NotFoundError("Réservation non trouvée");
            }

            const body = await request.json();
            const validation = reservationUpdateSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const data = validation.data;

            // If tableId is being set, verify it exists and check capacity
            if (data.tableId !== undefined && data.tableId !== null) {
                const table = await prisma.tableRestaurant.findFirst({
                    where: {
                        id: data.tableId,
                        entrepriseId: ctx.entrepriseId,
                    },
                });

                if (!table) {
                    throw new NotFoundError("Table non trouvée");
                }

                const checkPersonnes = data.personnes ?? existingReservation.personnes;
                if (table.capacite < checkPersonnes) {
                    throw new BusinessError(
                        `La table a une capacité de ${table.capacite} personnes`
                    );
                }
            }

            // If clientId is being set, verify it exists
            if (data.clientId !== undefined && data.clientId !== null) {
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

            const updateData: Record<string, unknown> = {};
            if (data.clientId !== undefined) updateData.clientId = data.clientId;
            if (data.nomClient !== undefined) updateData.nomClient = data.nomClient;
            if (data.telephone !== undefined) updateData.telephone = data.telephone;
            if (data.email !== undefined) updateData.email = data.email || null;
            if (data.date !== undefined) updateData.date = new Date(data.date);
            if (data.heure !== undefined) updateData.heure = data.heure;
            if (data.personnes !== undefined) updateData.personnes = data.personnes;
            if (data.tableId !== undefined) updateData.tableId = data.tableId;
            if (data.notes !== undefined) updateData.notes = data.notes;
            if (data.statut !== undefined) updateData.statut = data.statut;

            const reservation = await prisma.reservation.update({
                where: { id },
                data: updateData,
                include: reservationInclude,
            });

            return NextResponse.json({ reservation });
        },
        {
            capability: "agenda",
            context: { resourceName: "Reservation", operation: "update" },
        }
    );
}

/**
 * DELETE /api/reservations/[id]
 * Delete a reservation
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
    return withApiHandler(
        async (ctx) => {
            const { id } = await params;

            const existingReservation = await prisma.reservation.findFirst({
                where: {
                    id,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!existingReservation) {
                throw new NotFoundError("Réservation non trouvée");
            }

            await prisma.reservation.delete({
                where: { id },
            });

            return NextResponse.json({ success: true });
        },
        {
            capability: "agenda",
            context: { resourceName: "Reservation", operation: "delete" },
        }
    );
}
