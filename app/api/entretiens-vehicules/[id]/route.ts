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

        const entretien = await prisma.entretienVehicule.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                camionnette: {
                    select: {
                        id: true,
                        immatriculation: true,
                        marque: true,
                        modele: true,
                    },
                },
            },
        });

        if (!entretien) {
            return NextResponse.json(
                { error: "Entretien not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ entretien });
    } catch (error) {
        console.error("Error fetching entretien:", error);
        return NextResponse.json(
            { error: "Failed to fetch entretien" },
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
        const existing = await prisma.entretienVehicule.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Entretien not found" },
                { status: 404 }
            );
        }

        const entretien = await prisma.entretienVehicule.update({
            where: { id },
            data: {
                type: body.type,
                description: body.description || null,
                kilometrage: body.kilometrage ? Number(body.kilometrage) : null,
                cout: body.cout ? Number(body.cout) : null,
                dateEntretien: new Date(body.dateEntretien),
                dateProchain: body.dateProchain
                    ? new Date(body.dateProchain)
                    : null,
                prestataire: body.prestataire || null,
                numeroFacture: body.numeroFacture || null,
                notes: body.notes || null,
            },
            include: {
                camionnette: {
                    select: {
                        id: true,
                        immatriculation: true,
                        marque: true,
                        modele: true,
                    },
                },
            },
        });

        return NextResponse.json({ entretien });
    } catch (error) {
        console.error("Error updating entretien:", error);
        return NextResponse.json(
            { error: "Failed to update entretien" },
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
        const existing = await prisma.entretienVehicule.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Entretien not found" },
                { status: 404 }
            );
        }

        await prisma.entretienVehicule.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting entretien:", error);
        return NextResponse.json(
            { error: "Failed to delete entretien" },
            { status: 500 }
        );
    }
}
