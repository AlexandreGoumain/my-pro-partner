import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/gestion-locative/incidents - List incidents
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("travaux_locatifs");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const bailId = searchParams.get("bailId");
        const statut = searchParams.get("statut");
        const categorie = searchParams.get("categorie");
        const urgence = searchParams.get("urgence");
        const search = searchParams.get("search");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Error fetching incidents:", error);
        return NextResponse.json(
            { error: "Failed to fetch incidents" },
            { status: 500 }
        );
    }
}

// POST /api/gestion-locative/incidents - Create incident
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("travaux_locatifs");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.bailId || !body.description || !body.categorie) {
            return NextResponse.json(
                { error: "Bail, description et catégorie requis" },
                { status: 400 }
            );
        }

        // Verify bail belongs to entreprise
        const bail = await prisma.bailLocatif.findFirst({
            where: {
                id: body.bailId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!bail) {
            return NextResponse.json(
                { error: "Bail not found" },
                { status: 404 }
            );
        }

        const incident = await prisma.incidentLocatif.create({
            data: {
                entrepriseId: session.user.entrepriseId,
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
    } catch (error) {
        console.error("Error creating incident:", error);
        return NextResponse.json(
            { error: "Failed to create incident" },
            { status: 500 }
        );
    }
}
