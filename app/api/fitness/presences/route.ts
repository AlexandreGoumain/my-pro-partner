import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
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

// GET /api/fitness/presences - Liste des présences
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("presences_fitness");
        if (capabilityCheck) return capabilityCheck;

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
            entrepriseId: session.user.entrepriseId,
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
                include: {
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
                },
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
    } catch (error) {
        console.error("Erreur GET presences:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST /api/fitness/presences - Enregistrer une présence
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("presences_fitness");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const validatedData = createPresenceSchema.parse(body);

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

        // Trouver l'abonnement actif si non spécifié
        let abonnementId = validatedData.abonnementId;
        if (!abonnementId) {
            const abonnementActif = await prisma.abonnementFitness.findFirst({
                where: {
                    clientId: validatedData.clientId,
                    entrepriseId: session.user.entrepriseId,
                    statut: "ACTIF",
                    OR: [{ dateFin: null }, { dateFin: { gte: new Date() } }],
                },
                orderBy: { createdAt: "desc" },
            });
            abonnementId = abonnementActif?.id ?? null;
        }

        // Si c'est un pass avec séances, décrémenter
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
                    return NextResponse.json(
                        {
                            error: "Plus de séances restantes sur cet abonnement",
                        },
                        { status: 400 }
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
                ...validatedData,
                abonnementId,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
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
                        seancesRestantes: true,
                    },
                },
                salle: {
                    select: {
                        id: true,
                        nom: true,
                        type: true,
                    },
                },
            },
        });

        return NextResponse.json(presence, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur POST presence:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
