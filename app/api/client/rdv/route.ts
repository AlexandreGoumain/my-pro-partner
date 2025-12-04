import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth, handleClientAuthError } from "@/lib/middleware/client-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

/**
 * GET /api/client/rdv
 * List all appointments for the authenticated client
 */
export async function GET(req: NextRequest) {
    try {
        const { client, entrepriseId } = await requireClientAuth(req);

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const upcoming = searchParams.get("upcoming") === "true";

        // Build where clause
        const where: Record<string, unknown> = {
            clientId: client.id,
            entrepriseId,
        };

        // Filter by status if provided
        if (status) {
            where.statut = status;
        }

        // Filter for upcoming appointments only
        if (upcoming) {
            where.date = {
                gte: new Date(),
            };
            where.statut = {
                notIn: ["ANNULE", "NO_SHOW", "TERMINE"],
            };
        }

        const rendezVous = await prisma.rendezVous.findMany({
            where,
            include: {
                prestation: {
                    select: {
                        id: true,
                        nom: true,
                        duree: true,
                        prix: true,
                        categorie: true,
                    },
                },
                employe: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        couleur: true,
                    },
                },
            },
            orderBy: [
                { date: "asc" },
                { heure: "asc" },
            ],
        });

        return NextResponse.json({ rendezVous });
    } catch (error) {
        return handleClientAuthError(error);
    }
}

// Schema for creating a new appointment
const createRdvSchema = z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Date invalide",
    }),
    heure: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Format d'heure invalide (HH:MM)",
    }),
    prestationId: z.string().min(1, "Prestation requise"),
    employeId: z.string().optional(),
    notes: z.string().optional(),
});

/**
 * POST /api/client/rdv
 * Create a new appointment
 */
export async function POST(req: NextRequest) {
    try {
        const { client, entrepriseId } = await requireClientAuth(req);
        const body = await req.json();

        // Validate input
        const validation = createRdvSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { date, heure, prestationId, employeId, notes } = validation.data;

        // Get prestation to know duration
        const prestation = await prisma.prestation.findFirst({
            where: {
                id: prestationId,
                entrepriseId,
                actif: true,
            },
        });

        if (!prestation) {
            return NextResponse.json(
                { error: "Prestation non trouvée ou inactive" },
                { status: 404 }
            );
        }

        // Validate employee if provided
        if (employeId) {
            const employe = await prisma.employe.findFirst({
                where: {
                    id: employeId,
                    entrepriseId,
                    actif: true,
                },
            });

            if (!employe) {
                return NextResponse.json(
                    { error: "Employé non trouvé ou inactif" },
                    { status: 404 }
                );
            }
        }

        // Check if the slot is still available
        const rdvDate = new Date(date);
        const existingRdv = await prisma.rendezVous.findFirst({
            where: {
                entrepriseId,
                date: rdvDate,
                heure,
                statut: {
                    notIn: ["ANNULE", "NO_SHOW"],
                },
                ...(employeId ? { employeId } : {}),
            },
        });

        if (existingRdv) {
            return NextResponse.json(
                { error: "Ce créneau n'est plus disponible" },
                { status: 409 }
            );
        }

        // Create the appointment
        const rendezVous = await prisma.rendezVous.create({
            data: {
                clientId: client.id,
                nomClient: `${client.nom} ${client.prenom || ""}`.trim(),
                telephone: client.telephone,
                email: client.email,
                date: rdvDate,
                heure,
                duree: prestation.duree,
                statut: "EN_ATTENTE",
                notes,
                prestationId,
                employeId: employeId || null,
                entrepriseId,
            },
            include: {
                prestation: {
                    select: {
                        id: true,
                        nom: true,
                        duree: true,
                        prix: true,
                    },
                },
                employe: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
            },
        });

        // TODO: Send notification to admin about new appointment

        return NextResponse.json({ rendezVous }, { status: 201 });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return handleClientAuthError(error);
    }
}
