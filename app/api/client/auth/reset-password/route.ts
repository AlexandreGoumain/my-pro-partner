import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { validateRequest } from "@/lib/utils/validation-helper";

const resetPasswordSchema = z.object({
    token: z.string().optional(), // Optional: fallback for backwards compatibility
    newPassword: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

/**
 * POST /api/client/auth/reset-password
 * Security: Reset password using secure session cookie (preferred) or token (fallback)
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = validateRequest(resetPasswordSchema, body);
        if (!result.success) return result.response;

        const { token: bodyToken, newPassword } = result.data;

        // Security: Prefer session cookie over token in body
        const sessionToken = req.cookies.get("resetSession")?.value;

        let resetToken;

        if (sessionToken) {
            // Use secure session token from HttpOnly cookie
            resetToken = await prisma.passwordResetToken.findUnique({
                where: { sessionToken },
            });
        } else if (bodyToken) {
            // Fallback to token in body (for backwards compatibility)
            resetToken = await prisma.passwordResetToken.findUnique({
                where: { token: bodyToken },
            });
        }

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
                    sessionToken: null, // Clear session token
                },
            }),
        ]);

        // Security: Clear the session cookie
        const response = NextResponse.json({
            message:
                "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
        });

        response.cookies.set("resetSession", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/client/reset-password",
            maxAge: 0, // Expire immediately
        });

        return response;
    } catch (error) {
        console.error("[Reset Password API] Error:", error);
        return NextResponse.json(
            { message: "Erreur lors de la réinitialisation du mot de passe" },
            { status: 500 }
        );
    }
}
