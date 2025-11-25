import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/interventions/[id] - Get intervention details
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("domicile");
        if (capabilityCheck) return capabilityCheck;

        const intervention = await prisma.intervention.findUnique({
            where: {
                id: params.id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                client: true,
                plombier: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                camionnette: true,
                materielUtilise: {
                    include: {
                        article: true,
                        stockCamionnette: true,
                    },
                },
                timeLogs: {
                    include: {
                        plombier: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        dateDebut: "desc",
                    },
                },
                historique: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 50,
                },
                document: true,
                contrat: true,
            },
        });

        if (!intervention) {
            return NextResponse.json(
                { error: "Intervention not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ intervention });
    } catch (error) {
        console.error("Error fetching intervention:", error);
        return NextResponse.json(
            { error: "Failed to fetch intervention" },
            { status: 500 }
        );
    }
}

// PUT /api/interventions/[id] - Update intervention
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("domicile");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        const intervention = await prisma.intervention.update({
            where: {
                id: params.id,
                entrepriseId: session.user.entrepriseId,
            },
            data: body,
            include: {
                client: true,
                plombier: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // Log the update
        await prisma.interventionHistorique.create({
            data: {
                interventionId: params.id,
                action: "UPDATE",
                description: "Intervention mise à jour",
                metadata: body,
                createdBy: session.user.id,
            },
        });

        return NextResponse.json({ intervention });
    } catch (error) {
        console.error("Error updating intervention:", error);
        return NextResponse.json(
            { error: "Failed to update intervention" },
            { status: 500 }
        );
    }
}

// DELETE /api/interventions/[id] - Delete intervention
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("domicile");
        if (capabilityCheck) return capabilityCheck;

        await prisma.intervention.delete({
            where: {
                id: params.id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting intervention:", error);
        return NextResponse.json(
            { error: "Failed to delete intervention" },
            { status: 500 }
        );
    }
}
