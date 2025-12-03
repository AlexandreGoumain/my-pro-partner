import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError, BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createPresenceSchema = z.object({
    clientId: z.string().min(1, "Le client est requis"),
    abonnementId: z.string().optional().nullable(),
    typeAcces: z
        .enum(["ENTREE", "SORTIE", "COURS", "ESPACE_PREMIUM"])
        .default("ENTREE"),
    salleId: z.string().optional().nullable(),
    methodCheckin: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});

const presenceInclude = {
    client: {
        select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
        },
    },
    abonnement: {
        select: {
            id: true,
            numero: true,
            statut: true,
            typeAbonnement: {
                select: {
                    nom: true,
                },
            },
        },
    },
    salle: {
        select: {
            id: true,
            nom: true,
            type: true,
        },
    },
} as const;

/**
 * GET /api/fitness/presences
 * List attendances
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { searchParams } = new URL(request.url);
            const page = parseInt(searchParams.get("page") || "1");
            const limit = parseInt(searchParams.get("limit") || "50");
            const clientId = searchParams.get("clientId");
            const abonnementId = searchParams.get("abonnementId");
            const salleId = searchParams.get("salleId");
            const typeAcces = searchParams.get("typeAcces");
            const dateDebut = searchParams.get("dateDebut");
            const dateFin = searchParams.get("dateFin");

            const where = {
                entrepriseId: ctx.entrepriseId,
                ...(clientId && { clientId }),
                ...(abonnementId && { abonnementId }),
                ...(salleId && { salleId }),
                ...(typeAcces && {
                    typeAcces: typeAcces as
                        | "ENTREE"
                        | "SORTIE"
                        | "COURS"
                        | "ESPACE_PREMIUM",
                }),
                ...(dateDebut && {
                    heureEntree: {
                        gte: new Date(dateDebut),
                        ...(dateFin && { lte: new Date(dateFin) }),
                    },
                }),
            };

            const [presences, total] = await Promise.all([
                prisma.presenceFitness.findMany({
                    where,
                    orderBy: [{ heureEntree: "desc" }],
                    skip: (page - 1) * limit,
                    take: limit,
                    include: presenceInclude,
                }),
                prisma.presenceFitness.count({ where }),
            ]);

            return NextResponse.json({
                data: presences,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        },
        {
            capability: "presences_fitness",
            context: { resourceName: "PresenceFitness", operation: "list" },
        }
    );
}

/**
 * POST /api/fitness/presences
 * Create attendance record
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();
            const validation = createPresenceSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const data = validation.data;

            // Check that client exists
            const client = await prisma.client.findFirst({
                where: {
                    id: data.clientId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!client) {
                throw new NotFoundError("Client non trouvé");
            }

            // Find active subscription if not specified
            let abonnementId = data.abonnementId;
            if (!abonnementId) {
                const abonnementActif = await prisma.abonnementFitness.findFirst({
                    where: {
                        clientId: data.clientId,
                        entrepriseId: ctx.entrepriseId,
                        statut: "ACTIF",
                        OR: [{ dateFin: null }, { dateFin: { gte: new Date() } }],
                    },
                    orderBy: { createdAt: "desc" },
                });
                abonnementId = abonnementActif?.id ?? null;
            }

            // If it's a pass with sessions, decrement
            if (abonnementId) {
                const abonnement = await prisma.abonnementFitness.findUnique({
                    where: { id: abonnementId },
                    include: { typeAbonnement: true },
                });

                if (
                    abonnement?.seancesRestantes !== null &&
                    abonnement?.seancesRestantes !== undefined
                ) {
                    if (abonnement.seancesRestantes <= 0) {
                        throw new BusinessError(
                            "Plus de séances restantes sur cet abonnement"
                        );
                    }

                    await prisma.abonnementFitness.update({
                        where: { id: abonnementId },
                        data: {
                            seancesRestantes: { decrement: 1 },
                            seancesUtilisees: { increment: 1 },
                        },
                    });
                }
            }

            const presence = await prisma.presenceFitness.create({
                data: {
                    ...data,
                    abonnementId,
                    entrepriseId: ctx.entrepriseId,
                },
                include: {
                    ...presenceInclude,
                    abonnement: {
                        select: {
                            id: true,
                            numero: true,
                            statut: true,
                            seancesRestantes: true,
                        },
                    },
                },
            });

            return NextResponse.json(presence, { status: 201 });
        },
        {
            capability: "presences_fitness",
            context: { resourceName: "PresenceFitness", operation: "create" },
        }
    );
}
