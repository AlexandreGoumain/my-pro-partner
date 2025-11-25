import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("stock_camionnette");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const camionnette = await prisma.camionnette.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                plombierPrincipal: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                stock: {
                    include: {
                        article: {
                            select: {
                                nom: true,
                                reference: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        stock: true,
                        interventions: true,
                    },
                },
            },
        });

        if (!camionnette) {
            return NextResponse.json(
                { error: "Camionnette not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ camionnette });
    } catch (error) {
        console.error("Error fetching camionnette:", error);
        return NextResponse.json(
            { error: "Failed to fetch camionnette" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("stock_camionnette");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify ownership
        const existing = await prisma.camionnette.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Camionnette not found" },
                { status: 404 }
            );
        }

        const camionnette = await prisma.camionnette.update({
            where: { id },
            data: {
                nom: body.nom,
                immatriculation: body.immatriculation,
                marque: body.marque,
                modele: body.modele,
                annee: body.annee,
                plombierPrincipalId: body.plombierPrincipalId,
                actif: body.actif,
                kilometres: body.kilometres,
                prochainEntretien: body.prochainEntretien
                    ? new Date(body.prochainEntretien)
                    : undefined,
            },
            include: {
                plombierPrincipal: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json({ camionnette });
    } catch (error) {
        console.error("Error updating camionnette:", error);
        return NextResponse.json(
            { error: "Failed to update camionnette" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("stock_camionnette");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify ownership
        const existing = await prisma.camionnette.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Camionnette not found" },
                { status: 404 }
            );
        }

        await prisma.camionnette.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting camionnette:", error);
        return NextResponse.json(
            { error: "Failed to delete camionnette" },
            { status: 500 }
        );
    }
}
