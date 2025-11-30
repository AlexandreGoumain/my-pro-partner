import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/immobilier/diffusion - List diffusions with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("diffusion_annonces");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const bienId = searchParams.get("bienId");
        const portail = searchParams.get("portail");
        const statut = searchParams.get("statut");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (bienId) {
            where.bienId = bienId;
        }

        if (portail && portail !== "ALL") {
            where.portail = portail;
        }

        if (statut && statut !== "ALL") {
            where.statut = statut;
        }

        const diffusions = await prisma.diffusionAnnonce.findMany({
            where,
            include: {
                bien: {
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                        typeBien: true,
                        ville: true,
                        prixVente: true,
                        photos: true,
                    },
                },
                _count: {
                    select: {
                        leads: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        return NextResponse.json({ diffusions });
    } catch (error) {
        console.error("Error fetching diffusions:", error);
        return NextResponse.json(
            { error: "Failed to fetch diffusions" },
            { status: 500 }
        );
    }
}

// POST /api/immobilier/diffusion - Publish to portals
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("diffusion_annonces");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.bienId || !body.portails || body.portails.length === 0) {
            return NextResponse.json(
                { error: "Bien et portails requis" },
                { status: 400 }
            );
        }

        // Get bien info for the diffusion
        const bien = await prisma.bienImmobilier.findUnique({
            where: { id: body.bienId },
            select: {
                id: true,
                titre: true,
                description: true,
                typeBien: true,
                prixVente: true,
                photos: true,
            },
        });

        if (!bien) {
            return NextResponse.json(
                { error: "Bien not found" },
                { status: 404 }
            );
        }

        // Create diffusions for each portal
        const diffusions = await Promise.all(
            body.portails.map(async (portail: string) => {
                // Check if already published to this portal
                const existing = await prisma.diffusionAnnonce.findFirst({
                    where: {
                        bienId: body.bienId,
                        portail: portail as any,
                        statut: { in: ["EN_ATTENTE", "ACTIVE"] },
                    },
                });

                if (existing) {
                    return existing;
                }

                return prisma.diffusionAnnonce.create({
                    data: {
                        entrepriseId: session.user.entrepriseId,
                        bienId: body.bienId,
                        portail: portail as any,
                        typeAnnonce: body.typeAnnonce || "STANDARD",
                        statut: "EN_ATTENTE",
                        titreAnnonce: body.titre || bien.titre,
                        descriptionAnnonce: body.description || bien.description,
                        photosSelectionnees: (body.photos || bien.photos) as any,
                    },
                });
            })
        );

        // Simulate publishing (in production, would call portal APIs)
        // Update status to PUBLIEE after a short delay
        setTimeout(async () => {
            for (const diffusion of diffusions) {
                await prisma.diffusionAnnonce.update({
                    where: { id: diffusion.id },
                    data: {
                        statut: "ACTIVE",
                        datePublication: new Date(),
                        urlAnnonce: `https://${diffusion.portail.toLowerCase()}.fr/annonce/${diffusion.id}`,
                    },
                });
            }
        }, 2000);

        return NextResponse.json({ diffusions }, { status: 201 });
    } catch (error) {
        console.error("Error creating diffusions:", error);
        return NextResponse.json(
            { error: "Failed to create diffusions" },
            { status: 500 }
        );
    }
}
