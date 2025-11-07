import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token requis"),
    newPassword: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

/**
 * POST /api/client/auth/reset-password
 * Reset password with valid token
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = resetPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const { token, newPassword } = validation.data;

        // Find the reset token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
        });

        if (!resetToken) {
            return NextResponse.json(
                { message: "Token invalide ou expiré" },
                { status: 400 }
            );
        }

        // Check if token is expired
        if (new Date() > resetToken.expiresAt) {
            return NextResponse.json(
                { message: "Token expiré. Veuillez refaire une demande." },
                { status: 400 }
            );
        }

        // Check if token has already been used
        if (resetToken.used) {
            return NextResponse.json(
                {
                    message:
                        "Token déjà utilisé. Veuillez refaire une demande si nécessaire.",
                },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update client password and mark token as used
        await prisma.$transaction([
            prisma.client.update({
                where: { id: resetToken.clientId },
                data: { password: hashedPassword },
            }),
            prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: {
                    used: true,
                    usedAt: new Date(),
                },
            }),
        ]);

        return NextResponse.json({
            message:
                "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
        });
    } catch (error) {
        console.error("[Reset Password API] Error:", error);
        return NextResponse.json(
            { message: "Erreur lors de la réinitialisation du mot de passe" },
            { status: 500 }
        );
    }
}
