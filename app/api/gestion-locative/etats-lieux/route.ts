import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/gestion-locative/etats-lieux - List etats des lieux
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("etats_lieux");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const typeEtat = searchParams.get("type");
        const bailId = searchParams.get("bailId");
        const search = searchParams.get("search");
        const planifies = searchParams.get("planifies");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Error fetching etats des lieux:", error);
        return NextResponse.json(
            { error: "Failed to fetch etats des lieux" },
            { status: 500 }
        );
    }
}

// POST /api/gestion-locative/etats-lieux - Create new etat des lieux
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("etats_lieux");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.bailId || !body.typeEtat || !body.dateEtat) {
            return NextResponse.json(
                { error: "Bail, type et date requis" },
                { status: 400 }
            );
        }

        // Verify bail exists and belongs to entreprise
        const bail = await prisma.bailLocatif.findFirst({
            where: {
                id: body.bailId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!bail) {
            return NextResponse.json(
                { error: "Bail non trouvé" },
                { status: 404 }
            );
        }

        const etatDesLieux = await prisma.etatDesLieux.create({
            data: {
                entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Error creating etat des lieux:", error);
        return NextResponse.json(
            { error: "Failed to create etat des lieux" },
            { status: 500 }
        );
    }
}
