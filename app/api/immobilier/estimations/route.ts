import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/immobilier/estimations - List estimations with filters
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("estimation_immo");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const bienId = searchParams.get("bienId");
        const agentId = searchParams.get("agentId");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const search = searchParams.get("search");

        const where: any = {
            bien: {
                entrepriseId: session.user.entrepriseId,
            },
        };

        if (bienId) {
            where.bienId = bienId;
        }

        if (agentId) {
            where.agentId = agentId;
        }

        if (dateFrom) {
            where.dateEstimation = { ...where.dateEstimation, gte: new Date(dateFrom) };
        }

        if (dateTo) {
            where.dateEstimation = { ...where.dateEstimation, lte: new Date(dateTo) };
        }

        if (search) {
            where.OR = [
                { bien: { titre: { contains: search, mode: "insensitive" } } },
                { bien: { reference: { contains: search, mode: "insensitive" } } },
                { bien: { ville: { contains: search, mode: "insensitive" } } },
                { notes: { contains: search, mode: "insensitive" } },
            ];
        }

        const estimations = await prisma.estimationBien.findMany({
            where,
            include: {
                bien: {
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                        typeBien: true,
                        ville: true,
                        adresse: true,
                        surface: true,
                        nbPieces: true,
                        photos: true,
                    },
                },
                agent: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                    },
                },
            },
            orderBy: { dateEstimation: "desc" },
            take: 100,
        });

        return NextResponse.json({ estimations });
    } catch (error) {
        console.error("Error fetching estimations:", error);
        return NextResponse.json(
            { error: "Failed to fetch estimations" },
            { status: 500 }
        );
    }
}

// POST /api/immobilier/estimations - Create new estimation
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("estimation_immo");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();

        if (!body.bienId || !body.prixEstimeBas || !body.prixEstimeHaut || !body.prixRecommande) {
            return NextResponse.json(
                { error: "Bien et prix d'estimation requis" },
                { status: 400 }
            );
        }

        // Verify bien belongs to entreprise
        const bien = await prisma.bienImmobilier.findFirst({
            where: {
                id: body.bienId,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!bien) {
            return NextResponse.json(
                { error: "Bien not found" },
                { status: 404 }
            );
        }

        const estimation = await prisma.estimationBien.create({
            data: {
                entrepriseId: session.user.entrepriseId,
                bienId: body.bienId,
                prixEstimeBas: body.prixEstimeBas,
                prixEstimeHaut: body.prixEstimeHaut,
                prixRecommande: body.prixRecommande,
                methode: body.methode,
                comparables: body.comparables,
                agentId: body.agentId,
                validiteJours: body.validiteJours || 90,
                notes: body.notes,
            },
            include: {
                bien: {
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                        typeBien: true,
                        ville: true,
                    },
                },
                agent: {
                    select: {
                        id: true,
                        prenom: true,
                        nom: true,
                    },
                },
            },
        });

        return NextResponse.json({ estimation }, { status: 201 });
    } catch (error) {
        console.error("Error creating estimation:", error);
        return NextResponse.json(
            { error: "Failed to create estimation" },
            { status: 500 }
        );
    }
}
