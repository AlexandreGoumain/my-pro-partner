import { handlePrismaError } from "@/lib/errors/prisma";
import { prisma } from "@/lib/prisma";
import { clientUpdateSchema } from "@/lib/validation";
import {
    handleTenantError,
    requireTenantAuth,
    validateTenantAccess,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                documents: {
                    orderBy: { createdAt: "desc" },
                    take: 10,
                },
            },
        });

        if (!client) {
            return NextResponse.json(
                { message: "Client non trouvé" },
                { status: 404 }
            );
        }

        validateTenantAccess(client.entrepriseId, entrepriseId);

        return NextResponse.json(client);
    } catch (error) {
        return handleTenantError(error);
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;
        const body = await req.json();

        const existingClient = await prisma.client.findUnique({
            where: { id },
            select: { entrepriseId: true },
        });

        if (!existingClient) {
            return NextResponse.json(
                { message: "Client non trouvé" },
                { status: 404 }
            );
        }

        validateTenantAccess(existingClient.entrepriseId, entrepriseId);

        const validation = clientUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const client = await prisma.client.update({
            where: { id },
            data: validation.data,
        });

        return NextResponse.json(client);
    } catch (error) {
        const { message, status } = handlePrismaError(error);
        return NextResponse.json({ message }, { status });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { entrepriseId } = await requireTenantAuth();
        const { id } = await params;

        const existingClient = await prisma.client.findUnique({
            where: { id },
            select: { entrepriseId: true },
        });

        if (!existingClient) {
            return NextResponse.json(
                { message: "Client non trouvé" },
                { status: 404 }
            );
        }

        validateTenantAccess(existingClient.entrepriseId, entrepriseId);

        const hasDocuments = await prisma.document.count({
            where: {
                clientId: id,
                entrepriseId,
            },
        });

        if (hasDocuments > 0) {
            return NextResponse.json(
                {
                    message:
                        "Impossible de supprimer un client avec des documents",
                },
                { status: 400 }
            );
        }

        await prisma.client.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Client supprimé avec succès" });
    } catch (error) {
        return handleTenantError(error);
    }
}
