import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { BusinessError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/gestion-locative/loyers
 * List rent calls with filters
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const bailId = searchParams.get("bailId");
            const statut = searchParams.get("statut");
            const mois = searchParams.get("mois");
            const annee = searchParams.get("annee");
            const impayes = searchParams.get("impayes");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
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
        },
        {
            anyCapability: ["loyers"],
            context: { resourceName: "AppelLoyer", operation: "list" },
        }
    );
}

/**
 * POST /api/gestion-locative/loyers
 * Generate rent calls
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            const mois = body.mois || new Date().getMonth() + 1;
            const annee = body.annee || new Date().getFullYear();

            const baux = await prisma.bailLocatif.findMany({
                where: {
                    entrepriseId: ctx.entrepriseId,
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
                throw new BusinessError("Aucun bail actif trouvé");
            }

            const createdLoyers = [];

            for (const bail of baux) {
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

                const numero = `LOY-${annee}${mois.toString().padStart(2, "0")}-${bail.id.slice(-4)}`;
                const dateEcheance = new Date(annee, mois - 1, 5);

                const loyer = await prisma.appelLoyer.create({
                    data: {
                        numero,
                        entrepriseId: ctx.entrepriseId,
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
        },
        {
            anyCapability: ["loyers"],
            context: { resourceName: "AppelLoyer", operation: "create" },
        }
    );
}
