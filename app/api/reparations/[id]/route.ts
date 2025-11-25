import { withErrorHandling } from "@/lib/errors";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { verifyResourceAccess } from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { ReparationService } from "@/lib/services/reparation.service";
import { reparationUpdateSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

// GET: Get a specific repair by ID
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withErrorHandling(
        async () => {
            // Check business type
            const capabilityCheck = await requireCapability("atelier");
            if (capabilityCheck) return capabilityCheck;

            const { id } = await params;

            // Use verifyResourceAccess to check auth and ownership in one call
            const { resource: reparation } = await verifyResourceAccess(
                id,
                (id) =>
                    prisma.reparation.findUnique({
                        where: { id },
                        include: {
                            client: true,
                            technicien: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    prenom: true,
                                },
                            },
                            store: true,
                            register: true,
                            document: true,
                            lignesPieces: {
                                include: {
                                    article: true,
                                    ressourceAtelier: true,
                                },
                                orderBy: {
                                    createdAt: "desc",
                                },
                            },
                            interventions: {
                                include: {
                                    technicien: {
                                        select: {
                                            id: true,
                                            name: true,
                                            email: true,
                                            prenom: true,
                                        },
                                    },
                                },
                                orderBy: {
                                    dateDebut: "desc",
                                },
                            },
                            photos: {
                                orderBy: {
                                    ordre: "asc",
                                },
                            },
                            historique: {
                                orderBy: {
                                    createdAt: "desc",
                                },
                            },
                        },
                    }),
                "Reparation"
            );

            return NextResponse.json(reparation);
        },
        { resourceName: "Reparation", operation: "read" }
    );
}

// PUT: Update a repair
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withErrorHandling(
        async () => {
            // Check business type
            const capabilityCheck = await requireCapability("atelier");
            if (capabilityCheck) return capabilityCheck;

            const { id } = await params;

            // Verify ownership
            const { resource: reparation } = await verifyResourceAccess(
                id,
                (id) =>
                    prisma.reparation.findUnique({
                        where: { id },
                    }),
                "Reparation"
            );

            // Check if repair can be edited
            if (!ReparationService.canEdit(reparation.statut)) {
                return NextResponse.json(
                    { message: "Cette réparation ne peut plus être modifiée" },
                    { status: 400 }
                );
            }

            const body = await req.json();
            const result = reparationUpdateSchema.safeParse(body);

            if (!result.success) {
                return NextResponse.json(
                    {
                        message: "Données invalides",
                        errors: result.error.flatten().fieldErrors,
                    },
                    { status: 400 }
                );
            }

            const data = result.data;

            // Update repair
            const updatedReparation = await prisma.reparation.update({
                where: { id },
                data: {
                    typeAppareil: data.typeAppareil || reparation.typeAppareil,
                    marque:
                        data.marque !== undefined
                            ? data.marque || null
                            : reparation.marque,
                    modele:
                        data.modele !== undefined
                            ? data.modele || null
                            : reparation.modele,
                    numeroSerie:
                        data.numeroSerie !== undefined
                            ? data.numeroSerie || null
                            : reparation.numeroSerie,
                    motAuthentification:
                        data.motAuthentification !== undefined
                            ? data.motAuthentification || null
                            : reparation.motAuthentification,
                    panne: data.panne || reparation.panne,
                    etatVisuel:
                        data.etatVisuel !== undefined
                            ? data.etatVisuel || null
                            : reparation.etatVisuel,
                    accessoires:
                        data.accessoires !== undefined
                            ? data.accessoires || null
                            : reparation.accessoires,
                    priorite: data.priorite || reparation.priorite,
                    dateEstimeeRetour:
                        data.dateEstimeeRetour || reparation.dateEstimeeRetour,
                    notesInternes:
                        data.notesInternes !== undefined
                            ? data.notesInternes || null
                            : reparation.notesInternes,
                    notesTechnicien:
                        data.notesTechnicien !== undefined
                            ? data.notesTechnicien || null
                            : reparation.notesTechnicien,
                },
                include: {
                    client: true,
                    technicien: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    store: true,
                },
            });

            return NextResponse.json(updatedReparation);
        },
        { resourceName: "Reparation", operation: "update" }
    );
}

// DELETE: Delete a repair
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withErrorHandling(
        async () => {
            // Check business type
            const capabilityCheck = await requireCapability("atelier");
            if (capabilityCheck) return capabilityCheck;

            const { id } = await params;

            // Verify ownership
            const { resource: reparation } = await verifyResourceAccess(
                id,
                (id) =>
                    prisma.reparation.findUnique({
                        where: { id },
                        include: {
                            lignesPieces: true,
                            interventions: true,
                        },
                    }),
                "Reparation"
            );

            // Check if repair can be deleted
            if (!ReparationService.canDelete(reparation.statut)) {
                return NextResponse.json(
                    { message: "Cette réparation ne peut pas être supprimée" },
                    { status: 400 }
                );
            }

            // Check if linked to a document
            if (reparation.documentId) {
                return NextResponse.json(
                    {
                        message:
                            "Impossible de supprimer : cette réparation est liée à un document",
                    },
                    { status: 400 }
                );
            }

            // Delete repair (cascade will handle related records)
            await prisma.reparation.delete({
                where: { id },
            });

            return NextResponse.json(
                { message: "Réparation supprimée avec succès" },
                { status: 200 }
            );
        },
        { resourceName: "Reparation", operation: "delete" }
    );
}
