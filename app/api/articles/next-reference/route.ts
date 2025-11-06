import { prisma } from "@/lib/prisma";
import {
    handleTenantError,
    requireTenantAuth,
} from "@/lib/middleware/tenant-isolation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { entrepriseId } = await requireTenantAuth();

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") as "PRODUIT" | "SERVICE" | null;

        if (!type || (type !== "PRODUIT" && type !== "SERVICE")) {
            return NextResponse.json(
                { message: "Type invalide. Utilisez PRODUIT ou SERVICE." },
                { status: 400 }
            );
        }

        // Récupérer les paramètres de l'entreprise
        const parametres = await prisma.parametresEntreprise.findUnique({
            where: { entrepriseId },
            select: {
                prefixe_produit: true,
                prefixe_service: true,
                prochain_numero_produit: true,
                prochain_numero_service: true,
            },
        });

        if (!parametres) {
            return NextResponse.json(
                { message: "Paramètres introuvables" },
                { status: 404 }
            );
        }

        // Générer la référence selon le type
        const prefix = type === "PRODUIT"
            ? parametres.prefixe_produit
            : parametres.prefixe_service;

        const numero = type === "PRODUIT"
            ? parametres.prochain_numero_produit
            : parametres.prochain_numero_service;

        const reference = `${prefix}-${String(numero).padStart(3, "0")}`;

        return NextResponse.json({ reference, type });
    } catch (error) {
        return handleTenantError(error);
    }
}
