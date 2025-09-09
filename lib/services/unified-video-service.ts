// lib/services/unified-video-service.ts
import { VideoProvider, UnifiedHighlight, HighlightFilters } from '@/types/highlight';
import { redis } from '@/lib/redis';

export class UnifiedVideoService {
  private providers: VideoProvider[];

  constructor(providers: VideoProvider[]) {
    this.providers = providers;
    console.log(`UnifiedVideoService created with ${providers.length} providers`);
  }

  async getHighlights(filters: HighlightFilters = {}): Promise<UnifiedHighlight[]> {
    const cacheKey = this.generateCacheKey(filters);

    // Try to get from cache first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log('Cache hit for highlights:', cacheKey);
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Redis cache unavailable, proceeding without cache:', error);
    }

    // Fetch from providers with fallback mechanism
    let allHighlights: UnifiedHighlight[] = [];

    for (const provider of this.providers) {
      try {
        console.log(`Fetching highlights from ${provider.getProviderName()}...`);
        const providerHighlights = await provider.getHighlights(filters);
        console.log(`Received ${providerHighlights.length} highlights from ${provider.getProviderName()}`);

        allHighlights = [...allHighlights, ...providerHighlights];

        // If we have enough results, break early
        if (filters.pageSize && allHighlights.length >= filters.pageSize) {
          console.log(`Reached page size limit (${filters.pageSize}), stopping provider queries`);
          break;
        }
      } catch (error) {
        console.warn(`Provider ${provider.getProviderName()} failed:`, error);
        // Continue to next provider
      }
    }

    // Apply additional filtering and sorting
    const filteredHighlights = this.applyFilters(allHighlights, filters);

    // Cache the results
    try {
      const cacheTtl = parseInt(process.env.CACHE_TTL || '300');
      await redis.setex(cacheKey, cacheTtl, JSON.stringify(filteredHighlights));
      console.log(`Cached ${filteredHighlights.length} highlights for ${cacheTtl} seconds`);
    } catch (error) {
      console.warn('Failed to cache results:', error);
    }

    return filteredHighlights;
  }

  private generateCacheKey(filters: HighlightFilters): string {
    const filterString = JSON.stringify({
      competition: filters.competition,
      team: filters.team,
      date: filters.date,
      provider: filters.provider,
      // Don't include page/pageSize in cache key to allow pagination from cached data
    });
    return `highlights:${filterString}`;
  }

  private applyFilters(highlights: UnifiedHighlight[], filters: HighlightFilters): UnifiedHighlight[] {
    let filtered = [...highlights];

    // Apply provider filter
    if (filters.provider && filters.provider !== 'all') {
      filtered = filtered.filter(h => h.provider === filters.provider);
    }

    // Apply competition filter
    if (filters.competition) {
      filtered = filtered.filter(h =>
        h.competition.toLowerCase().includes(filters.competition!.toLowerCase())
      );
    }

    // Apply team filter
    if (filters.team) {
      filtered = filtered.filter(h =>
        h.teams.home.toLowerCase().includes(filters.team!.toLowerCase()) ||
        h.teams.away.toLowerCase().includes(filters.team!.toLowerCase())
      );
    }

    // Apply date filter
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filtered = filtered.filter(h =>
        h.matchDate.toISOString().split('T')[0] === filterDate.toISOString().split('T')[0]
      );
    }

    // Remove duplicates based on title and teams
    filtered = this.removeDuplicates(filtered);

    // Sort by date (newest first)
    filtered.sort((a, b) => b.matchDate.getTime() - a.matchDate.getTime());

    // Apply pagination
    if (filters.page && filters.pageSize) {
      const start = (filters.page - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      filtered = filtered.slice(start, end);
    }

    return filtered;
  }

  private removeDuplicates(highlights: UnifiedHighlight[]): UnifiedHighlight[] {
    const seen = new Set<string>();
    return highlights.filter(highlight => {
      const key = `${highlight.title}_${highlight.teams.home}_${highlight.teams.away}_${highlight.matchDate.toISOString().split('T')[0]}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async getAvailableProviders(): Promise<string[]> {
    return this.providers.map(p => p.getProviderName());
  }

  async getProviderStats(): Promise<{
    [providerName: string]: {
      highlightsCount: number;
      status: 'active' | 'inactive';
    };
  }> {
    const stats: {
      [providerName: string]: {
        highlightsCount: number;
        status: 'active' | 'inactive';
      };
    } = {};

    for (const provider of this.providers) {
      try {
        const highlights = await provider.getHighlights({ pageSize: 1 });
        stats[provider.getProviderName()] = {
          highlightsCount: highlights.length,
          status: 'active',
        };
      } catch (error) {
        stats[provider.getProviderName()] = {
          highlightsCount: 0,
          status: 'inactive',
        };
      }
    }

    return stats;
  }

  async clearCache(filters?: HighlightFilters): Promise<void> {
    try {
      if (filters) {
        const cacheKey = this.generateCacheKey(filters);
        await redis.del(cacheKey);
        console.log('Cleared cache for key:', cacheKey);
      } else {
        // Clear all highlight caches
        const keys = await redis.keys('highlights:*');
        if (keys.length > 0) {
          await redis.del(...keys);
          console.log(`Cleared ${keys.length} cache keys`);
        }
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }
}
