import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { nanoid } from "nanoid";
import { EmailService } from "@/lib/services/email/email.service";

const forgotPasswordSchema = z.object({
    email: z.string().email("Email invalide"),
});

/**
 * POST /api/client/auth/forgot-password
 * Request a password reset token
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validation = forgotPasswordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Données invalides",
                    errors: validation.error.errors,
                },
                { status: 400 }
            );
        }

        const { email } = validation.data;

        // Find client with this email
        const client = await prisma.client.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
                clientPortalEnabled: true,
            },
        });

        // Always return success to prevent email enumeration
        if (!client) {
            return NextResponse.json({
                message:
                    "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
            });
        }

        // Generate reset token (valid for 1 hour)
        const token = nanoid(32);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        // Delete any existing tokens for this client
        await prisma.passwordResetToken.deleteMany({
            where: {
                clientId: client.id,
            },
        });

        // Create new token
        await prisma.passwordResetToken.create({
            data: {
                token,
                clientId: client.id,
                email: client.email!,
                expiresAt,
            },
        });

        // Send password reset email
        const clientName = client.prenom
            ? `${client.prenom} ${client.nom}`
            : client.nom;

        await EmailService.sendPasswordResetEmail(
            client.email!,
            token,
            clientName
        );

        // In development, return the reset link for testing
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/client/reset-password?token=${token}`;

        if (process.env.NODE_ENV === "development") {
            return NextResponse.json({
                message:
                    "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
                resetLink, // Only in dev
            });
        }

        return NextResponse.json({
            message:
                "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
        });
    } catch (error) {
        console.error("[Forgot Password API] Error:", error);
        return NextResponse.json(
            { message: "Erreur lors de la demande de réinitialisation" },
            { status: 500 }
        );
    }
}
