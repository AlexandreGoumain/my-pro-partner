import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/lots - List lots
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("lots_copro");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const coproprieteId = searchParams.get("coproprieteId");
        const typeLot = searchParams.get("typeLot");
        const search = searchParams.get("search");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (coproprieteId) {
            where.coproprieteId = coproprieteId;
        }

        if (typeLot && typeLot !== "ALL") {
            where.typeLot = typeLot;
        }

        if (search) {
            where.OR = [
                { numero: { contains: search, mode: "insensitive" } },
                { coproprietaire: { nom: { contains: search, mode: "insensitive" } } },
            ];
        }

        const lots = await prisma.lotCopropriete.findMany({
            where,
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                        adresse: true,
                    },
                },
                coproprietaire: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                    },
                },
                locataire: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                    },
                },
            },
            orderBy: [{ coproprieteId: "asc" }, { numero: "asc" }],
        });

        return NextResponse.json({ lots });
    } catch (error) {
        console.error("Error fetching lots:", error);
        return NextResponse.json(
            { error: "Failed to fetch lots" },
            { status: 500 }
        );
    }
}

// POST /api/syndic/lots - Create new lot
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("lots_copro");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.coproprieteId || !body.numero || body.tantiemesGeneraux === undefined) {
            return NextResponse.json(
                { error: "Copropriété, numéro et tantièmes généraux requis" },
                { status: 400 }
            );
        }

        // Check for duplicate numero in same copropriete
        const existing = await prisma.lotCopropriete.findFirst({
            where: {
                coproprieteId: body.coproprieteId,
                numero: body.numero,
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Un lot avec ce numéro existe déjà" },
                { status: 400 }
            );
        }

        const lot = await prisma.lotCopropriete.create({
            data: {
                entrepriseId: session.user.entrepriseId,
                coproprieteId: body.coproprieteId,
                numero: body.numero,
                typeLot: body.typeLot || "APPARTEMENT",
                etage: body.etage,
                batiment: body.batiment,
                surface: body.surface,
                tantiemesGeneraux: body.tantiemesGeneraux,
                tantiemesParticuliers: body.tantiemesParticuliers,
                coproprietaireId: body.coproprietaireId,
                locataireId: body.locataireId,
                estLoue: body.estLoue || false,
                notes: body.notes,
            },
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
                coproprietaire: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
            },
        });

        // Update nbLots in copropriete
        await prisma.copropriete.update({
            where: { id: body.coproprieteId },
            data: {
                nbLots: {
                    increment: 1,
                },
            },
        });

        return NextResponse.json({ lot }, { status: 201 });
    } catch (error) {
        console.error("Error creating lot:", error);
        return NextResponse.json(
            { error: "Failed to create lot" },
            { status: 500 }
        );
    }
}
