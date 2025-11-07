import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth } from "@/lib/middleware/client-auth";
import { NotificationService } from "@/lib/services/notification.service";

/**
 * PATCH /api/client/notifications/[id]
 * Mark a specific notification as read
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { client } = await requireClientAuth(req);
        const { id: notificationId } = await params;

        await NotificationService.markAsRead(notificationId, client.id);

        return NextResponse.json({
            message: "Notification marquée comme lue",
        });
    } catch (error) {
        console.error("[Client Notification API] Error:", error);
        return NextResponse.json(
            { message: "Erreur lors de la mise à jour de la notification" },
            { status: 500 }
        );
    }
}
