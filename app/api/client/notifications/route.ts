import { NextRequest, NextResponse } from "next/server";
import { requireClientAuth } from "@/lib/middleware/client-auth";
import { NotificationService } from "@/lib/services/notification.service";

/**
 * GET /api/client/notifications
 * Get all notifications for the authenticated client
 */
export async function GET(req: NextRequest) {
    try {
        const { client } = await requireClientAuth(req);

        const [notifications, unreadCount] = await Promise.all([
            NotificationService.getClientNotifications(client.id),
            NotificationService.getUnreadCount(client.id),
        ]);

        return NextResponse.json({
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("[Client Notifications API] Error:", error);
        return NextResponse.json(
            { message: "Erreur lors de la récupération des notifications" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/client/notifications
 * Mark all notifications as read
 */
export async function POST(req: NextRequest) {
    try {
        const { client } = await requireClientAuth(req);

        await NotificationService.markAllAsRead(client.id);

        return NextResponse.json({
            message: "Toutes les notifications ont été marquées comme lues",
        });
    } catch (error) {
        console.error("[Client Notifications API] Error:", error);
        return NextResponse.json(
            { message: "Erreur lors de la mise à jour des notifications" },
            { status: 500 }
        );
    }
}
