import { withErrorHandling } from "@/lib/errors";
import { requireCapability } from "@/lib/middleware/business-type-check";
import {
    requireTenantAuth,
    verifyResourceAccess,
} from "@/lib/middleware/tenant-isolation";
import { prisma } from "@/lib/prisma";
import { reparationAssignSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

// POST: Assign repair to technician
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return withErrorHandling(
        async () => {
            // Check business type
            const capabilityCheck = await requireCapability("atelier");
            if (capabilityCheck) return capabilityCheck;

            const { user, entrepriseId } = await requireTenantAuth();
            const { id } = await params;

            // Verify ownership
            const { resource: reparation } = await verifyResourceAccess(
                id,
                (id) =>
                    prisma.reparation.findUnique({
                        where: { id },
                        include: {
                            technicien: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                },
                            },
                        },
                    }),
                "Reparation"
            );

            const body = await req.json();
            const result = reparationAssignSchema.safeParse(body);

            if (!result.success) {
                return NextResponse.json(
                    {
                        message: "Données invalides",
                        errors: result.error.flatten().fieldErrors,
                    },
                    { status: 400 }
                );
            }

            const { technicienId } = result.data;

            // Verify technician exists and belongs to same entreprise
            const technicien = await prisma.user.findUnique({
                where: { id: technicienId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    prenom: true,
                    entrepriseId: true,
                    role: true,
                },
            });

            if (!technicien) {
                return NextResponse.json(
                    { message: "Technicien introuvable" },
                    { status: 404 }
                );
            }

            if (technicien.entrepriseId !== entrepriseId) {
                return NextResponse.json(
                    { message: "Accès non autorisé" },
                    { status: 403 }
                );
            }

            // Check if technician has appropriate role
            if (
                !["OWNER", "ADMIN", "MANAGER", "EMPLOYEE"].includes(
                    technicien.role
                )
            ) {
                return NextResponse.json(
                    {
                        message:
                            "Cet utilisateur ne peut pas être assigné comme technicien",
                    },
                    { status: 400 }
                );
            }

            // Update repair
            const updatedReparation = await prisma.reparation.update({
                where: { id },
                data: {
                    technicienId,
                },
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
                },
            });

            // Create history entry
            const oldTechnicienName = reparation.technicien?.name || "Aucun";
            const newTechnicienName = technicien.name || technicien.email;

            await prisma.reparationHistorique.create({
                data: {
                    reparationId: id,
                    action: "ASSIGNED",
                    description: `Technicien assigné : ${oldTechnicienName} → ${newTechnicienName}`,
                    metadata: {
                        oldTechnicienId: reparation.technicienId,
                        newTechnicienId: technicienId,
                        oldTechnicienName,
                        newTechnicienName,
                    },
                    createdBy: user.id,
                },
            });

            return NextResponse.json(updatedReparation);
        },
        { resourceName: "Reparation", operation: "assign" }
    );
}
