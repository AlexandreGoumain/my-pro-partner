import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/syndic/ag - List general assemblies
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("assemblees_generales");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const coproprieteId = searchParams.get("coproprieteId");
        const type = searchParams.get("type");
        const statut = searchParams.get("statut");
        const upcoming = searchParams.get("upcoming");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (coproprieteId) {
            where.coproprieteId = coproprieteId;
        }

        if (type && type !== "ALL") {
            where.typeAG = type;
        }

        if (statut && statut !== "ALL") {
            where.statut = statut;
        }

        // Filter for upcoming AGs
        if (upcoming === "true") {
            where.dateAG = { gte: new Date() };
            where.statut = { in: ["PLANIFIEE", "CONVOCATIONS_ENVOYEES", "EN_COURS"] };
        }

        const assemblees = await prisma.assembleeGenerale.findMany({
            where,
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                        adresse: true,
                        ville: true,
                    },
                },
                resolutions: {
                    orderBy: { numero: "asc" },
                },
                _count: {
                    select: {
                        resolutions: true,
                    },
                },
            },
            orderBy: { dateAG: "desc" },
            take: 100,
        });

        return NextResponse.json({ assemblees });
    } catch (error) {
        console.error("Error fetching assemblees:", error);
        return NextResponse.json(
            { error: "Failed to fetch assemblees" },
            { status: 500 }
        );
    }
}

// POST /api/syndic/ag - Create new general assembly
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("assemblees_generales");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.coproprieteId || !body.dateAG) {
            return NextResponse.json(
                { error: "Copropriété et date requises" },
                { status: 400 }
            );
        }

        const dateConvocation = body.dateConvocation
            ? new Date(body.dateConvocation)
            : new Date();

        const ag = await prisma.assembleeGenerale.create({
            data: {
                entrepriseId: session.user.entrepriseId,
                coproprieteId: body.coproprieteId,
                typeAG: body.typeAG || body.type || "ORDINAIRE",
                dateConvocation,
                dateAG: new Date(body.dateAG),
                lieu: body.lieu || "",
                heureDebut: body.heureDebut || "18:30",
                statut: "PLANIFIEE",
                ordreJour: body.ordreJour,
                resolutions: body.resolutions
                    ? {
                          create: body.resolutions.map(
                              (res: any, index: number) => ({
                                  numero: index + 1,
                                  titre: res.titre,
                                  description: res.description,
                                  typeMajorite: res.typeMajorite || "SIMPLE",
                                  entrepriseId: session.user.entrepriseId,
                              })
                          ),
                      }
                    : undefined,
            },
            include: {
                copropriete: {
                    select: {
                        id: true,
                        nom: true,
                    },
                },
                resolutions: true,
            },
        });

        return NextResponse.json({ ag }, { status: 201 });
    } catch (error) {
        console.error("Error creating AG:", error);
        return NextResponse.json(
            { error: "Failed to create AG" },
            { status: 500 }
        );
    }
}
