// goalkicklive/app/api/providers/health/route.ts
import { NextResponse } from "next/server";
import { providerManager } from "@/lib/services/provider-manager";

export async function GET() {
  try {
    console.log("🩺 Checking provider health...");

    const healthStatus = await providerManager.healthCheck();
    const stats = providerManager.getProviderStats();

    const response = {
      timestamp: new Date().toISOString(),
      status: "success",
      stats,
      providers: healthStatus,
      environment: {
        node_env: process.env.NODE_ENV,
        enable_supersport: process.env.ENABLE_SUPERSPORT,
        enable_scorebat: process.env.ENABLE_SCOREBAT,
        scorebat_token_available: !!process.env.SCOREBAT_API_TOKEN,
        supersport_api_available: !!process.env.SUPERSPORT_API_BASE_URL,
      },
      recommendations: Object.entries(healthStatus)
        .filter(([, status]) => status.status !== "healthy")
        .map(([provider, status]) => ({
          provider,
          issue: status.message,
          action:
            provider === "scorebat" && !process.env.SCOREBAT_API_TOKEN
              ? "Set SCOREBAT_API_TOKEN environment variable"
              : "Check provider configuration and API availability",
        })),
    };

    console.log("✅ Provider health check completed:", {
      healthy: Object.values(healthStatus).filter((s) => s.status === "healthy")
        .length,
      total: Object.keys(healthStatus).length,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ Provider health check failed:", error);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        status: "error",
        message: "Failed to check provider health",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
