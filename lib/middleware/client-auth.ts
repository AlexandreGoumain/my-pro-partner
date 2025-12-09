import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Sécurité: Vérifier que le secret JWT est défini
const CLIENT_JWT_SECRET = process.env.CLIENT_JWT_SECRET || process.env.NEXTAUTH_SECRET;
if (!CLIENT_JWT_SECRET) {
    throw new Error("CLIENT_JWT_SECRET or NEXTAUTH_SECRET must be defined");
}

/**
 * Verify client authentication from JWT token (HttpOnly cookie or Authorization header)
 * Returns client info if authenticated, throws error otherwise
 */
export async function requireClientAuth(req: NextRequest) {
    try {
        // Security: Prefer HttpOnly cookie, fallback to Authorization header for backwards compatibility
        let token = req.cookies.get("clientToken")?.value;

        // Fallback to Authorization header (will be deprecated)
        if (!token) {
            const authHeader = req.headers.get("authorization");
            token = authHeader?.replace("Bearer ", "");
        }

        if (!token) {
            throw new Error("No authentication token provided");
        }

        // Verify JWT token using jose
        const { payload: decoded } = await jwtVerify(
            token,
            new TextEncoder().encode(CLIENT_JWT_SECRET)
        );

        if (!decoded || !decoded.clientId) {
            throw new Error("Invalid or expired token");
        }

        // Fetch client from database
        const client = await prisma.client.findUnique({
            where: { id: decoded.clientId as string },
            include: {
                niveauFidelite: true,
                entreprise: true,
            },
        });

        if (!client) {
            throw new Error("Client not found");
        }

        if (!client.clientPortalEnabled) {
            throw new Error("Client portal access is disabled");
        }

        return {
            client,
            entrepriseId: client.entrepriseId,
        };
    } catch (error) {
        throw error;
    }
}

/**
 * Handle client authentication errors
 */
export function handleClientAuthError(error: unknown) {
    const message = error instanceof Error ? error.message : "Authentication failed";

    if (message.includes("No authentication token") || message.includes("Invalid or expired token")) {
        return NextResponse.json(
            { message: "Non autorisé. Veuillez vous connecter." },
            { status: 401 }
        );
    }

    if (message.includes("Client portal access is disabled")) {
        return NextResponse.json(
            { message: "Accès au portail client désactivé. Contactez l'entreprise." },
            { status: 403 }
        );
    }

    return NextResponse.json(
        { message: "Erreur d'authentification" },
        { status: 401 }
    );
}

/**
 * Ensure client can only access their own data
 */
export function ensureClientOwnership(clientId: string, resourceClientId: string) {
    if (clientId !== resourceClientId) {
        throw new Error("Access denied: you can only access your own data");
    }
}
