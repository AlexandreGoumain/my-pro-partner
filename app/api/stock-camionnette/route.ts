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

        const searchParams = request.nextUrl.searchParams;
        const camionnetteId = searchParams.get("camionnetteId");
        const categorie = searchParams.get("categorie");
        const search = searchParams.get("search");

        const where: any = {
            entrepriseId: session.user.entrepriseId,
        };

        if (camionnetteId) {
            where.camionnetteId = camionnetteId;
        }

        if (categorie && categorie !== "ALL") {
            where.categorie = categorie;
        }

        if (search) {
            where.OR = [
                { designation: { contains: search, mode: "insensitive" } },
                { reference: { contains: search, mode: "insensitive" } },
            ];
        }

        const stockItems = await prisma.stockCamionnette.findMany({
            where,
            include: {
                camionnette: {
                    select: {
                        nom: true,
                    },
                },
                article: {
                    select: {
                        nom: true,
                        reference: true,
                    },
                },
            },
            orderBy: {
                designation: "asc",
            },
        });

        return NextResponse.json({ stockItems });
    } catch (error) {
        console.error("Error fetching stock:", error);
        return NextResponse.json(
            { error: "Failed to fetch stock" },
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

        const stockItem = await prisma.stockCamionnette.create({
            data: {
                camionnetteId: body.camionnetteId,
                entrepriseId: session.user.entrepriseId,
                articleId: body.articleId,
                designation: body.designation,
                reference: body.reference,
                categorie: body.categorie,
                quantite: body.quantite || 0,
                seuilAlerte: body.seuilAlerte || 2,
                prixUnitaire: body.prixUnitaire,
                diametre: body.diametre,
                materiau: body.materiau,
                longueur: body.longueur,
            },
        });

        return NextResponse.json({ stockItem }, { status: 201 });
    } catch (error) {
        console.error("Error creating stock item:", error);
        return NextResponse.json(
            { error: "Failed to create stock item" },
            { status: 500 }
        );
    }
}
