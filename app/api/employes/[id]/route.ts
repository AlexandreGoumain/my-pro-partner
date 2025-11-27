import { authOptions } from "@/lib/auth";
import { requireCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
    params: Promise<{ id: string }>;
}

/**
 * GET /api/employes/[id]
 * Get a single employee
 */
export async function GET(request: NextRequest, context: RouteContext) {
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

        const { id } = await context.params;

        const item = await prisma.employe.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                disponibilites: {
                    orderBy: { jourSemaine: "asc" },
                },
            },
        });

        if (!item) {
            return NextResponse.json(
                { error: "Employé non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json(item);
    } catch (error) {
        console.error("Error fetching employee:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/employes/[id]
 * Update an employee
 */
export async function PUT(request: NextRequest, context: RouteContext) {
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

        const { id } = await context.params;
        const body = await request.json();

        // Check item exists and belongs to entreprise
        const existing = await prisma.employe.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Employé non trouvé" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: Record<string, unknown> = {};

        if (body.nom !== undefined) {
            if (!body.nom || body.nom.trim() === "") {
                return NextResponse.json(
                    { error: "Le nom est requis" },
                    { status: 400 }
                );
            }
            updateData.nom = body.nom.trim();
        }

        if (body.prenom !== undefined) {
            if (!body.prenom || body.prenom.trim() === "") {
                return NextResponse.json(
                    { error: "Le prénom est requis" },
                    { status: 400 }
                );
            }
            updateData.prenom = body.prenom.trim();
        }

        if (body.email !== undefined) {
            updateData.email = body.email?.trim() || null;
        }

        if (body.telephone !== undefined) {
            updateData.telephone = body.telephone?.trim() || null;
        }

        if (body.couleur !== undefined) {
            updateData.couleur = body.couleur || null;
        }

        if (body.actif !== undefined) {
            updateData.actif = body.actif;
        }

        // Update
        const item = await prisma.employe.update({
            where: { id },
            data: updateData,
            include: {
                disponibilites: {
                    orderBy: { jourSemaine: "asc" },
                },
            },
        });

        return NextResponse.json(item);
    } catch (error) {
        console.error("Error updating employee:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/employes/[id]
 * Delete an employee
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
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

        const { id } = await context.params;

        // Check item exists and belongs to entreprise
        const existing = await prisma.employe.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Employé non trouvé" },
                { status: 404 }
            );
        }

        // Check if employee has future rendez-vous
        const futureRdv = await prisma.rendezVous.count({
            where: {
                employeId: id,
                date: { gte: new Date() },
                statut: { notIn: ["ANNULE", "NO_SHOW"] },
            },
        });

        if (futureRdv > 0) {
            return NextResponse.json(
                {
                    error: "Cet employé a des rendez-vous à venir et ne peut pas être supprimé",
                },
                { status: 400 }
            );
        }

        // Delete (cascade will delete disponibilites)
        await prisma.employe.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting employee:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
