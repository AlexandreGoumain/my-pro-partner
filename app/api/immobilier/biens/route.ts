import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/immobilier/biens
 * List properties with filters
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const typeBien = searchParams.get("typeBien");
            const statut = searchParams.get("statut");
            const ville = searchParams.get("ville");
            const search = searchParams.get("search");
            const prixMin = searchParams.get("prixMin");
            const prixMax = searchParams.get("prixMax");
            const surfaceMin = searchParams.get("surfaceMin");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (typeBien && typeBien !== "ALL") {
                where.typeBien = typeBien;
            }

            if (statut && statut !== "ALL") {
                where.statut = statut;
            }

            if (ville) {
                where.ville = { contains: ville, mode: "insensitive" };
            }

            if (prixMin || prixMax) {
                where.prixVente = {
                    ...(prixMin && { gte: parseFloat(prixMin) }),
                    ...(prixMax && { lte: parseFloat(prixMax) }),
                };
            }

            if (surfaceMin) {
                where.surface = { gte: parseFloat(surfaceMin) };
            }

            if (search) {
                where.OR = [
                    { reference: { contains: search, mode: "insensitive" } },
                    { titre: { contains: search, mode: "insensitive" } },
                    { ville: { contains: search, mode: "insensitive" } },
                    { adresse: { contains: search, mode: "insensitive" } },
                ];
            }

            const biens = await prisma.bienImmobilier.findMany({
                where,
                include: {
                    proprietaire: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            telephone: true,
                            email: true,
                        },
                    },
                    mandats: {
                        where: { statut: "EN_COURS" },
                        take: 1,
                    },
                    _count: {
                        select: {
                            visites: true,
                            diffusions: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 100,
            });

            return NextResponse.json({ biens });
        },
        {
            anyCapability: ["biens_immo"],
            context: { resourceName: "BienImmobilier", operation: "list" },
        }
    );
}

/**
 * POST /api/immobilier/biens
 * Create new property
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            const lastBien = await prisma.bienImmobilier.findFirst({
                where: { entrepriseId: ctx.entrepriseId },
                orderBy: { createdAt: "desc" },
                select: { reference: true },
            });

            let nextNumber = 1;
            if (lastBien) {
                const match = lastBien.reference.match(/BIEN-(\d+)/);
                if (match) {
                    nextNumber = parseInt(match[1]) + 1;
                }
            }

            const reference = `BIEN-${nextNumber.toString().padStart(4, "0")}`;

            const bien = await prisma.bienImmobilier.create({
                data: {
                    reference,
                    entrepriseId: ctx.entrepriseId,
                    titre: body.titre,
                    description: body.description,
                    typeBien: body.typeBien,
                    statut: body.statut || "DISPONIBLE",
                    enVente: body.enVente || false,
                    enLocation: body.enLocation || false,
                    prixVente: body.prixVente,
                    prixLocation: body.prixLocation,
                    chargesLoc: body.chargesLoc,
                    adresse: body.adresse,
                    codePostal: body.codePostal,
                    ville: body.ville,
                    pays: body.pays || "France",
                    latitude: body.latitude,
                    longitude: body.longitude,
                    etage: body.etage,
                    ascenseur: body.ascenseur || false,
                    surface: body.surface,
                    nbPieces: body.nbPieces,
                    nbChambres: body.nbChambres,
                    nbSallesBains: body.nbSallesBains,
                    nbWc: body.nbWc,
                    balcon: body.balcon || false,
                    terrasse: body.terrasse || false,
                    jardin: body.jardin || false,
                    surfaceJardin: body.surfaceJardin,
                    parking: body.parking || false,
                    garage: body.garage || false,
                    cave: body.cave || false,
                    piscine: body.piscine || false,
                    anneeConstruction: body.anneeConstruction,
                    etatGeneral: body.etatGeneral,
                    dpeConsommation: body.dpeConsommation,
                    dpeEmission: body.dpeEmission,
                    enCopropriete: body.enCopropriete || false,
                    nbLotsCopro: body.nbLotsCopro,
                    chargesCopro: body.chargesCopro,
                    proprietaireId: body.proprietaireId,
                    photos: body.photos || [],
                },
                include: {
                    proprietaire: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                        },
                    },
                },
            });

            return NextResponse.json({ bien }, { status: 201 });
        },
        {
            anyCapability: ["biens_immo"],
            context: { resourceName: "BienImmobilier", operation: "create" },
        }
    );
}
