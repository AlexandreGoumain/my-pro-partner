import { authOptions } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { EcheanceProceduraleCreateInput } from "@/lib/types/juridique";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/echeances-proc - List procedural deadlines with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const affaireId = searchParams.get("affaireId");
        const type = searchParams.get("type");
        const statut = searchParams.get("statut");
        const dateDebut = searchParams.get("dateDebut");
        const dateFin = searchParams.get("dateFin");
        const periode = searchParams.get("periode"); // "avenir", "passe", "semaine", "mois"
        const limit = parseInt(searchParams.get("limit") || "100");

        const where: Prisma.EcheanceProceduraleWhereInput = {
            entrepriseId: session.user.entrepriseId,
        };

        if (affaireId) {
            where.affaireId = affaireId;
        }

        if (type && type !== "ALL") {
            const types = type.split(",");
            if (types.length === 1) {
                where.type = type as any;
            } else {
                where.type = { in: types as any };
            }
        }

        if (statut && statut !== "ALL") {
            const statuts = statut.split(",");
            if (statuts.length === 1) {
                where.statut = statut as any;
            } else {
                where.statut = { in: statuts as any };
            }
        }

        // Handle period shortcuts
        const now = new Date();
        if (periode) {
            switch (periode) {
                case "avenir":
                    where.dateEcheance = { gte: now };
                    break;
                case "passe":
                    where.dateEcheance = { lt: now };
                    break;
                case "semaine": {
                    const endOfWeek = new Date(now);
                    endOfWeek.setDate(now.getDate() + 7);
                    where.dateEcheance = { gte: now, lte: endOfWeek };
                    break;
                }
                case "mois": {
                    const endOfMonth = new Date(now);
                    endOfMonth.setMonth(now.getMonth() + 1);
                    where.dateEcheance = { gte: now, lte: endOfMonth };
                    break;
                }
            }
        } else if (dateDebut || dateFin) {
            where.dateEcheance = {};
            if (dateDebut) {
                where.dateEcheance.gte = new Date(dateDebut);
            }
            if (dateFin) {
                where.dateEcheance.lte = new Date(dateFin);
            }
        }

        const echeances = await prisma.echeanceProcedurale.findMany({
            where,
            include: {
                affaire: {
                    select: {
                        id: true,
                        reference: true,
                        intitule: true,
                        juridiction: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                            },
                        },
                    },
                },
            },
            orderBy: { dateEcheance: "asc" },
            take: limit,
        });

        // Get counts for different periods
        const counts = await Promise.all([
            // Upcoming this week
            prisma.echeanceProcedurale.count({
                where: {
                    entrepriseId: session.user.entrepriseId,
                    dateEcheance: {
                        gte: now,
                        lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                    },
                    statut: { in: ["A_VENIR", "EN_PREPARATION"] },
                },
            }),
            // Overdue (past and not completed)
            prisma.echeanceProcedurale.count({
                where: {
                    entrepriseId: session.user.entrepriseId,
                    dateEcheance: { lt: now },
                    statut: { in: ["A_VENIR", "EN_PREPARATION"] },
                },
            }),
            // Audiences this month
            prisma.echeanceProcedurale.count({
                where: {
                    entrepriseId: session.user.entrepriseId,
                    type: "AUDIENCE",
                    dateEcheance: {
                        gte: now,
                        lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
                    },
                    statut: { notIn: ["EFFECTUEE", "ANNULEE"] },
                },
            }),
        ]);

        return NextResponse.json({
            echeances,
            stats: {
                cetteSemaine: counts[0],
                enRetard: counts[1],
                audiencesCeMois: counts[2],
            },
        });
    } catch (error) {
        console.error("Error fetching echeances procedurales:", error);
        return NextResponse.json(
            { error: "Failed to fetch echeances" },
            { status: 500 }
        );
    }
}

// POST /api/echeances-proc - Create new procedural deadline
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const body: EcheanceProceduraleCreateInput = await request.json();

        // Validation
        if (!body.affaireId) {
            return NextResponse.json(
                { error: "L'affaire est requise" },
                { status: 400 }
            );
        }

        if (!body.type) {
            return NextResponse.json(
                { error: "Le type d'échéance est requis" },
                { status: 400 }
            );
        }

        if (!body.libelle?.trim()) {
            return NextResponse.json(
                { error: "Le libellé est requis" },
                { status: 400 }
            );
        }

        if (!body.dateEcheance) {
            return NextResponse.json(
                { error: "La date d'échéance est requise" },
                { status: 400 }
            );
        }

        // Verify affaire exists and belongs to enterprise
        const affaire = await prisma.affaire.findFirst({
            where: {
                id: body.affaireId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!affaire) {
            return NextResponse.json(
                { error: "Affaire introuvable" },
                { status: 404 }
            );
        }

        const echeance = await prisma.echeanceProcedurale.create({
            data: {
                affaireId: body.affaireId,
                type: body.type as any,
                libelle: body.libelle.trim(),
                description: body.description?.trim() || null,
                dateEcheance: new Date(body.dateEcheance),
                heureDebut: body.heureDebut || null,
                heureFin: body.heureFin || null,
                lieu: body.lieu || null,
                statut: "A_VENIR",
                rappel1Envoye: false,
                rappel2Envoye: false,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                affaire: {
                    select: {
                        id: true,
                        reference: true,
                        intitule: true,
                        client: {
                            select: {
                                id: true,
                                nom: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ echeance }, { status: 201 });
    } catch (error) {
        console.error("Error creating echeance procedurale:", error);
        return NextResponse.json(
            { error: "Failed to create echeance" },
            { status: 500 }
        );
    }
}
