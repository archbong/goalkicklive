// lib/services/provider-manager.ts
import { VideoProvider } from "@/types/highlight";
import { SupersportAdapter } from "@/lib/providers/supersport-adapter";
import { ScorebatAdapter } from "@/lib/providers/scorebat-adapter";
import { UnifiedVideoService } from "@/lib/services/unified-video-service";

export class ProviderManager {
  private static instance: ProviderManager;
  private providers: Map<string, VideoProvider> = new Map();
  private unifiedService: UnifiedVideoService | null = null;

  private constructor() {
    this.initializeProviders();
  }

  public static getInstance(): ProviderManager {
    if (!ProviderManager.instance) {
      ProviderManager.instance = new ProviderManager();
    }
    return ProviderManager.instance;
  }

  private initializeProviders(): void {
    console.log("🔄 Initializing video providers...");

    // Initialize Supersport provider if enabled
    if (this.isProviderEnabled("supersport")) {
      try {
        const supersportProvider = new SupersportAdapter();
        this.providers.set("supersport", supersportProvider);
        console.log("✅ Supersport provider initialized");
      } catch (error) {
        console.error("❌ Failed to initialize Supersport provider:", error);
      }
    } else {
      console.log("⏭️  Supersport provider disabled");
    }

    // Initialize Scorebat provider if enabled and API key is available
    if (this.isProviderEnabled("scorebat")) {
      const scorebatApiKey = process.env.SCOREBAT_API_TOKEN;
      if (scorebatApiKey) {
        try {
          const scorebatProvider = new ScorebatAdapter(scorebatApiKey);
          this.providers.set("scorebat", scorebatProvider);
          console.log("✅ Scorebat provider initialized");
        } catch (error) {
          console.error("❌ Failed to initialize Scorebat provider:", error);
        }
      } else {
        console.warn("⚠️  Scorebat API token not found, provider disabled");
      }
    } else {
      console.log("⏭️  Scorebat provider disabled");
    }

    // Initialize unified video service if we have providers
    if (this.providers.size > 0) {
      this.unifiedService = new UnifiedVideoService(
        Array.from(this.providers.values()),
      );
      console.log(
        `✅ Unified video service initialized with ${this.providers.size} providers`,
      );
    } else {
      console.warn("⚠️  No video providers available");
    }
  }

  private isProviderEnabled(providerName: string): boolean {
    const envVar = `ENABLE_${providerName.toUpperCase()}`;
    const envValue = process.env[envVar];

    // Default to true if not specified, except for development where we might want to disable
    if (envValue === undefined) {
      return (
        process.env.NODE_ENV !== "development" || providerName === "supersport"
      );
    }

    return envValue.toLowerCase() === "true";
  }

  public getProvider(providerName: string): VideoProvider | undefined {
    return this.providers.get(providerName);
  }

  public getAllProviders(): VideoProvider[] {
    return Array.from(this.providers.values());
  }

  public getProviderNames(): string[] {
    return Array.from(this.providers.keys());
  }

  public getUnifiedService(): UnifiedVideoService | null {
    return this.unifiedService;
  }

  public async healthCheck(): Promise<{
    [providerName: string]: {
      status: "healthy" | "unhealthy" | "disabled";
      message?: string;
      highlightsCount?: number;
    };
  }> {
    const healthStatus: {
      [providerName: string]: {
        status: "healthy" | "unhealthy" | "disabled";
        message?: string;
        highlightsCount?: number;
      };
    } = {};

    for (const [name, provider] of this.providers.entries()) {
      try {
        // Test the provider by fetching a small number of highlights
        const highlights = await provider.getHighlights({ pageSize: 1 });
        healthStatus[name] = {
          status: "healthy",
          highlightsCount: highlights.length,
          message: `Successfully fetched ${highlights.length} highlights`,
        };
      } catch (error) {
        healthStatus[name] = {
          status: "unhealthy",
          message: `Provider error: ${error instanceof Error ? error.message : "Unknown error"}`,
        };
      }
    }

    // Check disabled providers
    const allProviderNames = ["supersport", "scorebat"];
    for (const name of allProviderNames) {
      if (!healthStatus[name] && !this.providers.has(name)) {
        healthStatus[name] = {
          status: "disabled",
          message: "Provider is disabled or not configured",
        };
      }
    }

    return healthStatus;
  }

  public async clearAllCaches(): Promise<void> {
    if (this.unifiedService) {
      await this.unifiedService.clearCache();
      console.log("🧹 Cleared all provider caches");
    }

    // Clear individual provider caches if they implement cache clearing
    for (const provider of this.providers.values()) {
      if (
        "clearCache" in provider &&
        typeof (
          provider as VideoProvider & { clearCache?: () => Promise<void> }
        ).clearCache === "function"
      ) {
        try {
          await (
            provider as VideoProvider & { clearCache: () => Promise<void> }
          ).clearCache();
        } catch (error) {
          console.warn(`Failed to clear cache for provider:`, error);
        }
      }
    }
  }

  public getProviderStats(): {
    total: number;
    enabled: number;
    disabled: number;
  } {
    const total = 2; // supersport + scorebat
    const enabled = this.providers.size;
    const disabled = total - enabled;

    return { total, enabled, disabled };
  }
}

// Singleton export
export const providerManager = ProviderManager.getInstance();
