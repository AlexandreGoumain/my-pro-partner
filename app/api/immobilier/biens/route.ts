import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/immobilier/biens - List properties with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("biens_immo");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const typeBien = searchParams.get("typeBien");
        const statut = searchParams.get("statut");
        const ville = searchParams.get("ville");
        const search = searchParams.get("search");
        const prixMin = searchParams.get("prixMin");
        const prixMax = searchParams.get("prixMax");
        const surfaceMin = searchParams.get("surfaceMin");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
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

        if (prixMin) {
            where.prixVente = { ...where.prixVente, gte: parseFloat(prixMin) };
        }

        if (prixMax) {
            where.prixVente = { ...where.prixVente, lte: parseFloat(prixMax) };
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
    } catch (error) {
        console.error("Error fetching biens:", error);
        return NextResponse.json(
            { error: "Failed to fetch biens" },
            { status: 500 }
        );
    }
}

// POST /api/immobilier/biens - Create new property
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("biens_immo");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        // Generate reference
        const lastBien = await prisma.bienImmobilier.findFirst({
            where: { entrepriseId: session.user.entrepriseId },
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
                entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Error creating bien:", error);
        return NextResponse.json(
            { error: "Failed to create bien" },
            { status: 500 }
        );
    }
}
