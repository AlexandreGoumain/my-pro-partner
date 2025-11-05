import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { clientCreateSchema } from "@/lib/validation";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { validateLimit } from "@/lib/middleware/feature-validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const pagination = getPaginationParams(searchParams);

        const where = {
            entrepriseId,
            ...(search && {
                OR: [
                    { nom: { contains: search, mode: "insensitive" as const } },
                    { email: { contains: search, mode: "insensitive" as const } },
                    { ville: { contains: search, mode: "insensitive" as const } },
                ],
            }),
        };

        const [clients, total] = await Promise.all([
            prisma.client.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: pagination.skip,
                take: pagination.limit,
            }),
            prisma.client.count({ where }),
        ]);

        return NextResponse.json(
            createPaginatedResponse(clients, total, pagination)
        );
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { entrepriseId, entreprise } = await requireTenantAuth();

        // Check if user has reached maxClients limit
        const limitCheck = await validateLimit(entreprise.plan, entrepriseId, "maxClients");
        if (limitCheck) return limitCheck;

        const body = await req.json();
        const validation = clientCreateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const client = await prisma.client.create({
            data: {
                ...validation.data,
                entrepriseId,
            },
        });

        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        return handleTenantError(error);
    }
}
