import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/errors";

export async function DELETE() {
    return withErrorHandling(
        async () => {
            if (process.env.NODE_ENV !== "development") {
                return NextResponse.json(
                    { message: "Cette action est uniquement disponible en développement" },
                    { status: 403 }
                );
            }

            // This deletes ALL enterprises (not tenant-scoped)
            const result = await prisma.entreprise.deleteMany({});

            return NextResponse.json({
                message: `${result.count} entreprise${result.count > 1 ? "s" : ""} supprimée${result.count > 1 ? "s" : ""}`,
                deleted: result.count,
            });
        },
        { resourceName: "Entreprises", operation: "delete-all" }
    );
}
