import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
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

// Générer un numéro d'abonnement unique
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

// GET /api/fitness/abonnements - Liste des abonnements
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("abonnements_fitness");
        if (capabilityCheck) return capabilityCheck;

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const search = searchParams.get("search") || "";
        const statut = searchParams.get("statut") || "";
        const typeAbonnementId = searchParams.get("typeAbonnementId") || "";
        const clientId = searchParams.get("clientId") || "";

        const where = {
            entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Erreur GET abonnements:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST /api/fitness/abonnements - Créer un abonnement
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("abonnements_fitness");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const validatedData = createAbonnementSchema.parse(body);

        // Vérifier que le client existe
        const client = await prisma.client.findFirst({
            where: {
                id: validatedData.clientId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!client) {
            return NextResponse.json(
                { error: "Client non trouvé" },
                { status: 404 }
            );
        }

        // Vérifier que le type d'abonnement existe
        const typeAbonnement = await prisma.typeAbonnementFitness.findFirst({
            where: {
                id: validatedData.typeAbonnementId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!typeAbonnement) {
            return NextResponse.json(
                { error: "Type d'abonnement non trouvé" },
                { status: 404 }
            );
        }

        // Générer le numéro d'abonnement
        const numero = await generateNumeroAbonnement(
            session.user.entrepriseId
        );

        // Calculer les séances restantes si c'est un pass
        const seancesRestantes =
            typeAbonnement.nombreSeances ?? validatedData.seancesRestantes;

        const abonnement = await prisma.abonnementFitness.create({
            data: {
                ...validatedData,
                numero,
                seancesRestantes,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
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
            },
        });

        return NextResponse.json(abonnement, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur POST abonnement:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
