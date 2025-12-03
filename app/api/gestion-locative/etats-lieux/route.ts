import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/gestion-locative/etats-lieux
 * List etats des lieux
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const typeEtat = searchParams.get("type");
            const bailId = searchParams.get("bailId");
            const search = searchParams.get("search");
            const planifies = searchParams.get("planifies");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (typeEtat && typeEtat !== "ALL") {
                where.typeEtat = typeEtat;
            }

            if (bailId) {
                where.bailId = bailId;
            }

            // Filter for planned etats (no signature yet)
            if (planifies === "true") {
                where.signatureLocataire = null;
            }

            if (search) {
                where.OR = [
                    { bail: { bien: { titre: { contains: search, mode: "insensitive" } } } },
                    { bail: { locatairePrincipal: { nom: { contains: search, mode: "insensitive" } } } },
                ];
            }

            const etatsLieux = await prisma.etatDesLieux.findMany({
                where,
                include: {
                    bail: {
                        select: {
                            id: true,
                            reference: true,
                            bien: {
                                select: {
                                    id: true,
                                    titre: true,
                                    adresse: true,
                                    ville: true,
                                    surface: true,
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
                        },
                    },
                },
                orderBy: { dateEtat: "desc" },
                take: 100,
            });

            return NextResponse.json({ etatsLieux });
        },
        {
            anyCapability: ["etats_lieux"],
            context: { resourceName: "EtatDesLieux", operation: "list" },
        }
    );
}

/**
 * POST /api/gestion-locative/etats-lieux
 * Create new etat des lieux
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.bailId || !body.typeEtat || !body.dateEtat) {
                throw new ValidationError("Bail, type et date requis");
            }

            // Verify bail exists and belongs to entreprise
            const bail = await prisma.bailLocatif.findFirst({
                where: {
                    id: body.bailId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!bail) {
                throw new NotFoundError("Bail non trouvé");
            }

            const etatDesLieux = await prisma.etatDesLieux.create({
                data: {
                    entrepriseId: ctx.entrepriseId,
                    bailId: body.bailId,
                    typeEtat: body.typeEtat,
                    dateEtat: new Date(body.dateEtat),
                    releveEau: body.releveEau,
                    releveElec: body.releveElec,
                    releveGaz: body.releveGaz,
                    constatations: body.constatations,
                    photos: body.photos,
                    notes: body.notes,
                },
                include: {
                    bail: {
                        select: {
                            id: true,
                            reference: true,
                            bien: {
                                select: {
                                    id: true,
                                    titre: true,
                                },
                            },
                            locatairePrincipal: {
                                select: {
                                    id: true,
                                    nom: true,
                                    prenom: true,
                                },
                            },
                        },
                    },
                },
            });

            return NextResponse.json({ etatDesLieux }, { status: 201 });
        },
        {
            anyCapability: ["etats_lieux"],
            context: { resourceName: "EtatDesLieux", operation: "create" },
        }
    );
}
