import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createCoursSchema = z.object({
    nom: z.string().min(1, "Le nom est requis"),
    description: z.string().optional().nullable(),
    dureeMinutes: z.number().min(15).default(60),
    niveau: z
        .enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "TOUS_NIVEAUX"])
        .default("TOUS_NIVEAUX"),
    capaciteMax: z.number().min(1).default(20),
    categorie: z.string().optional().nullable(),
    instructeurId: z.string().optional().nullable(),
    salleId: z.string().optional().nullable(),
    materielNecessaire: z.string().optional().nullable(),
    couleur: z.string().optional().nullable(),
    actif: z.boolean().optional().default(true),
    reservationRequise: z.boolean().optional().default(true),
    imageUrl: z.string().optional().nullable(),
});

// GET /api/fitness/cours - Liste des cours collectifs
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
        const actif = searchParams.get("actif");
        const categorie = searchParams.get("categorie");
        const niveau = searchParams.get("niveau");
        const instructeurId = searchParams.get("instructeurId");
        const search = searchParams.get("search") || "";

        const where = {
            entrepriseId: session.user.entrepriseId,
            ...(actif !== null && actif !== "" && { actif: actif === "true" }),
            ...(categorie && { categorie }),
            ...(niveau && {
                niveau: niveau as
                    | "DEBUTANT"
                    | "INTERMEDIAIRE"
                    | "AVANCE"
                    | "TOUS_NIVEAUX",
            }),
            ...(instructeurId && { instructeurId }),
            ...(search && {
                OR: [
                    { nom: { contains: search, mode: "insensitive" as const } },
                    {
                        description: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }),
        };

        const cours = await prisma.coursCollectif.findMany({
            where,
            orderBy: [{ nom: "asc" }],
            include: {
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
                    select: { seances: true },
                },
            },
        });

        return NextResponse.json({ data: cours });
    } catch (error) {
        console.error("Erreur GET cours:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// POST /api/fitness/cours - Créer un cours
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
        const validatedData = createCoursSchema.parse(body);

        // Vérifier que l'instructeur existe (si fourni)
        if (validatedData.instructeurId) {
            const instructeur = await prisma.employe.findFirst({
                where: {
                    id: validatedData.instructeurId,
                    entrepriseId: session.user.entrepriseId,
                    actif: true,
                },
            });

            if (!instructeur) {
                return NextResponse.json(
                    { error: "Instructeur non trouvé" },
                    { status: 404 }
                );
            }
        }

        // Vérifier que la salle existe (si fournie)
        if (validatedData.salleId) {
            const salle = await prisma.salleFitness.findFirst({
                where: {
                    id: validatedData.salleId,
                    entrepriseId: session.user.entrepriseId,
                    actif: true,
                },
            });

            if (!salle) {
                return NextResponse.json(
                    { error: "Salle non trouvée" },
                    { status: 404 }
                );
            }
        }

        const cours = await prisma.coursCollectif.create({
            data: {
                ...validatedData,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
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

        return NextResponse.json(cours, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }
        console.error("Erreur POST cours:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
