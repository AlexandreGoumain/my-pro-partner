import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateNotificationsSchema = z.object({
    emailNotifications: z.boolean(),
    newsUpdates: z.boolean(),
});

export async function PATCH(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const validatedData = updateNotificationsSchema.parse(body);

        // Update user preferences
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                emailNotifications: validatedData.emailNotifications,
                newsUpdates: validatedData.newsUpdates,
            },
        });

        return NextResponse.json({
            success: true,
            preferences: {
                emailNotifications: updatedUser.emailNotifications,
                newsUpdates: updatedUser.newsUpdates,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Données invalides", details: error.errors },
                { status: 400 }
            );
        }

        console.error("Update notifications error:", error);
        return NextResponse.json(
            { error: "Une erreur s'est produite" },
            { status: 500 }
        );
    }
}
