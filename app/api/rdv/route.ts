import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ValidationError } from "@/lib/errors";
import {
    createPaginatedResponse,
    getPaginationParams,
} from "@/lib/utils/pagination";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Includes communs pour les rendez-vous
const rdvInclude = {
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
} as const;

// Helper pour formater le rendez-vous (conversion Decimal -> Number)
function formatRdv(item: Record<string, unknown>) {
    const prestation = item.prestation as Record<string, unknown> | null;
    return {
        ...item,
        prestation: prestation
            ? { ...prestation, prix: Number(prestation.prix) }
            : null,
    };
}

// Schema de validation pour la création
const rdvCreateSchema = z.object({
    clientId: z.string().optional(),
    nomClient: z.string().min(1, "Le nom du client est requis"),
    telephone: z.string().optional(),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    date: z.string().min(1, "La date est requise"),
    heure: z.string().regex(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Format d'heure invalide (HH:MM)"
    ),
    duree: z.number().int().positive().optional(),
    prestationId: z.string().optional(),
    employeId: z.string().optional(),
    notes: z.string().optional(),
    statut: z.enum(["EN_ATTENTE", "CONFIRME", "EN_COURS", "TERMINE", "ANNULE"]).optional(),
});

/**
 * GET /api/rdv
 * List all rendez-vous for the entreprise
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
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
                entrepriseId: ctx.entrepriseId,
            };

            if (search) {
                where.OR = [
                    { nomClient: { contains: search, mode: "insensitive" } },
                    { telephone: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { notes: { contains: search, mode: "insensitive" } },
                ];
            }

            if (statut) where.statut = statut;
            if (employeId) where.employeId = employeId;
            if (clientId) where.clientId = clientId;
            if (prestationId) where.prestationId = prestationId;

            if (dateDebut || dateFin) {
                where.date = {};
                if (dateDebut) {
                    (where.date as Record<string, Date>).gte = new Date(dateDebut);
                }
                if (dateFin) {
                    (where.date as Record<string, Date>).lte = new Date(dateFin);
                }
            }

            const [items, total] = await Promise.all([
                prisma.rendezVous.findMany({
                    where,
                    include: rdvInclude,
                    orderBy: [{ date: "asc" }, { heure: "asc" }],
                    skip: params.skip,
                    take: params.limit,
                }),
                prisma.rendezVous.count({ where }),
            ]);

            return NextResponse.json(
                createPaginatedResponse(items.map(formatRdv), total, params)
            );
        },
        {
            capability: "agenda",
            context: { resourceName: "RendezVous", operation: "list" },
        }
    );
}

/**
 * POST /api/rdv
 * Create a new rendez-vous
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();
            const validation = rdvCreateSchema.safeParse(body);

            if (!validation.success) {
                throw new ValidationError(
                    "Données invalides",
                    validation.error.flatten().fieldErrors as Record<string, string[]>
                );
            }

            const data = validation.data;

            // Get duration from prestation if not provided
            let finalDuree = data.duree;
            if (!finalDuree && data.prestationId) {
                const prestation = await prisma.prestation.findUnique({
                    where: { id: data.prestationId },
                    select: { duree: true },
                });
                if (prestation) {
                    finalDuree = prestation.duree;
                }
            }

            if (!finalDuree || finalDuree <= 0) {
                throw new ValidationError("La durée est requise");
            }

            // Verify employee exists if provided
            if (data.employeId) {
                const employee = await prisma.employe.findFirst({
                    where: {
                        id: data.employeId,
                        entrepriseId: ctx.entrepriseId,
                        actif: true,
                    },
                });
                if (!employee) {
                    throw new NotFoundError("Employé non trouvé ou inactif");
                }
            }

            // Verify prestation exists if provided
            if (data.prestationId) {
                const prestation = await prisma.prestation.findFirst({
                    where: {
                        id: data.prestationId,
                        entrepriseId: ctx.entrepriseId,
                        actif: true,
                    },
                });
                if (!prestation) {
                    throw new NotFoundError("Prestation non trouvée ou inactive");
                }
            }

            // Verify client exists if provided
            if (data.clientId) {
                const client = await prisma.client.findFirst({
                    where: {
                        id: data.clientId,
                        entrepriseId: ctx.entrepriseId,
                    },
                });
                if (!client) {
                    throw new NotFoundError("Client non trouvé");
                }
            }

            // Create rendez-vous
            const item = await prisma.rendezVous.create({
                data: {
                    entrepriseId: ctx.entrepriseId,
                    clientId: data.clientId || null,
                    nomClient: data.nomClient.trim(),
                    telephone: data.telephone?.trim() || null,
                    email: data.email?.trim() || null,
                    date: new Date(data.date),
                    heure: data.heure,
                    duree: finalDuree,
                    prestationId: data.prestationId || null,
                    employeId: data.employeId || null,
                    notes: data.notes?.trim() || null,
                    statut: data.statut || "EN_ATTENTE",
                },
                include: rdvInclude,
            });

            return NextResponse.json(formatRdv(item), { status: 201 });
        },
        {
            capability: "agenda",
            context: { resourceName: "RendezVous", operation: "create" },
        }
    );
}
