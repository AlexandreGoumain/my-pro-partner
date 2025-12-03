import { authOptions } from "@/lib/auth";
import {
    StatutAffaire,
    DomaineJuridique,
    Juridiction,
    QualitePartie,
    TypeProcedure,
    TypeHonoraires,
} from "@/lib/generated/prisma";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import type { AffaireUpdateInput } from "@/lib/types/juridique";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{ id: string }>;
};

// GET /api/affaires/[id] - Get single affaire with all details
export async function GET(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;

        const affaire = await prisma.affaire.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                        adresse: true,
                        ville: true,
                    },
                },
                parties: {
                    orderBy: { createdAt: "asc" },
                },
                echeances: {
                    orderBy: { dateEcheance: "asc" },
                },
                diligences: {
                    orderBy: { date: "desc" },
                    take: 20,
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        parties: true,
                        echeances: true,
                        diligences: true,
                    },
                },
            },
        });

        if (!affaire) {
            return NextResponse.json(
                { error: "Affaire introuvable" },
                { status: 404 }
            );
        }

        // Calculate totals
        const totalDiligences = await prisma.diligence.aggregate({
            where: {
                affaireId: id,
                entrepriseId: session.user.entrepriseId,
            },
            _sum: {
                duree: true,
                montant: true,
            },
        });

        // Get next upcoming echeance
        const prochainEcheance = await prisma.echeanceProcedurale.findFirst({
            where: {
                affaireId: id,
                entrepriseId: session.user.entrepriseId,
                dateEcheance: { gte: new Date() },
                statut: { in: ["A_VENIR", "EN_PREPARATION"] },
            },
            orderBy: { dateEcheance: "asc" },
        });

        // Convert Decimal fields
        const formattedAffaire = {
            ...affaire,
            tauxHoraire: affaire.tauxHoraire
                ? Number(affaire.tauxHoraire)
                : null,
            montantForfait: affaire.montantForfait
                ? Number(affaire.montantForfait)
                : null,
            provision: affaire.provision ? Number(affaire.provision) : null,
            montantAJ: affaire.montantAJ ? Number(affaire.montantAJ) : null,
            enjeuFinancier: affaire.enjeuFinancier
                ? Number(affaire.enjeuFinancier)
                : null,
            diligences: affaire.diligences.map((d) => ({
                ...d,
                tauxHoraire: Number(d.tauxHoraire),
                montant: Number(d.montant),
            })),
            totalDiligences: totalDiligences._sum.duree || 0,
            totalHonoraires: totalDiligences._sum.montant
                ? Number(totalDiligences._sum.montant)
                : 0,
            prochainEcheance,
        };

        return NextResponse.json({ affaire: formattedAffaire });
    } catch (error) {
        console.error("Error fetching affaire:", error);
        return NextResponse.json(
            { error: "Failed to fetch affaire" },
            { status: 500 }
        );
    }
}

// PUT /api/affaires/[id] - Update affaire
export async function PUT(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;
        const body: AffaireUpdateInput = await request.json();

        // Verify affaire exists and belongs to enterprise
        const existing = await prisma.affaire.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Affaire introuvable" },
                { status: 404 }
            );
        }

        // If client is being changed, verify it belongs to enterprise
        if (body.clientId && body.clientId !== existing.clientId) {
            const client = await prisma.client.findFirst({
                where: {
                    id: body.clientId,
                    entrepriseId: session.user.entrepriseId,
                },
            });
            if (!client) {
                return NextResponse.json(
                    { error: "Client introuvable" },
                    { status: 404 }
                );
            }
        }

        // Update affaire
        const affaire = await prisma.affaire.update({
            where: { id },
            data: {
                ...(body.intitule !== undefined && {
                    intitule: body.intitule.trim(),
                }),
                ...(body.description !== undefined && {
                    description: body.description?.trim() || null,
                }),
                ...(body.clientId !== undefined && { clientId: body.clientId }),
                ...(body.qualiteClient !== undefined && {
                    qualiteClient: body.qualiteClient as QualitePartie,
                }),
                ...(body.domaine !== undefined && {
                    domaine: body.domaine as DomaineJuridique,
                }),
                ...(body.typeProcedure !== undefined && {
                    typeProcedure: body.typeProcedure as TypeProcedure,
                }),
                ...(body.juridiction !== undefined && {
                    juridiction: body.juridiction as Juridiction,
                }),
                ...(body.chambre !== undefined && { chambre: body.chambre }),
                ...(body.numeroRG !== undefined && { numeroRG: body.numeroRG }),
                ...(body.numeroParquet !== undefined && {
                    numeroParquet: body.numeroParquet,
                }),
                ...(body.dateFaits !== undefined && {
                    dateFaits: body.dateFaits ? new Date(body.dateFaits) : null,
                }),
                ...(body.dateCloture !== undefined && {
                    dateCloture: body.dateCloture
                        ? new Date(body.dateCloture)
                        : null,
                }),
                ...(body.typeHonoraires !== undefined && {
                    typeHonoraires: body.typeHonoraires as TypeHonoraires,
                }),
                ...(body.tauxHoraire !== undefined && {
                    tauxHoraire: body.tauxHoraire,
                }),
                ...(body.montantForfait !== undefined && {
                    montantForfait: body.montantForfait,
                }),
                ...(body.provision !== undefined && {
                    provision: body.provision,
                }),
                ...(body.montantAJ !== undefined && {
                    montantAJ: body.montantAJ,
                }),
                ...(body.enjeuFinancier !== undefined && {
                    enjeuFinancier: body.enjeuFinancier,
                }),
                ...(body.statut !== undefined && {
                    statut: body.statut as StatutAffaire,
                }),
                ...(body.responsableId !== undefined && {
                    responsableId: body.responsableId,
                }),
                ...(body.conflitVerifie !== undefined && {
                    conflitVerifie: body.conflitVerifie,
                    dateVerifConflit: body.conflitVerifie ? new Date() : null,
                }),
            },
            include: {
                client: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        email: true,
                        telephone: true,
                    },
                },
            },
        });

        // Convert Decimal fields
        const formattedAffaire = {
            ...affaire,
            tauxHoraire: affaire.tauxHoraire
                ? Number(affaire.tauxHoraire)
                : null,
            montantForfait: affaire.montantForfait
                ? Number(affaire.montantForfait)
                : null,
            provision: affaire.provision ? Number(affaire.provision) : null,
            montantAJ: affaire.montantAJ ? Number(affaire.montantAJ) : null,
            enjeuFinancier: affaire.enjeuFinancier
                ? Number(affaire.enjeuFinancier)
                : null,
        };

        return NextResponse.json({ affaire: formattedAffaire });
    } catch (error) {
        console.error("Error updating affaire:", error);
        return NextResponse.json(
            { error: "Failed to update affaire" },
            { status: 500 }
        );
    }
}

// DELETE /api/affaires/[id] - Delete affaire
export async function DELETE(request: NextRequest, context: RouteContext) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireCapability("projets");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await context.params;

        // Verify affaire exists and belongs to enterprise
        const existing = await prisma.affaire.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Affaire introuvable" },
                { status: 404 }
            );
        }

        // Delete affaire (cascades to parties, echeances, diligences)
        await prisma.affaire.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting affaire:", error);
        return NextResponse.json(
            { error: "Failed to delete affaire" },
            { status: 500 }
        );
    }
}
