import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/comptabilite - List écritures comptables
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("comptabilite_copro");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const coproprieteId = searchParams.get("coproprieteId");
        const typeEcriture = searchParams.get("typeEcriture");
        const compte = searchParams.get("compte");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const search = searchParams.get("search");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (coproprieteId) {
            where.coproprieteId = coproprieteId;
        }

        if (typeEcriture && typeEcriture !== "ALL") {
            where.typeEcriture = typeEcriture;
        }

        if (compte) {
            where.compte = compte;
        }

        if (dateFrom) {
            where.dateEcriture = { ...where.dateEcriture, gte: new Date(dateFrom) };
        }

        if (dateTo) {
            where.dateEcriture = { ...where.dateEcriture, lte: new Date(dateTo) };
        }

        if (search) {
            where.OR = [
                { libelle: { contains: search, mode: "insensitive" } },
                { compte: { contains: search, mode: "insensitive" } },
            ];
        }

        const ecritures = await prisma.ecritureComptableCopro.findMany({
            where,
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
                lot: {
                    select: {
                        id: true,
                        numero: true,
                    },
                },
            },
            orderBy: { dateEcriture: "desc" },
            take: 500,
        });

        return NextResponse.json({ ecritures });
    } catch (error) {
        console.error("Error fetching ecritures:", error);
        return NextResponse.json(
            { error: "Failed to fetch ecritures" },
            { status: 500 }
        );
    }
}

// POST /api/syndic/comptabilite - Create écriture
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("comptabilite_copro");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.coproprieteId || !body.dateEcriture || !body.libelle || !body.montant || !body.typeEcriture || !body.compte) {
            return NextResponse.json(
                { error: "Copropriété, date, libellé, montant, type et compte requis" },
                { status: 400 }
            );
        }

        const ecriture = await prisma.ecritureComptableCopro.create({
            data: {
                entrepriseId: session.user.entrepriseId,
                coproprieteId: body.coproprieteId,
                dateEcriture: new Date(body.dateEcriture),
                libelle: body.libelle,
                montant: body.montant,
                typeEcriture: body.typeEcriture,
                compte: body.compte,
                categorieCharge: body.categorieCharge,
                lotId: body.lotId,
                pieceJustificative: body.pieceJustificative,
                notes: body.notes,
            },
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
                lot: {
                    select: {
                        id: true,
                        numero: true,
                    },
                },
            },
        });

        return NextResponse.json({ ecriture }, { status: 201 });
    } catch (error) {
        console.error("Error creating ecriture:", error);
        return NextResponse.json(
            { error: "Failed to create ecriture" },
            { status: 500 }
        );
    }
}
