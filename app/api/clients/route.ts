import { requireAuth } from "@/lib/api/auth-middleware";
import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { clientCreateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

// GET: Récupérer tous les clients
export async function GET(req: NextRequest) {
    try {
        const sessionOrError = await requireAuth();
        if (sessionOrError instanceof NextResponse) return sessionOrError;

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const pagination = getPaginationParams(searchParams);

        const where = search
            ? {
                  OR: [
                      { nom: { contains: search, mode: "insensitive" as const } },
                      { email: { contains: search, mode: "insensitive" as const } },
                      { ville: { contains: search, mode: "insensitive" as const } },
                  ],
              }
            : {};

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
        console.error("Erreur lors de la récupération des clients:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}

// POST: Créer un nouveau client
export async function POST(req: NextRequest) {
    try {
        const sessionOrError = await requireAuth();
        if (sessionOrError instanceof NextResponse) return sessionOrError;

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
            data: validation.data,
        });

        return NextResponse.json(client, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de la création du client:", error);
        return NextResponse.json(
            { message: "Erreur interne du serveur" },
            { status: 500 }
        );
    }
}
