import { authOptions } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { DiligenceCreateInput } from "@/lib/types/juridique";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/diligences - List diligences with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("temps_passe");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const affaireId = searchParams.get("affaireId");
        const type = searchParams.get("type");
        const facturable = searchParams.get("facturable");
        const facturee = searchParams.get("facturee");
        const userId = searchParams.get("userId");
        const dateDebut = searchParams.get("dateDebut");
        const dateFin = searchParams.get("dateFin");
        const limit = parseInt(searchParams.get("limit") || "100");

        const where: Prisma.DiligenceWhereInput = {
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

        if (facturable !== null && facturable !== undefined) {
            where.facturable = facturable === "true";
        }

        if (facturee !== null && facturee !== undefined) {
            where.facturee = facturee === "true";
        }

        if (userId) {
            where.userId = userId;
        }

        if (dateDebut || dateFin) {
            where.date = {};
            if (dateDebut) {
                where.date.gte = new Date(dateDebut);
            }
            if (dateFin) {
                where.date.lte = new Date(dateFin);
            }
        }

        const diligences = await prisma.diligence.findMany({
            where,
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
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { date: "desc" },
            take: limit,
        });

        // Convert Decimal fields
        const formattedDiligences = diligences.map((d) => ({
            ...d,
            tauxHoraire: Number(d.tauxHoraire),
            montant: Number(d.montant),
        }));

        // Calculate stats
        const stats = await prisma.diligence.aggregate({
            where: {
                ...where,
                facturee: false,
            },
            _sum: {
                duree: true,
                montant: true,
            },
            _count: true,
        });

        return NextResponse.json({
            diligences: formattedDiligences,
            stats: {
                nonFacturees: stats._count,
                totalMinutes: stats._sum.duree || 0,
                totalMontant: stats._sum.montant
                    ? Number(stats._sum.montant)
                    : 0,
            },
        });
    } catch (error) {
        console.error("Error fetching diligences:", error);
        return NextResponse.json(
            { error: "Failed to fetch diligences" },
            { status: 500 }
        );
    }
}

// POST /api/diligences - Create new diligence
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId || !session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("temps_passe");
        if (capabilityCheck) return capabilityCheck;

        const body: DiligenceCreateInput = await request.json();

        // Validation
        if (!body.affaireId) {
            return NextResponse.json(
                { error: "L'affaire est requise" },
                { status: 400 }
            );
        }

        if (!body.type) {
            return NextResponse.json(
                { error: "Le type de diligence est requis" },
                { status: 400 }
            );
        }

        if (!body.description?.trim()) {
            return NextResponse.json(
                { error: "La description est requise" },
                { status: 400 }
            );
        }

        if (!body.duree || body.duree <= 0) {
            return NextResponse.json(
                { error: "La durée doit être supérieure à 0" },
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

        // Get taux horaire (from input, affaire, or default)
        let tauxHoraire = body.tauxHoraire;
        if (!tauxHoraire && affaire.tauxHoraire) {
            tauxHoraire = Number(affaire.tauxHoraire);
        }
        if (!tauxHoraire) {
            tauxHoraire = 200; // Default rate
        }

        // Calculate montant
        const facturable = body.facturable !== false;
        const montant = facturable ? (body.duree / 60) * tauxHoraire : 0;

        const diligence = await prisma.diligence.create({
            data: {
                affaireId: body.affaireId,
                type: body.type as any,
                description: body.description.trim(),
                date: body.date ? new Date(body.date) : new Date(),
                duree: body.duree,
                facturable,
                tauxHoraire,
                montant,
                facturee: false,
                userId: session.user.id,
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
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Convert Decimal fields
        const formattedDiligence = {
            ...diligence,
            tauxHoraire: Number(diligence.tauxHoraire),
            montant: Number(diligence.montant),
        };

        return NextResponse.json(
            { diligence: formattedDiligence },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating diligence:", error);
        return NextResponse.json(
            { error: "Failed to create diligence" },
            { status: 500 }
        );
    }
}
