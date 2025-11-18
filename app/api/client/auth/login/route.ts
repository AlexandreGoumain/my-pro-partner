import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { z } from "zod";
import { validateRequest } from "@/lib/utils/validation-helper";

const CLIENT_JWT_SECRET = process.env.CLIENT_JWT_SECRET || process.env.NEXTAUTH_SECRET || "secret";

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

        return NextResponse.json({
            token,
            client: clientWithoutPassword,
        });
    } catch (error) {
        console.error("[Client Login] Error:", error);
        return NextResponse.json(
            { message: "Erreur lors de la connexion" },
            { status: 500 }
        );
    }
}
