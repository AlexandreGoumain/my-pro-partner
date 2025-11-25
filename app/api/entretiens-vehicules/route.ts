import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

        const { searchParams } = new URL(request.url);
        const camionnetteId = searchParams.get("camionnetteId");
        const type = searchParams.get("type");

        const entretiens = await prisma.entretienVehicule.findMany({
            where: {
                entrepriseId: session.user.entrepriseId,
                ...(camionnetteId && { camionnetteId }),
                ...(type && { type: type as never }),
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
            orderBy: {
                dateEntretien: "desc",
            },
        });

        return NextResponse.json({ entretiens });
    } catch (error) {
        console.error("Error fetching entretiens:", error);
        return NextResponse.json(
            { error: "Failed to fetch entretiens" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
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

        const body = await request.json();

        // Verify the camionnette belongs to this entreprise
        const camionnette = await prisma.camionnette.findFirst({
            where: {
                id: body.camionnetteId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!camionnette) {
            return NextResponse.json(
                { error: "Vehicle not found" },
                { status: 404 }
            );
        }

        const entretien = await prisma.entretienVehicule.create({
            data: {
                camionnetteId: body.camionnetteId,
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

        // Update camionnette's dernierEntretien and prochainEntretien
        await prisma.camionnette.update({
            where: { id: body.camionnetteId },
            data: {
                dernierEntretien: new Date(body.dateEntretien),
                prochainEntretien: body.dateProchain
                    ? new Date(body.dateProchain)
                    : null,
                ...(body.kilometrage && { kilometres: Number(body.kilometrage) }),
            },
        });

        return NextResponse.json({ entretien }, { status: 201 });
    } catch (error) {
        console.error("Error creating entretien:", error);
        return NextResponse.json(
            { error: "Failed to create entretien" },
            { status: 500 }
        );
    }
}
