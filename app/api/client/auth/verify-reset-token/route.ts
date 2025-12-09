import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { nanoid } from "nanoid";
import { validateRequest } from "@/lib/utils/validation-helper";

const verifyTokenSchema = z.object({
    token: z.string().min(1, "Token requis"),
});

/**
 * POST /api/client/auth/verify-reset-token
 * Security: Exchange URL token for a secure session cookie
 * This prevents the reset token from being exposed in browser history/Referer headers
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = validateRequest(verifyTokenSchema, body);
        if (!result.success) return result.response;

        const { token } = result.data;

        // Find the reset token
        const resetToken = await prisma.passwordResetToken.findUnique({
            where: { token },
            include: { client: true },
        });

        // Security: Generic error message to prevent token enumeration
        if (!resetToken) {
            return NextResponse.json(
                { valid: false, message: "Token invalide ou expiré" },
                { status: 400 }
            );
        }

        // Check if token is expired
        if (new Date() > resetToken.expiresAt) {
            return NextResponse.json(
                { valid: false, message: "Token expiré. Veuillez refaire une demande." },
                { status: 400 }
            );
        }

        // Check if token has already been used
        if (resetToken.used) {
            return NextResponse.json(
                { valid: false, message: "Token déjà utilisé." },
                { status: 400 }
            );
        }

        // Generate a short-lived session token for the password reset form
        // This token is stored in a secure HttpOnly cookie
        const sessionToken = nanoid(32);

        // Store the session token in the database (linked to the reset token)
        await prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { sessionToken },
        });

        // Create response with secure cookie
        const response = NextResponse.json({
            valid: true,
            clientName: resetToken.client.prenom
                ? `${resetToken.client.prenom} ${resetToken.client.nom}`
                : resetToken.client.nom,
        });

        // Set secure HttpOnly cookie for the reset session
        const isProduction = process.env.NODE_ENV === "production";
        response.cookies.set("resetSession", sessionToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "strict",
            path: "/client/reset-password",
            maxAge: 60 * 15, // 15 minutes - short lived
        });

        return response;
    } catch (error) {
        console.error("[Verify Reset Token API] Error:", error);
        return NextResponse.json(
            { valid: false, message: "Erreur lors de la vérification du token" },
            { status: 500 }
        );
    }
}
