import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSeanceSchema = z.object({
    coursId: z.string().min(1, "Le cours est requis"),
    dateHeure: z.string().transform((str) => new Date(str)),
    dureeMinutes: z.number().optional().nullable(),
    instructeurId: z.string().optional().nullable(),
    salleId: z.string().optional().nullable(),
    capaciteMax: z.number().optional().nullable(),
    statut: z
        .enum(["PLANIFIEE", "EN_COURS", "TERMINEE", "ANNULEE", "COMPLETE"])
        .optional()
        .default("PLANIFIEE"),
    notes: z.string().optional().nullable(),
});

// Créer plusieurs séances (récurrence)
const createSeancesRecurrentesSchema = z.object({
    coursId: z.string().min(1),
    dateDebut: z.string().transform((str) => new Date(str)),
    dateFin: z.string().transform((str) => new Date(str)),
    heureDebut: z.string(), // "14:30"
    joursSemaine: z.array(z.number().min(0).max(6)), // [1, 3, 5] = Lundi, Mercredi, Vendredi
    instructeurId: z.string().optional().nullable(),
    salleId: z.string().optional().nullable(),
});

// GET /api/fitness/seances - Liste des séances
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("cours_collectifs");
        if (capabilityCheck) return capabilityCheck;

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");
        const coursId = searchParams.get("coursId");
        const instructeurId = searchParams.get("instructeurId");
        const salleId = searchParams.get("salleId");
        const statut = searchParams.get("statut");
        const dateDebut = searchParams.get("dateDebut");
        const dateFin = searchParams.get("dateFin");

        const where = {
            entrepriseId: session.user.entrepriseId,
            ...(coursId && { coursId }),
            ...(instructeurId && { instructeurId }),
            ...(salleId && { salleId }),
            ...(statut && {
                statut: statut as
                    | "PLANIFIEE"
                    | "EN_COURS"
                    | "TERMINEE"
                    | "ANNULEE"
                    | "COMPLETE",
            }),
            ...(dateDebut && {
                dateHeure: {
                    gte: new Date(dateDebut),
                    ...(dateFin && { lte: new Date(dateFin) }),
                },
            }),
        };

        const [seances, total] = await Promise.all([
            prisma.seanceCours.findMany({
                where,
                orderBy: [{ dateHeure: "asc" }],
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    cours: {
                        select: {
                            id: true,
                            nom: true,
                            niveau: true,
                            dureeMinutes: true,
                            capaciteMax: true,
                            couleur: true,
                            categorie: true,
                        },
                    },
                    instructeur: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            couleur: true,
                        },
                    },
                    salle: {
                        select: {
                            id: true,
                            nom: true,
                            type: true,
                        },
                    },
                    _count: {
                        select: { reservations: true },
                    },
                },
            }),
            prisma.seanceCours.count({ where }),
        ]);

        return NextResponse.json({
            data: seances,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Erreur GET seances:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST /api/fitness/seances - Créer une séance
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("cours_collectifs");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        // Vérifier si c'est une création récurrente
        if (body.joursSemaine && body.dateDebut && body.dateFin) {
            const recurrentData = createSeancesRecurrentesSchema.parse(body);

            // Vérifier que le cours existe
            const cours = await prisma.coursCollectif.findFirst({
                where: {
                    id: recurrentData.coursId,
                    entrepriseId: session.user.entrepriseId,
                },
            });

            if (!cours) {
                return NextResponse.json(
                    { error: "Cours non trouvé" },
                    { status: 404 }
                );
            }

            // Générer les dates
            const seancesData: {
                dateHeure: Date;
                coursId: string;
                instructeurId: string | null;
                salleId: string | null;
                entrepriseId: string;
            }[] = [];
            const currentDate = new Date(recurrentData.dateDebut);
            const endDate = new Date(recurrentData.dateFin);
            const [heures, minutes] = recurrentData.heureDebut
                .split(":")
                .map(Number);

            while (currentDate <= endDate) {
                const dayOfWeek = currentDate.getDay();
                if (recurrentData.joursSemaine.includes(dayOfWeek)) {
                    const dateHeure = new Date(currentDate);
                    dateHeure.setHours(heures, minutes, 0, 0);

                    seancesData.push({
                        dateHeure,
                        coursId: recurrentData.coursId,
                        instructeurId:
                            recurrentData.instructeurId ?? cours.instructeurId,
                        salleId: recurrentData.salleId ?? cours.salleId,
                        entrepriseId: session.user.entrepriseId,
                    });
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (seancesData.length === 0) {
                return NextResponse.json(
                    { error: "Aucune séance à créer avec ces paramètres" },
                    { status: 400 }
                );
            }

            const result = await prisma.seanceCours.createMany({
                data: seancesData,
            });

            return NextResponse.json(
                {
                    created: result.count,
                    message: `${result.count} séances créées`,
                },
                { status: 201 }
            );
        }

        // Création simple
        const validatedData = createSeanceSchema.parse(body);

        // Vérifier que le cours existe
        const cours = await prisma.coursCollectif.findFirst({
            where: {
                id: validatedData.coursId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!cours) {
            return NextResponse.json(
                { error: "Cours non trouvé" },
                { status: 404 }
            );
        }

        const seance = await prisma.seanceCours.create({
            data: {
                ...validatedData,
                instructeurId:
                    validatedData.instructeurId ?? cours.instructeurId,
                salleId: validatedData.salleId ?? cours.salleId,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                cours: {
                    select: {
                        id: true,
                        nom: true,
                        niveau: true,
                        dureeMinutes: true,
                        capaciteMax: true,
                        couleur: true,
                    },
                },
                instructeur: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        couleur: true,
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

        return NextResponse.json(seance, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur POST seance:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
