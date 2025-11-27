import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const reservationCreateSchema = z.object({
    clientId: z.string().optional(),
    nomClient: z.string().min(1, "Le nom du client est requis"),
    telephone: z.string().optional(),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    date: z.string().min(1, "La date est requise"),
    heure: z
        .string()
        .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Format d'heure invalide (HH:MM)"
        ),
    personnes: z.number().int().min(1, "Au moins 1 personne requise"),
    tableId: z.string().optional(),
    notes: z.string().optional(),
});

// GET /api/reservations - List reservations with filters
export async function GET(request: NextRequest) {
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

        const searchParams = request.nextUrl.searchParams;
        const date = searchParams.get("date"); // Format: YYYY-MM-DD
        const dateStart = searchParams.get("dateStart"); // Range start
        const dateEnd = searchParams.get("dateEnd"); // Range end
        const statut = searchParams.get("statut");
        const tableId = searchParams.get("tableId");
        const search = searchParams.get("search");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        // Filter by specific date
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            where.date = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }

        // Filter by date range
        if (dateStart || dateEnd) {
            where.date = {};
            if (dateStart) {
                const start = new Date(dateStart);
                start.setHours(0, 0, 0, 0);
                where.date.gte = start;
            }
            if (dateEnd) {
                const end = new Date(dateEnd);
                end.setHours(23, 59, 59, 999);
                where.date.lte = end;
            }
        }

        if (statut && statut !== "all") {
            where.statut = statut;
        }

        if (tableId && tableId !== "all") {
            where.tableId = tableId;
        }

        if (search) {
            where.OR = [
                { nomClient: { contains: search, mode: "insensitive" } },
                { telephone: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { notes: { contains: search, mode: "insensitive" } },
            ];
        }

        const [reservations, total] = await Promise.all([
            prisma.reservation.findMany({
                where,
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
                orderBy: [{ date: "asc" }, { heure: "asc" }],
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.reservation.count({ where }),
        ]);

        return NextResponse.json({
            reservations,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        return NextResponse.json(
            { error: "Failed to fetch reservations" },
            { status: 500 }
        );
    }
}

// POST /api/reservations - Create new reservation
export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const validation = reservationCreateSchema.safeParse(body);

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
        } = validation.data;

        // If tableId is provided, verify it exists and belongs to this entreprise
        if (tableId) {
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

            // Check table capacity
            if (table.capacite < personnes) {
                return NextResponse.json(
                    {
                        error: `La table a une capacité de ${table.capacite} personnes`,
                    },
                    { status: 400 }
                );
            }
        }

        // If clientId is provided, verify it exists
        if (clientId) {
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

        const reservation = await prisma.reservation.create({
            data: {
                clientId: clientId || null,
                nomClient,
                telephone: telephone || null,
                email: email || null,
                date: new Date(date),
                heure,
                personnes,
                tableId: tableId || null,
                notes: notes || null,
                statut: "EN_ATTENTE",
                entrepriseId: session.user.entrepriseId,
            },
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

        return NextResponse.json({ reservation }, { status: 201 });
    } catch (error) {
        console.error("Error creating reservation:", error);
        return NextResponse.json(
            { error: "Failed to create reservation" },
            { status: 500 }
        );
    }
}
