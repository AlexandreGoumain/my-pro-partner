import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/business-type
 * Returns the current user's business type
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user with entreprise
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        entreprise: {
          select: {
            businessType: true,
          },
        },
      },
    });

    if (!user || !user.entreprise) {
      return NextResponse.json(
        { error: "User or entreprise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      businessType: user.entreprise.businessType,
    });
  } catch (error) {
    console.error("Error fetching business type:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
