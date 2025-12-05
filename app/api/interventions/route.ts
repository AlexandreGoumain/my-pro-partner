import { withApiHandler } from "@/lib/api/api-handler";
import { prisma } from "@/lib/prisma";
import { ValidationError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/interventions
 * List interventions with filters
 */
export async function GET(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const searchParams = request.nextUrl.searchParams;
            const statut = searchParams.get("statut");
            const priorite = searchParams.get("priorite");
            const type = searchParams.get("type");
            const search = searchParams.get("search");

            const where: Record<string, unknown> = {
                entrepriseId: ctx.entrepriseId,
            };

            if (statut && statut !== "ALL") {
                where.statut = statut;
            }

            if (priorite && priorite !== "ALL") {
                where.priorite = priorite;
            }

            if (type && type !== "ALL") {
                where.typeIntervention = type;
            }

            if (search) {
                where.OR = [
                    { numero: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                    { ville: { contains: search, mode: "insensitive" } },
                    { client: { nom: { contains: search, mode: "insensitive" } } },
                ];
            }

            const interventions = await prisma.intervention.findMany({
                where,
                include: {
                    client: {
                        select: {
                            nom: true,
                            prenom: true,
                            telephone: true,
                        },
                    },
                    plombier: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: [{ priorite: "desc" }, { dateDemande: "desc" }],
                take: 100,
            });

            return NextResponse.json({ interventions });
        },
        {
            anyCapability: ["domicile", "atelier"],
            context: { resourceName: "Intervention", operation: "list" },
        }
    );
}

/**
 * POST /api/interventions
 * Create new intervention
 */
export async function POST(request: NextRequest) {
    return withApiHandler(
        async (ctx) => {
            const body = await request.json();

            let clientId = body.clientId;

            // If newClient is provided, create the client first
            if (body.newClient && !clientId) {
                const { nom, prenom, telephone } = body.newClient;

                if (!nom || !telephone) {
                    throw new ValidationError(
                        "Nom et téléphone requis pour un nouveau client"
                    );
                }

                const newClient = await prisma.client.create({
                    data: {
                        entrepriseId: ctx.entrepriseId,
                        nom,
                        prenom: prenom || null,
                        telephone,
                        adresse: body.adresse,
                        codePostal: body.codePostal,
                        ville: body.ville,
                    },
                });

                clientId = newClient.id;
            }

            if (!clientId) {
                throw new ValidationError("Client requis");
            }

            // Get next numero
            const lastIntervention = await prisma.intervention.findFirst({
                where: { entrepriseId: ctx.entrepriseId },
                orderBy: { createdAt: "desc" },
                select: { numero: true },
            });

            let nextNumber = 1;
            if (lastIntervention) {
                const match = lastIntervention.numero.match(/INT-(\d+)/);
                if (match) {
                    nextNumber = parseInt(match[1]) + 1;
                }
            }

            const numero = `INT-${nextNumber.toString().padStart(3, "0")}`;

            const intervention = await prisma.intervention.create({
                data: {
                    numero,
                    entrepriseId: ctx.entrepriseId,
                    clientId,
                    typeIntervention: body.typeIntervention,
                    priorite: body.priorite || "NORMALE",
                    description: body.description,
                    adresse: body.adresse,
                    codePostal: body.codePostal,
                    ville: body.ville,
                    complementAdresse: body.complementAdresse,
                    latitude: body.latitude,
                    longitude: body.longitude,
                    equipement: body.equipement,
                    marqueEquipement: body.marqueEquipement,
                    modeleEquipement: body.modeleEquipement,
                    anneeInstall: body.anneeInstall,
                    datePrevisionnelle: body.datePrevisionnelle,
                    plombierId: body.plombierId,
                    camionnetteId: body.camionnetteId,
                    statut: "DEMANDE",
                    createdBy: ctx.userId,
                },
                include: {
                    client: true,
                    plombier: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            // Create history log
            await prisma.interventionHistorique.create({
                data: {
                    interventionId: intervention.id,
                    action: "CREATE",
                    description: `Intervention ${numero} créée`,
                    createdBy: ctx.userId,
                },
            });

            return NextResponse.json({ intervention }, { status: 201 });
        },
        {
            anyCapability: ["domicile", "atelier"],
            context: { resourceName: "Intervention", operation: "create" },
        }
    );
}
