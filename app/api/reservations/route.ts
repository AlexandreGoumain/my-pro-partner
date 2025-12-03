import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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
 * GET /api/reservations
 * List reservations with filters
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const date = searchParams.get("date");
            const dateStart = searchParams.get("dateStart");
            const dateEnd = searchParams.get("dateEnd");
            const statut = searchParams.get("statut");
            const tableId = searchParams.get("tableId");
            const search = searchParams.get("search");
            const page = parseInt(searchParams.get("page") || "1");
            const limit = parseInt(searchParams.get("limit") || "50");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
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
                    (where.date as Record<string, Date>).gte = start;
                }
                if (dateEnd) {
                    const end = new Date(dateEnd);
                    end.setHours(23, 59, 59, 999);
                    (where.date as Record<string, Date>).lte = end;
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
                    include: reservationInclude,
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
        },
        {
            capability: "agenda",
            context: { resourceName: "Reservation", operation: "list" },
        }
    );
}

/**
 * POST /api/reservations
 * Create a new reservation
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();
            const validation = reservationCreateSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const data = validation.data;

            // If tableId is provided, verify it exists and check capacity
            if (data.tableId) {
                const table = await prisma.tableRestaurant.findFirst({
                    where: {
                        id: data.tableId,
                        entrepriseId: ctx.entrepriseId,
                    },
                });

                if (!table) {
                    throw new NotFoundError("Table non trouvée");
                }

                if (table.capacite < data.personnes) {
                    throw new BusinessError(
                        `La table a une capacité de ${table.capacite} personnes`
                    );
                }
            }

            // If clientId is provided, verify it exists
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

            const reservation = await prisma.reservation.create({
                data: {
                    clientId: data.clientId || null,
                    nomClient: data.nomClient,
                    telephone: data.telephone || null,
                    email: data.email || null,
                    date: new Date(data.date),
                    heure: data.heure,
                    personnes: data.personnes,
                    tableId: data.tableId || null,
                    notes: data.notes || null,
                    statut: "EN_ATTENTE",
                    entrepriseId: ctx.entrepriseId,
                },
                include: reservationInclude,
            });

            return NextResponse.json({ reservation }, { status: 201 });
        },
        {
            capability: "agenda",
            context: { resourceName: "Reservation", operation: "create" },
        }
    );
}
