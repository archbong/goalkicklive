// lib/services/api-service-factory.ts
import { VideoProvider } from '@/types/highlight';
import { SupersportAdapter } from '@/lib/providers/supersport-adapter';
import { ScorebatAdapter } from '@/lib/providers/scorebat-adapter';

export class APIServiceFactory {
  private static providers: VideoProvider[] = [];
  private static initialized = false;

  static initialize(): void {
    if (this.initialized) return;

    // Add Supersport provider if enabled
    if (process.env.SUPERSPORT_API_ENABLED === 'true') {
      console.log('Initializing Supersport adapter...');
      try {
        const supersportAdapter = new SupersportAdapter();
        this.providers.push(supersportAdapter);
        console.log('Supersport adapter initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Supersport adapter:', error);
      }
    } else {
      console.log('Supersport API is disabled');
    }

    // Add Scorebat provider if API key is available
    if (process.env.SCOREBAT_API_KEY) {
      console.log('Initializing Scorebat adapter...');
      try {
        const scorebatAdapter = new ScorebatAdapter(process.env.SCOREBAT_API_KEY);
        this.providers.push(scorebatAdapter);
        console.log('Scorebat adapter initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Scorebat adapter:', error);
      }
    } else {
      console.warn('Scorebat API key not found. Scorebat adapter will not be available.');
    }

    if (this.providers.length === 0) {
      console.warn('No video providers available. Using mock data fallback.');
    }

    this.initialized = true;
    console.log(`API Service Factory initialized with ${this.providers.length} providers`);
  }

  static createVideoService(): VideoProvider[] {
    if (!this.initialized) {
      this.initialize();
    }

    return [...this.providers]; // Return a copy to prevent external modification
  }

  static getAvailableProviders(): string[] {
    return this.providers.map(provider => provider.getProviderName());
  }

  static getProviderByName(name: string): VideoProvider | undefined {
    return this.providers.find(provider => provider.getProviderName() === name);
  }

  static hasProvider(name: string): boolean {
    return this.providers.some(provider => provider.getProviderName() === name);
  }

  static getProvidersCount(): number {
    return this.providers.length;
  }

  static async testAllProviders(): Promise<{
    [providerName: string]: {
      status: 'success' | 'error';
      highlightsCount: number;
      error?: string;
    };
  }> {
    const results: {
      [providerName: string]: {
        status: 'success' | 'error';
        highlightsCount: number;
        error?: string;
      };
    } = {};

    for (const provider of this.providers) {
      try {
        const highlights = await provider.getHighlights();
        results[provider.getProviderName()] = {
          status: 'success',
          highlightsCount: highlights.length,
        };
      } catch (error) {
        results[provider.getProviderName()] = {
          status: 'error',
          highlightsCount: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    }

    return results;
  }

  static clearProviders(): void {
    this.providers = [];
    this.initialized = false;
    console.log('API Service Factory providers cleared');
  }

  static reloadProviders(): void {
    this.clearProviders();
    this.initialize();
  }
}

// Auto-initialize when imported
APIServiceFactory.initialize();
