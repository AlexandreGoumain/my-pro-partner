/**
 * Health Check Endpoint
 *
 * Used for:
 * - Kubernetes liveness/readiness probes
 * - Load balancer health checks
 * - Monitoring systems
 *
 * GET /api/health - Basic health check
 * GET /api/health?detailed=true - Detailed health with component status
 */

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface HealthStatus {
    status: "healthy" | "degraded" | "unhealthy";
    timestamp: string;
    version: string;
    uptime: number;
    components?: {
        database: ComponentStatus;
        cache?: ComponentStatus;
    };
}

interface ComponentStatus {
    status: "up" | "down" | "degraded";
    latency?: number;
    message?: string;
}

const startTime = Date.now();

async function checkDatabase(): Promise<ComponentStatus> {
    const start = Date.now();
    try {
        // Simple query to check database connectivity
        await prisma.$queryRaw`SELECT 1`;
        return {
            status: "up",
            latency: Date.now() - start,
        };
    } catch (error) {
        return {
            status: "down",
            latency: Date.now() - start,
            message:
                error instanceof Error
                    ? error.message
                    : "Database connection failed",
        };
    }
}

export async function GET(
    request: NextRequest
): Promise<NextResponse<HealthStatus>> {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get("detailed") === "true";

    const health: HealthStatus = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "0.1.0",
        uptime: Math.floor((Date.now() - startTime) / 1000),
    };

    if (detailed) {
        const dbStatus = await checkDatabase();

        health.components = {
            database: dbStatus,
        };

        // Determine overall status based on components
        if (dbStatus.status === "down") {
            health.status = "unhealthy";
        } else if (dbStatus.status === "degraded") {
            health.status = "degraded";
        }
    }

    const statusCode =
        health.status === "healthy"
            ? 200
            : health.status === "degraded"
              ? 200
              : 503;

    return NextResponse.json(health, { status: statusCode });
}
