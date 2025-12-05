import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/gestion-locative/incidents
 * List incidents
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const bailId = searchParams.get("bailId");
            const statut = searchParams.get("statut");
            const categorie = searchParams.get("categorie");
            const urgence = searchParams.get("urgence");
            const search = searchParams.get("search");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (bailId) {
                where.bailId = bailId;
            }

            if (statut && statut !== "ALL") {
                where.statut = statut;
            }

            if (categorie) {
                where.categorie = categorie;
            }

            if (urgence) {
                where.urgence = parseInt(urgence);
            }

            if (search) {
                where.OR = [
                    { description: { contains: search, mode: "insensitive" } },
                    { bail: { reference: { contains: search, mode: "insensitive" } } },
                    { bail: { bien: { titre: { contains: search, mode: "insensitive" } } } },
                    { bail: { locatairePrincipal: { nom: { contains: search, mode: "insensitive" } } } },
                ];
            }

            const incidents = await prisma.incidentLocatif.findMany({
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
                                    ville: true,
                                    adresse: true,
                                },
                            },
                            locatairePrincipal: {
                                select: {
                                    id: true,
                                    nom: true,
                                    prenom: true,
                                    telephone: true,
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
                orderBy: [{ urgence: "asc" }, { dateSignalement: "desc" }],
            });

            return NextResponse.json({ incidents });
        },
        {
            anyCapability: ["travaux_locatifs"],
            context: { resourceName: "IncidentLocatif", operation: "list" },
        }
    );
}

/**
 * POST /api/gestion-locative/incidents
 * Create incident
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            if (!body.bailId || !body.description || !body.categorie) {
                throw new ValidationError("Bail, description et catégorie requis");
            }

            // Verify bail belongs to entreprise
            const bail = await prisma.bailLocatif.findFirst({
                where: {
                    id: body.bailId,
                    entrepriseId: ctx.entrepriseId,
                },
            });

            if (!bail) {
                throw new NotFoundError("Bail non trouvé");
            }

            const incident = await prisma.incidentLocatif.create({
                data: {
                    entrepriseId: ctx.entrepriseId,
                    bailId: body.bailId,
                    description: body.description,
                    categorie: body.categorie,
                    urgence: body.urgence || 3,
                    photos: body.photos,
                    notes: body.notes,
                    statut: "SIGNALE",
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
                                    ville: true,
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

            return NextResponse.json({ incident }, { status: 201 });
        },
        {
            anyCapability: ["travaux_locatifs"],
            context: { resourceName: "IncidentLocatif", operation: "create" },
        }
    );
}
