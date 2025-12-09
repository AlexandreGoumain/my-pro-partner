import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/middleware/tenant-isolation";
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

            const { entrepriseId } = await requireAdmin();

            // Delete time entries
            const timeEntriesResult = await prisma.timeEntry.deleteMany({
                where: { user: { entrepriseId } },
            });

            // Delete user schedules
            const schedulesResult = await prisma.userSchedule.deleteMany({
                where: { user: { entrepriseId } },
            });

            const total = timeEntriesResult.count + schedulesResult.count;

            return NextResponse.json({
                message: `${timeEntriesResult.count} pointage${timeEntriesResult.count > 1 ? "s" : ""} et ${schedulesResult.count} horaire${schedulesResult.count > 1 ? "s" : ""} supprimé${total > 1 ? "s" : ""}`,
                deleted: total,
            });
        },
        { resourceName: "Horaires", operation: "delete-all" }
    );
}
