import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema for update
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

type Params = { params: Promise<{ id: string }> };

// GET /api/reservations/[id] - Get reservation detail
export async function GET(request: NextRequest, { params }: Params) {
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

        const { id } = await params;

        const reservation = await prisma.reservation.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
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
            return NextResponse.json(
                { error: "Réservation non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({ reservation });
    } catch (error) {
        console.error("Error fetching reservation:", error);
        return NextResponse.json(
            { error: "Failed to fetch reservation" },
            { status: 500 }
        );
    }
}

// PUT /api/reservations/[id] - Update reservation
export async function PUT(request: NextRequest, { params }: Params) {
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

        const { id } = await params;

        // Check if reservation exists
        const existingReservation = await prisma.reservation.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existingReservation) {
            return NextResponse.json(
                { error: "Réservation non trouvée" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const validation = reservationUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const {
            clientId,
            nomClient,
            telephone,
            email,
            date,
            heure,
            personnes,
            tableId,
            notes,
            statut,
        } = validation.data;

        // If tableId is being set, verify it exists and check capacity
        if (tableId !== undefined && tableId !== null) {
            const table = await prisma.tableRestaurant.findFirst({
                where: {
                    id: tableId,
                    entrepriseId: session.user.entrepriseId,
                },
            });

            if (!table) {
                return NextResponse.json(
                    { error: "Table non trouvée" },
                    { status: 400 }
                );
            }

            const checkPersonnes = personnes ?? existingReservation.personnes;
            if (table.capacite < checkPersonnes) {
                return NextResponse.json(
                    {
                        error: `La table a une capacité de ${table.capacite} personnes`,
                    },
                    { status: 400 }
                );
            }
        }

        // If clientId is being set, verify it exists
        if (clientId !== undefined && clientId !== null) {
            const client = await prisma.client.findFirst({
                where: {
                    id: clientId,
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

        const updateData: any = {};
        if (clientId !== undefined) updateData.clientId = clientId;
        if (nomClient !== undefined) updateData.nomClient = nomClient;
        if (telephone !== undefined) updateData.telephone = telephone;
        if (email !== undefined) updateData.email = email || null;
        if (date !== undefined) updateData.date = new Date(date);
        if (heure !== undefined) updateData.heure = heure;
        if (personnes !== undefined) updateData.personnes = personnes;
        if (tableId !== undefined) updateData.tableId = tableId;
        if (notes !== undefined) updateData.notes = notes;
        if (statut !== undefined) updateData.statut = statut;

        const reservation = await prisma.reservation.update({
            where: { id },
            data: updateData,
            include: {
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
            },
        });

        return NextResponse.json({ reservation });
    } catch (error) {
        console.error("Error updating reservation:", error);
        return NextResponse.json(
            { error: "Failed to update reservation" },
            { status: 500 }
        );
    }
}

// DELETE /api/reservations/[id] - Delete reservation
export async function DELETE(request: NextRequest, { params }: Params) {
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

        const { id } = await params;

        // Check if reservation exists
        const existingReservation = await prisma.reservation.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existingReservation) {
            return NextResponse.json(
                { error: "Réservation non trouvée" },
                { status: 404 }
            );
        }

        await prisma.reservation.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        return NextResponse.json(
            { error: "Failed to delete reservation" },
            { status: 500 }
        );
    }
}
