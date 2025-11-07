import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileUpdateSchema = z.object({
    telephone: z.string().optional().or(z.literal("")),
    adresse: z.string().optional().or(z.literal("")),
    codePostal: z.string().optional().or(z.literal("")),
    ville: z.string().optional().or(z.literal("")),
});

/**
 * PUT /api/client/profile
 * Update client profile (limited fields)
 */
export async function PUT(req: NextRequest) {
    try {
        const { client } = await requireClientAuth(req);

        const body = await req.json();
        const validation = profileUpdateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        // Update only allowed fields
        const updatedClient = await prisma.client.update({
            where: { id: client.id },
            data: {
                telephone: validation.data.telephone || undefined,
                adresse: validation.data.adresse || undefined,
                codePostal: validation.data.codePostal || undefined,
                ville: validation.data.ville || undefined,
            },
        });

        // Remove password from response
        const { password, ...clientWithoutPassword } = updatedClient;

        return NextResponse.json({
            client: clientWithoutPassword,
        });
    } catch (error) {
        return handleClientAuthError(error);
    }
}
