import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/gestion-locative/loyers - List rent calls with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("loyers");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const bailId = searchParams.get("bailId");
        const statut = searchParams.get("statut");
        const mois = searchParams.get("mois");
        const annee = searchParams.get("annee");
        const impayes = searchParams.get("impayes");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (bailId) {
            where.bailId = bailId;
        }

        if (statut && statut !== "ALL") {
            where.statut = statut;
        }

        if (mois) {
            where.mois = parseInt(mois);
        }

        if (annee) {
            where.annee = parseInt(annee);
        }

        // Filter for unpaid rents
        if (impayes === "true") {
            where.statut = { in: ["A_ENVOYER", "ENVOYE", "PARTIELLEMENT_PAYE", "IMPAYE"] };
        }

        const loyers = await prisma.appelLoyer.findMany({
            where,
            include: {
                bail: {
                    include: {
                        bien: {
                            select: {
                                id: true,
                                reference: true,
                                titre: true,
                                adresse: true,
                                ville: true,
                            },
                        },
                        locatairePrincipal: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                                telephone: true,
                                email: true,
                            },
                        },
                        proprietaire: {
                            select: {
                                id: true,
                                nom: true,
                                prenom: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ annee: "desc" }, { mois: "desc" }],
            take: 100,
        });

        return NextResponse.json({ loyers });
    } catch (error) {
        console.error("Error fetching loyers:", error);
        return NextResponse.json(
            { error: "Failed to fetch loyers" },
            { status: 500 }
        );
    }
}

// POST /api/gestion-locative/loyers - Generate rent calls
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("loyers");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        const mois = body.mois || new Date().getMonth() + 1;
        const annee = body.annee || new Date().getFullYear();

        // Get all active baux
        const baux = await prisma.bailLocatif.findMany({
            where: {
                entrepriseId: session.user.entrepriseId,
                statut: "EN_COURS",
                ...(body.bailId ? { id: body.bailId } : {}),
            },
            select: {
                id: true,
                loyerHC: true,
                provisions: true,
                loyerCC: true,
            },
        });

        if (baux.length === 0) {
            return NextResponse.json(
                { error: "Aucun bail actif trouvé" },
                { status: 400 }
            );
        }

        const createdLoyers = [];

        for (const bail of baux) {
            // Check if already exists for this month/year
            const existing = await prisma.appelLoyer.findFirst({
                where: {
                    bailId: bail.id,
                    mois,
                    annee,
                },
            });

            if (existing) {
                continue;
            }

            // Generate numero
            const numero = `LOY-${annee}${mois.toString().padStart(2, "0")}-${bail.id.slice(-4)}`;

            const dateEcheance = new Date(annee, mois - 1, 5); // 5th of the month

            const loyer = await prisma.appelLoyer.create({
                data: {
                    numero,
                    entrepriseId: session.user.entrepriseId,
                    bailId: bail.id,
                    mois,
                    annee,
                    loyerHC: bail.loyerHC,
                    provisions: bail.provisions,
                    totalDu: bail.loyerCC,
                    montantPaye: 0,
                    statut: "A_ENVOYER",
                    dateEcheance,
                },
                include: {
                    bail: {
                        include: {
                            bien: {
                                select: {
                                    reference: true,
                                    titre: true,
                                },
                            },
                            locatairePrincipal: {
                                select: {
                                    nom: true,
                                    prenom: true,
                                },
                            },
                        },
                    },
                },
            });

            createdLoyers.push(loyer);
        }

        return NextResponse.json(
            {
                message: `${createdLoyers.length} appel(s) de loyer créé(s)`,
                loyers: createdLoyers,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating loyers:", error);
        return NextResponse.json(
            { error: "Failed to create loyers" },
            { status: 500 }
        );
    }
}
