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

        const camionnettes = await prisma.camionnette.findMany({
            where: {
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                plombierPrincipal: {
                    select: {
                        name: true,
                    },
                },
                _count: {
                    select: {
                        stock: true,
                    },
                },
            },
            orderBy: {
                immatriculation: "asc",
            },
        });

        return NextResponse.json({ camionnettes });
    } catch (error) {
        console.error("Error fetching camionnettes:", error);
        return NextResponse.json(
            { error: "Failed to fetch camionnettes" },
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

        const body = await request.json();

        const camionnette = await prisma.camionnette.create({
            data: {
                nom: body.nom || null,
                immatriculation: body.immatriculation,
                marque: body.marque,
                modele: body.modele,
                annee: body.annee,
                plombierPrincipalId: body.plombierPrincipalId,
                kilometres: body.kilometres || 0,
                actif: body.actif ?? true,
                entrepriseId: session.user.entrepriseId,
            },
        });

        return NextResponse.json({ camionnette }, { status: 201 });
    } catch (error) {
        console.error("Error creating camionnette:", error);
        return NextResponse.json(
            { error: "Failed to create camionnette" },
            { status: 500 }
        );
    }
}
