import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createAbonnementSchema = z.object({
    clientId: z.string().min(1, "Le client est requis"),
    typeAbonnementId: z.string().min(1, "Le type d'abonnement est requis"),
    dateDebut: z.string().transform((str) => new Date(str)),
    dateFin: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    statut: z
        .enum(["ACTIF", "SUSPENDU", "EXPIRE", "RESILIE", "EN_ATTENTE"])
        .optional()
        .default("ACTIF"),
    seancesRestantes: z.number().optional().nullable(),
    montantPaye: z.number().optional().default(0),
    prochainPaiement: z
        .string()
        .optional()
        .nullable()
        .transform((str) => (str ? new Date(str) : null)),
    modePaiement: z.string().optional().nullable(),
    numeroCarte: z.string().optional().nullable(),
    codeAcces: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
});

const abonnementInclude = {
    client: {
        select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
        },
    },
    typeAbonnement: true,
} as const;

// Generate a unique subscription number
async function generateNumeroAbonnement(entrepriseId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.abonnementFitness.count({
        where: {
            entrepriseId,
            createdAt: {
                gte: new Date(year, 0, 1),
                lt: new Date(year + 1, 0, 1),
            },
        },
    });
    return `ABO-${year}-${String(count + 1).padStart(4, "0")}`;
}

/**
 * GET /api/fitness/abonnements
 * List subscriptions
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const { searchParams } = new URL(request.url);
            const page = parseInt(searchParams.get("page") || "1");
            const limit = parseInt(searchParams.get("limit") || "50");
            const search = searchParams.get("search") || "";
            const statut = searchParams.get("statut") || "";
            const typeAbonnementId = searchParams.get("typeAbonnementId") || "";
            const clientId = searchParams.get("clientId") || "";

            const where = {
                entrepriseId: ctx.entrepriseId,
                ...(statut && {
                    statut: statut as
                        | "ACTIF"
                        | "SUSPENDU"
                        | "EXPIRE"
                        | "RESILIE"
                        | "EN_ATTENTE",
                }),
                ...(typeAbonnementId && { typeAbonnementId }),
                ...(clientId && { clientId }),
                ...(search && {
                    OR: [
                        {
                            numero: {
                                contains: search,
                                mode: "insensitive" as const,
                            },
                        },
                        {
                            client: {
                                nom: {
                                    contains: search,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                        {
                            client: {
                                prenom: {
                                    contains: search,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                        {
                            client: {
                                email: {
                                    contains: search,
                                    mode: "insensitive" as const,
                                },
                            },
                        },
                    ],
                }),
            };

            const [abonnements, total] = await Promise.all([
                prisma.abonnementFitness.findMany({
                    where,
                    orderBy: [{ createdAt: "desc" }],
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        ...abonnementInclude,
                        _count: {
                            select: { presences: true },
                        },
                    },
                }),
                prisma.abonnementFitness.count({ where }),
            ]);

            return NextResponse.json({
                data: abonnements,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        },
        {
            capability: "abonnements_fitness",
            context: { resourceName: "AbonnementFitness", operation: "list" },
        }
    );
}

/**
 * POST /api/fitness/abonnements
 * Create a subscription
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();
            const validation = createAbonnementSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const data = validation.data;

            // Check that the client exists
            const client = await prisma.client.findFirst({
                where: {
                    id: data.clientId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!client) {
                throw new NotFoundError("Client non trouvé");
            }

            // Check that the subscription type exists
            const typeAbonnement = await prisma.typeAbonnementFitness.findFirst({
                where: {
                    id: data.typeAbonnementId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!typeAbonnement) {
                throw new NotFoundError("Type d'abonnement non trouvé");
            }

            // Generate subscription number
            const numero = await generateNumeroAbonnement(ctx.entrepriseId);

            // Calculate remaining sessions if it's a pass
            const seancesRestantes =
                typeAbonnement.nombreSeances ?? data.seancesRestantes;

            const abonnement = await prisma.abonnementFitness.create({
                data: {
                    ...data,
                    numero,
                    seancesRestantes,
                    entrepriseId: ctx.entrepriseId,
                },
                include: abonnementInclude,
            });

            return NextResponse.json(abonnement, { status: 201 });
        },
        {
            capability: "abonnements_fitness",
            context: { resourceName: "AbonnementFitness", operation: "create" },
        }
    );
}
