import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { mouvementPointsCreateSchema } from "@/lib/validation";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const { searchParams } = new URL(req.url);
        const clientId = searchParams.get("clientId");
        const type = searchParams.get("type");
        const pagination = getPaginationParams(searchParams);

        const where = {
            entrepriseId,
            ...(clientId && { clientId }),
            ...(type && { type }),
        };

        const [mouvements, total] = await Promise.all([
            prisma.mouvementPoints.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: pagination.skip,
                take: pagination.limit,
                include: {
                    client: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.mouvementPoints.count({ where }),
        ]);

        return NextResponse.json(
            createPaginatedResponse(mouvements, total, pagination)
        );
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const body = await req.json();
        const validation = mouvementPointsCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const { clientId, type, points, description, reference, dateExpiration } = validation.data;

        // Verify that the client exists and belongs to the tenant
        const client = await prisma.client.findFirst({
            where: {
                id: clientId,
                entrepriseId,
            },
        });

        if (!client) {
            return NextResponse.json(
                { message: "Client non trouvé" },
                { status: 404 }
            );
        }

        // Calculate new points balance
        let pointsChange = points;
        if (type === "DEPENSE" || type === "EXPIRATION") {
            pointsChange = -Math.abs(points);
        } else {
            pointsChange = Math.abs(points);
        }

        const newBalance = client.points_solde + pointsChange;

        if (newBalance < 0) {
            return NextResponse.json(
                { message: "Le solde de points ne peut pas être négatif" },
                { status: 400 }
            );
        }

        // Create the movement and update client balance in a transaction
        const [mouvement] = await prisma.$transaction([
            prisma.mouvementPoints.create({
                data: {
                    type,
                    points: Math.abs(points),
                    description: description || undefined,
                    reference: reference || undefined,
                    dateExpiration: dateExpiration ? new Date(dateExpiration) : undefined,
                    clientId,
                    entrepriseId,
                },
                include: {
                    client: {
                        select: {
                            id: true,
                            nom: true,
                            prenom: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.client.update({
                where: { id: clientId },
                data: {
                    points_solde: newBalance,
                },
            }),
        ]);

        return NextResponse.json(mouvement, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}
