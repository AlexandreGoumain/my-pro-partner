import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateRequest } from "@/lib/utils/validation-helper";
import { randomBytes } from "crypto";
import { getDefaultPermissions } from "@/lib/personnel/roles-config";
import bcrypt from "bcryptjs";

const createTechnicienSchema = z.object({
    prenom: z.string().min(1, "Le prénom est requis").max(100),
    nom: z.string().min(1, "Le nom est requis").max(100),
    email: z.string().email("Email invalide"),
    telephone: z.string().min(1, "Le téléphone est requis").max(20),
    camionnetteId: z.string().optional(),
});

/**
 * POST /api/team/technicien
 * Create a new technician (field worker) with status INVITED
 * The user is visible immediately but cannot login until they accept the invitation
 */
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        // Only ADMIN or OWNER can create technicians
        if (!["ADMIN", "OWNER"].includes(session.user.role)) {
            return NextResponse.json(
                { error: "Permission refusée" },
                { status: 403 }
            );
        }

        const body = await req.json();
        const result = validateRequest(createTechnicienSchema, body);
        if (!result.success) return result.response;

        const { prenom, nom, email, telephone, camionnetteId } = result.data;

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Un utilisateur avec cet email existe déjà" },
                { status: 409 }
            );
        }

        // Generate invitation token
        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        // Generate a temporary password (will be replaced when user accepts invitation)
        const tempPassword = randomBytes(16).toString("hex");
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Create user immediately with INVITED status
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: nom,
                prenom,
                telephone,
                role: "EMPLOYEE",
                status: "INVITED", // User cannot login until they accept invitation
                entrepriseId: session.user.entrepriseId,
                poste: "Technicien",
                dateEmbauche: new Date(),
            },
        });

        // Create default permissions for this user
        const defaultPerms = getDefaultPermissions("EMPLOYEE");
        await prisma.userPermissions.create({
            data: {
                userId: user.id,
                ...defaultPerms,
            },
        });

        // If camionnetteId is provided, assign the user to this vehicle
        if (camionnetteId && camionnetteId !== "none") {
            await prisma.camionnette.update({
                where: { id: camionnetteId },
                data: { plombierPrincipalId: user.id },
            });
        }

        // Create invitation token (for activation link)
        await prisma.userInvitationToken.create({
            data: {
                token,
                email,
                name: nom,
                prenom,
                role: "EMPLOYEE",
                entrepriseId: session.user.entrepriseId,
                invitedBy: session.user.id,
                expiresAt,
            },
        });

        // Get entreprise info for the email
        const entreprise = await prisma.entreprise.findUnique({
            where: { id: session.user.entrepriseId },
            select: { nom: true },
        });

        // Build invitation URL
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const invitationUrl = `${baseUrl}/accept-invitation?token=${token}`;

        // TODO: Send invitation email with invitationUrl
        console.log(`[Technicien Created]
            User ID: ${user.id}
            Email: ${email}
            Name: ${prenom} ${nom}
            Phone: ${telephone}
            Status: INVITED (pending activation)
            Entreprise: ${entreprise?.nom}
            Invitation URL: ${invitationUrl}
        `);

        return NextResponse.json({
            success: true,
            message: "Technicien ajouté - En attente d'activation",
            user: {
                id: user.id,
                email,
                prenom,
                nom,
                telephone,
                status: "INVITED",
                invitationUrl, // In production, don't return this - just for testing
                expiresAt,
            },
        }, { status: 201 });

    } catch (error) {
        console.error("[Create Technicien] Error:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création du technicien" },
            { status: 500 }
        );
    }
}

/**
 * GET /api/team/technicien
 * List all technicians including those with INVITED status
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        // Get all employees including INVITED ones
        const techniciens = await prisma.user.findMany({
            where: {
                entrepriseId: session.user.entrepriseId,
                role: { in: ["EMPLOYEE", "ADMIN"] },
                status: { in: ["ACTIVE", "INVITED"] }, // Include both active and invited
            },
            select: {
                id: true,
                email: true,
                name: true,
                prenom: true,
                telephone: true,
                photoUrl: true,
                poste: true,
                status: true,
                dateEmbauche: true,
                createdAt: true,
                camionnettes: {
                    where: { actif: true },
                    select: {
                        id: true,
                        nom: true,
                        immatriculation: true,
                    },
                },
                _count: {
                    select: {
                        interventionsPlombier: {
                            where: {
                                statut: { notIn: ["TERMINEE", "FACTUREE", "ANNULEE"] },
                            },
                        },
                    },
                },
            },
            orderBy: [
                { status: "asc" }, // ACTIVE first, then INVITED
                { prenom: "asc" },
                { name: "asc" },
            ],
        });

        return NextResponse.json({
            techniciens: techniciens.map(t => ({
                id: t.id,
                email: t.email,
                nom: t.name,
                prenom: t.prenom,
                telephone: t.telephone,
                photoUrl: t.photoUrl,
                poste: t.poste,
                status: t.status,
                isActive: t.status === "ACTIVE",
                isPending: t.status === "INVITED",
                dateEmbauche: t.dateEmbauche,
                createdAt: t.createdAt,
                camionnette: t.camionnettes[0] || null,
                interventionsEnCours: t._count.interventionsPlombier,
            })),
        });

    } catch (error) {
        console.error("[Get Techniciens] Error:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des techniciens" },
            { status: 500 }
        );
    }
}
