import { authOptions } from "@/lib/auth";
import { requireAnyCapability } from "@/lib/middleware/business-type-check";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/gestion-locative/baux/[id] - Get single bail with full details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("baux_locatifs");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        const bail = await prisma.bailLocatif.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                bien: {
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                        typeBien: true,
                        adresse: true,
                        codePostal: true,
                        ville: true,
                        surface: true,
                        photos: true,
                    },
                },
                locatairePrincipal: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                        adresse: true,
                        codePostal: true,
                        ville: true,
                    },
                },
                proprietaire: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                        telephone: true,
                        email: true,
                    },
                },
                loyers: {
                    orderBy: [{ annee: "desc" }, { mois: "desc" }],
                    take: 12,
                },
                _count: {
                    select: {
                        loyers: true,
                    },
                },
            },
        });

        if (!bail) {
            return NextResponse.json(
                { error: "Bail non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({ bail });
    } catch (error) {
        console.error("Error fetching bail:", error);
        return NextResponse.json(
            { error: "Failed to fetch bail" },
            { status: 500 }
        );
    }
}

// PATCH /api/gestion-locative/baux/[id] - Update bail
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("baux_locatifs");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;
        const body = await request.json();

        // Verify bail exists and belongs to entreprise
        const existing = await prisma.bailLocatif.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Bail non trouvé" },
                { status: 404 }
            );
        }

        // Build update data
        const updateData: any = {};

        if (body.statut) {
            updateData.statut = body.statut;

            // If bail is being terminated, update bien status
            if (body.statut === "TERMINE" || body.statut === "RESILIE") {
                await prisma.bienImmobilier.update({
                    where: { id: existing.bienId },
                    data: { statut: "DISPONIBLE" },
                });
            }
        }

        if (body.typeBail) updateData.typeBail = body.typeBail;
        if (body.loyerHC !== undefined) {
            updateData.loyerHC = body.loyerHC;
            updateData.loyerCC = body.loyerHC + (body.provisions ?? existing.provisions);
        }
        if (body.provisions !== undefined) {
            updateData.provisions = body.provisions;
            updateData.loyerCC = (body.loyerHC ?? existing.loyerHC) + body.provisions;
        }
        if (body.depotGarantie !== undefined) updateData.depotGarantie = body.depotGarantie;
        if (body.dateDebut) updateData.dateDebut = new Date(body.dateDebut);
        if (body.dateFin) updateData.dateFin = new Date(body.dateFin);
        if (body.dureeMois) updateData.dureeMois = body.dureeMois;
        if (body.indiceReference) updateData.indiceReference = body.indiceReference;
        if (body.dateRevision) updateData.dateRevision = new Date(body.dateRevision);
        if (body.clausesParticulieres !== undefined) {
            updateData.clausesParticulieres = body.clausesParticulieres;
        }
        if (body.datePreavis) {
            updateData.datePreavis = new Date(body.datePreavis);
            updateData.statut = "PREAVIS";
        }

        const bail = await prisma.bailLocatif.update({
            where: { id },
            data: updateData,
            include: {
                bien: {
                    select: {
                        id: true,
                        reference: true,
                        titre: true,
                    },
                },
                locatairePrincipal: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
                proprietaire: {
                    select: {
                        id: true,
                        nom: true,
                        prenom: true,
                    },
                },
            },
        });

        return NextResponse.json({ bail });
    } catch (error) {
        console.error("Error updating bail:", error);
        return NextResponse.json(
            { error: "Failed to update bail" },
            { status: 500 }
        );
    }
}

// DELETE /api/gestion-locative/baux/[id] - Delete bail
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.entrepriseId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const capabilityCheck = await requireAnyCapability("baux_locatifs");
        if (capabilityCheck) return capabilityCheck;

        const { id } = await params;

        // Verify bail exists and belongs to entreprise
        const existing = await prisma.bailLocatif.findFirst({
            where: {
                id,
                entrepriseId: session.user.entrepriseId,
            },
            include: {
                _count: {
                    select: {
                        loyers: true,
                    },
                },
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Bail non trouvé" },
                { status: 404 }
            );
        }

        // Check if bail has associated loyers
        if (existing._count.loyers > 0) {
            return NextResponse.json(
                { error: "Impossible de supprimer un bail avec des loyers associés" },
                { status: 400 }
            );
        }

        // Update bien status back to available
        await prisma.bienImmobilier.update({
            where: { id: existing.bienId },
            data: { statut: "DISPONIBLE" },
        });

        await prisma.bailLocatif.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting bail:", error);
        return NextResponse.json(
            { error: "Failed to delete bail" },
            { status: 500 }
        );
    }
}
