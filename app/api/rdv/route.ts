import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/rdv
 * List all rendez-vous for the entreprise
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const searchParams = request.nextUrl.searchParams;
        const params = getPaginationParams(searchParams);
        const search = searchParams.get("search") || "";
        const statut = searchParams.get("statut");
        const employeId = searchParams.get("employeId");
        const clientId = searchParams.get("clientId");
        const prestationId = searchParams.get("prestationId");
        const dateDebut = searchParams.get("dateDebut");
        const dateFin = searchParams.get("dateFin");

        // Build where clause
        const where: Record<string, unknown> = {
            entrepriseId: session.user.entrepriseId,
        };

        if (search) {
            where.OR = [
                { nomClient: { contains: search, mode: "insensitive" } },
                { telephone: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { notes: { contains: search, mode: "insensitive" } },
            ];
        }

        if (statut) {
            where.statut = statut;
        }

        if (employeId) {
            where.employeId = employeId;
        }

        if (clientId) {
            where.clientId = clientId;
        }

        if (prestationId) {
            where.prestationId = prestationId;
        }

        if (dateDebut || dateFin) {
            where.date = {};
            if (dateDebut) {
                (where.date as Record<string, Date>).gte = new Date(dateDebut);
            }
            if (dateFin) {
                (where.date as Record<string, Date>).lte = new Date(dateFin);
            }
        }

        // Get total count
        const total = await prisma.rendezVous.count({ where });

        // Get items with pagination
        const items = await prisma.rendezVous.findMany({
            where,
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                    },
                },
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
                        couleur: true,
                    },
                },
            },
            orderBy: [{ date: "asc" }, { heure: "asc" }],
            skip: params.skip,
            take: params.limit,
        });

        return NextResponse.json(
            createPaginatedResponse(
                items.map((item) => ({
                    ...item,
                    prestation: item.prestation
                        ? {
                              ...item.prestation,
                              prix: Number(item.prestation.prix),
                          }
                        : null,
                })),
                total,
                params
            )
        );
    } catch (error) {
        console.error("Error fetching rendez-vous:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/rdv
 * Create a new rendez-vous
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("agenda");
        if (capabilityCheck) return capabilityCheck;

        const body = await request.json();
        const {
            clientId,
            nomClient,
            telephone,
            email,
            date,
            heure,
            duree,
            prestationId,
            employeId,
            notes,
            statut,
        } = body;

        // Validation
        if (!nomClient || nomClient.trim() === "") {
            return NextResponse.json(
                { error: "Le nom du client est requis" },
                { status: 400 }
            );
        }

        if (!date) {
            return NextResponse.json(
                { error: "La date est requise" },
                { status: 400 }
            );
        }

        if (!heure) {
            return NextResponse.json(
                { error: "L'heure est requise" },
                { status: 400 }
            );
        }

        // Validate time format
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(heure)) {
            return NextResponse.json(
                { error: "Format d'heure invalide (HH:MM)" },
                { status: 400 }
            );
        }

        // Get duration from prestation if not provided
        let finalDuree = duree;
        if (!finalDuree && prestationId) {
            const prestation = await prisma.prestation.findUnique({
                where: { id: prestationId },
                select: { duree: true },
            });
            if (prestation) {
                finalDuree = prestation.duree;
            }
        }

        if (!finalDuree || finalDuree <= 0) {
            return NextResponse.json(
                { error: "La durée est requise" },
                { status: 400 }
            );
        }

        // Verify employee exists if provided
        if (employeId) {
            const employee = await prisma.employe.findFirst({
                where: {
                    id: employeId,
                    entrepriseId: session.user.entrepriseId,
                    actif: true,
                },
            });
            if (!employee) {
                return NextResponse.json(
                    { error: "Employé non trouvé ou inactif" },
                    { status: 400 }
                );
            }
        }

        // Verify prestation exists if provided
        if (prestationId) {
            const prestation = await prisma.prestation.findFirst({
                where: {
                    id: prestationId,
                    entrepriseId: session.user.entrepriseId,
                    actif: true,
                },
            });
            if (!prestation) {
                return NextResponse.json(
                    { error: "Prestation non trouvée ou inactive" },
                    { status: 400 }
                );
            }
        }

        // Verify client exists if provided
        if (clientId) {
            const client = await prisma.client.findFirst({
                where: {
                    id: clientId,
                    entrepriseId: session.user.entrepriseId,
                },
            });
            if (!client) {
                return NextResponse.json(
                    { error: "Client non trouvé" },
                    { status: 400 }
                );
            }
        }

        // Create rendez-vous
        const item = await prisma.rendezVous.create({
            data: {
                entrepriseId: session.user.entrepriseId,
                clientId: clientId || null,
                nomClient: nomClient.trim(),
                telephone: telephone?.trim() || null,
                email: email?.trim() || null,
                date: new Date(date),
                heure,
                duree: finalDuree,
                prestationId: prestationId || null,
                employeId: employeId || null,
                notes: notes?.trim() || null,
                statut: statut || "EN_ATTENTE",
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                    },
                },
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
                        couleur: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                ...item,
                prestation: item.prestation
                    ? {
                          ...item.prestation,
                          prix: Number(item.prestation.prix),
                      }
                    : null,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating rendez-vous:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
