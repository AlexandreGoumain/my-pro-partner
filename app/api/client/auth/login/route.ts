import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { z } from "zod";
import { validateRequest } from "@/lib/utils/validation-helper";
import { tokenVerifyLimiter, getClientIp } from "@/lib/rate-limit";

// Sécurité: Ne jamais utiliser de fallback "secret" - lever une erreur si non défini
const CLIENT_JWT_SECRET = process.env.CLIENT_JWT_SECRET || process.env.NEXTAUTH_SECRET;
if (!CLIENT_JWT_SECRET) {
    throw new Error("CLIENT_JWT_SECRET or NEXTAUTH_SECRET must be defined");
}

const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
});

/**
 * POST /api/client/auth/login
 * Client portal login
 */
export async function POST(req: NextRequest) {
    try {
        // Rate limiting: 5 tentatives par 15 minutes par IP
        const ip = getClientIp(req);
        const { success: rateLimitSuccess } = await tokenVerifyLimiter.limit(ip);

        if (!rateLimitSuccess) {
            return NextResponse.json(
                { message: "Trop de tentatives. Réessayez dans 15 minutes." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const result = validateRequest(loginSchema, body);
        if (!result.success) return result.response;

        const { email, password } = result.data;

        // Find client by email
        const client = await prisma.client.findFirst({
            where: {
                email: {
                    equals: email,
                    mode: "insensitive",
                },
            },
            include: {
                niveauFidelite: true,
                entreprise: true,
            },
        });

        if (!client) {
            return NextResponse.json(
                { message: "Email ou mot de passe incorrect" },
                { status: 401 }
            );
        }

        // Check if portal access is enabled
        if (!client.clientPortalEnabled) {
            return NextResponse.json(
                { message: "Accès au portail client non activé. Contactez l'entreprise." },
                { status: 403 }
            );
        }

        // Check if password is set
        if (!client.password) {
            return NextResponse.json(
                { message: "Aucun mot de passe configuré. Contactez l'entreprise." },
                { status: 401 }
            );
        }

        // Verify password
        const isValid = await bcrypt.compare(password, client.password);

        if (!isValid) {
            return NextResponse.json(
                { message: "Email ou mot de passe incorrect" },
                { status: 401 }
            );
        }

        // Update last login
        await prisma.client.update({
            where: { id: client.id },
            data: { lastLoginAt: new Date() },
        });

        // Generate JWT token
        const token = await new SignJWT({
            clientId: client.id,
            email: client.email,
            entrepriseId: client.entrepriseId,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(new TextEncoder().encode(CLIENT_JWT_SECRET));

        // Return client info (without password)
        const { password: _password, ...clientWithoutPassword } = client;

        // Security: Set JWT as HttpOnly cookie instead of returning in body
        const response = NextResponse.json({
            client: clientWithoutPassword,
        });

        // Set secure HttpOnly cookie
        const isProduction = process.env.NODE_ENV === "production";
        response.cookies.set("clientToken", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error("[Client Login] Error:", error);
        return NextResponse.json(
            { message: "Erreur lors de la connexion" },
            { status: 500 }
        );
    }
}
