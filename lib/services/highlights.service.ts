// lib/services/highlights.service.ts
import { ScorebatAdapter } from "@/lib/providers/scorebat-adapter";
import type {
  UnifiedHighlight,
  HighlightFilters,
  HighlightsResponse,
  FilterOptions,
} from "@/types/highlight";

// Helper function to add timeout to promises
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

export class HighlightsService {
  private scorebatAdapter: ScorebatAdapter;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

  constructor(scorebatApiKey?: string) {
    // Initialize adapter with API key from environment variables
    const apiKey = scorebatApiKey || process.env.SCOREBAT_API_KEY || "";
    this.scorebatAdapter = new ScorebatAdapter(apiKey);
  }

  /**
   * Get highlights from all providers with caching
   */
  async getHighlights(filters?: HighlightFilters): Promise<HighlightsResponse> {
    const cacheKey = this.generateCacheKey("highlights", filters);
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached as HighlightsResponse;
    }

    try {
      // Add timeout to API call (10 seconds max)
      const scorebatHighlights = await withTimeout(
        this.scorebatAdapter.getHighlights(filters),
        10000,
      );

      const highlights: UnifiedHighlight[] = scorebatHighlights || [];
      const scorebatCount = highlights.length;

      console.log(
        `Retrieved ${highlights.length} highlights from Scorebat API`,
      );
      // Apply additional filtering
      const filteredHighlights = this.applyFilters(highlights, filters);

      // Sort by date (newest first)
      filteredHighlights.sort(
        (a, b) => b.matchDate.getTime() - a.matchDate.getTime(),
      );

      // Pagination
      const page = filters?.page || 1;
      const pageSize = filters?.pageSize || 20;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedHighlights = filteredHighlights.slice(
        startIndex,
        endIndex,
      );

      const response: HighlightsResponse = {
        highlights: paginatedHighlights,
        totalCount: filteredHighlights.length,
        page,
        pageSize,
        hasMore: endIndex < filteredHighlights.length,
        providers: {
          scorebat: scorebatCount,
          supersport: supersportCount,
        },
      };

      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error(
        "Failed to get highlights:",
        error instanceof Error ? error.message : error,
      );

      // Return empty response instead of throwing to prevent page crashes
      return {
        highlights: [],
        totalCount: 0,
        page: filters?.page || 1,
        pageSize: filters?.pageSize || 20,
        hasMore: false,
        providers: {
          scorebat: 0,
          supersport: 0,
        },
      };
    }
  }

  /**
   * Get live matches (matches from the last hour)
   */
  async getLiveMatches(): Promise<UnifiedHighlight[]> {
    const cacheKey = "live_matches";
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached as UnifiedHighlight[];
    }

    try {
      const highlights = await withTimeout(this.getHighlights(), 5000); // 5 second timeout for live matches
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const liveMatches = highlights.highlights.filter(
        (highlight) => highlight.matchDate > oneHourAgo,
      );

      this.setCache(cacheKey, liveMatches, 60 * 1000); // 1 minute cache for live matches
      return liveMatches;
    } catch (error) {
      console.error(
        "Failed to get live matches:",
        error instanceof Error ? error.message : error,
      );
      return [];
    }
  }

  /**
   * Get highlights by competition
   */
  async getHighlightsByCompetition(
    competition: string,
  ): Promise<UnifiedHighlight[]> {
    const cacheKey = `competition_${competition}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached as UnifiedHighlight[];
    }

    try {
      // Try Scorebat's competition endpoint first with timeout
      const scorebatHighlights = await withTimeout(
        this.scorebatAdapter.getHighlightsByCompetition(competition),
        5000,
      );

      // Also get from general highlights and filter
      const allHighlights = await this.getHighlights();
      const filteredHighlights = allHighlights.highlights.filter((h) =>
        h.competition.toLowerCase().includes(competition.toLowerCase()),
      );

      // Combine and deduplicate
      const combined = [...scorebatHighlights, ...filteredHighlights];
      const uniqueHighlights = this.removeDuplicates(combined);

      this.setCache(cacheKey, uniqueHighlights);
      return uniqueHighlights;
    } catch (error) {
      console.error(
        `Failed to get highlights for competition ${competition}:`,
        error instanceof Error ? error.message : error,
      );
      return [];
    }
  }

  /**
   * Get highlights by team
   */
  async getHighlightsByTeam(team: string): Promise<UnifiedHighlight[]> {
    const cacheKey = `team_${team}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached as UnifiedHighlight[];
    }

    try {
      // Try Scorebat's team endpoint first with timeout
      const scorebatHighlights = await withTimeout(
        this.scorebatAdapter.getHighlightsByTeam(team),
        5000,
      );

      // Also get from general highlights and filter
      const allHighlights = await this.getHighlights();
      const filteredHighlights = allHighlights.highlights.filter(
        (h) =>
          h.teams.home.toLowerCase().includes(team.toLowerCase()) ||
          h.teams.away.toLowerCase().includes(team.toLowerCase()),
      );

      // Combine and deduplicate
      const combined = [...scorebatHighlights, ...filteredHighlights];
      const uniqueHighlights = this.removeDuplicates(combined);

      this.setCache(cacheKey, uniqueHighlights);
      return uniqueHighlights;
    } catch (error) {
      console.error(
        `Failed to get highlights for team ${team}:`,
        error instanceof Error ? error.message : error,
      );
      return [];
    }
  }

  /**
   * Get available competitions
   */
  async getCompetitions(): Promise<string[]> {
    const cacheKey = "competitions";
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached as string[];
    }

    try {
      const highlights = await withTimeout(this.getHighlights(), 5000);
      const competitions = new Set<string>();

      highlights.highlights.forEach((highlight) => {
        if (
          highlight.competition &&
          highlight.competition !== "Unknown Competition"
        ) {
          competitions.add(highlight.competition);
        }
      });

      const sortedCompetitions = Array.from(competitions).sort();
      this.setCache(cacheKey, sortedCompetitions);
      return sortedCompetitions;
    } catch (error) {
      console.error(
        "Failed to get competitions:",
        error instanceof Error ? error.message : error,
      );
      return [];
    }
  }

  /**
   * Get available teams
   */
  async getTeams(): Promise<string[]> {
    const cacheKey = "teams";
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached as string[];
    }

    try {
      const highlights = await withTimeout(this.getHighlights(), 5000);
      const teams = new Set<string>();

      highlights.highlights.forEach((highlight) => {
        if (highlight.teams.home && highlight.teams.home !== "Home Team") {
          teams.add(highlight.teams.home);
        }
        if (highlight.teams.away && highlight.teams.away !== "Away Team") {
          teams.add(highlight.teams.away);
        }
      });

      const sortedTeams = Array.from(teams).sort();
      this.setCache(cacheKey, sortedTeams);
      return sortedTeams;
    } catch (error) {
      console.error(
        "Failed to get teams:",
        error instanceof Error ? error.message : error,
      );
      return [];
    }
  }

  /**
   * Get filter options for UI
   */
  async getFilterOptions(): Promise<FilterOptions> {
    const cacheKey = "filter_options";
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached as FilterOptions;
    }

    try {
      const [competitions, teams, highlights] = await Promise.all([
        withTimeout(this.getCompetitions(), 5000),
        withTimeout(this.getTeams(), 5000),
        withTimeout(this.getHighlights(), 10000),
      ]);

      // Extract date range from highlights
      const dates = highlights.highlights.map((h) => h.matchDate);
      const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

      const filterOptions: FilterOptions = {
        competitions: competitions.map((c) => ({
          value: c.toLowerCase().replace(/\s+/g, "-"),
          label: c,
          country: this.extractCountryFromCompetition(c),
        })),
        teams: teams.map((t) => ({
          value: t.toLowerCase().replace(/\s+/g, "-"),
          label: t,
          country: this.extractCountryFromTeam(t),
        })),
        dateRange: {
          min: minDate,
          max: maxDate,
        },
        providers: [
          {
            id: "scorebat",
            name: "Scorebat",
            count: highlights.providers.scorebat,
          },
          {
            id: "supersport",
            name: "Supersport",
            count: highlights.providers.supersport,
          },
        ],
      };

      this.setCache(cacheKey, filterOptions);
      return filterOptions;
    } catch (error) {
      console.error(
        "Failed to get filter options:",
        error instanceof Error ? error.message : error,
      );
      return {
        competitions: [],
        teams: [],
        dateRange: { min: new Date(), max: new Date() },
        providers: [],
      };
    }
  }

  /**
   * Get featured highlights (most viewed/liked)
   */
  async getFeaturedHighlights(limit: number = 6): Promise<UnifiedHighlight[]> {
    const cacheKey = `featured_${limit}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached as UnifiedHighlight[];
    }

    try {
      const highlights = await withTimeout(this.getHighlights(), 5000);

      // Sort by engagement (views + likes)
      const sortedHighlights = [...highlights.highlights].sort((a, b) => {
        const engagementA = a.views + a.likes;
        const engagementB = b.views + b.likes;
        return engagementB - engagementA;
      });

      const featured = sortedHighlights.slice(0, limit);
      this.setCache(cacheKey, featured);
      return featured;
    } catch (error) {
      console.error(
        "Failed to get featured highlights:",
        error instanceof Error ? error.message : error,
      );
      return [];
    }
  }

  /**
   * Get recent highlights (last 7 days)
   */
  async getRecentHighlights(limit: number = 10): Promise<UnifiedHighlight[]> {
    const cacheKey = `recent_${limit}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached as UnifiedHighlight[];
    }

    try {
      const highlights = await withTimeout(this.getHighlights(), 5000);
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const recentHighlights = highlights.highlights
        .filter((h) => h.matchDate > sevenDaysAgo)
        .sort((a, b) => b.matchDate.getTime() - a.matchDate.getTime())
        .slice(0, limit);

      this.setCache(cacheKey, recentHighlights);
      return recentHighlights;
    } catch (error) {
      console.error(
        "Failed to get recent highlights:",
        error instanceof Error ? error.message : error,
      );
      return [];
    }
  }

  /**
   * Clear cache for specific key or all cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  // Private helper methods

  private applyFilters(
    highlights: UnifiedHighlight[],
    filters?: HighlightFilters,
  ): UnifiedHighlight[] {
    if (!filters) return highlights;

    return highlights.filter((highlight) => {
      // Filter by competition
      if (
        filters.competition &&
        !highlight.competition
          .toLowerCase()
          .includes(filters.competition.toLowerCase())
      ) {
        return false;
      }

      // Filter by team
      if (
        filters.team &&
        !highlight.teams.home
          .toLowerCase()
          .includes(filters.team.toLowerCase()) &&
        !highlight.teams.away.toLowerCase().includes(filters.team.toLowerCase())
      ) {
        return false;
      }

      // Filter by provider
      if (
        filters.provider &&
        filters.provider !== "all" &&
        highlight.provider !== filters.provider
      ) {
        return false;
      }

      // Filter by date
      if (filters.date) {
        const highlightDate = highlight.matchDate.toISOString().split("T")[0];
        if (highlightDate !== filters.date) {
          return false;
        }
      }

      return true;
    });
  }

  private removeDuplicates(highlights: UnifiedHighlight[]): UnifiedHighlight[] {
    const seen = new Set<string>();
    return highlights.filter((highlight) => {
      const key = `${highlight.title}_${highlight.matchDate.getTime()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private generateCacheKey(prefix: string, filters?: any): string {
    const filterString = filters ? JSON.stringify(filters) : "";
    return `${prefix}_${filterString}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private extractCountryFromCompetition(competition: string): string | null {
    // Simple country extraction logic
    const countryMap: Record<string, string> = {
      "premier league": "England",
      "la liga": "Spain",
      "serie a": "Italy",
      bundesliga: "Germany",
      "ligue 1": "France",
      "champions league": "Europe",
      "europa league": "Europe",
      "world cup": "International",
    };

    const lowerCompetition = competition.toLowerCase();
    for (const [key, country] of Object.entries(countryMap)) {
      if (lowerCompetition.includes(key)) {
        return country;
      }
    }

    return null;
  }

  private extractCountryFromTeam(team: string): string | null {
    // Simple team country extraction
    const teamCountryMap: Record<string, string> = {
      manchester: "England",
      liverpool: "England",
      chelsea: "England",
      arsenal: "England",
      tottenham: "England",
      barcelona: "Spain",
      "real madrid": "Spain",
      atletico: "Spain",
      juventus: "Italy",
      milan: "Italy",
      inter: "Italy",
      bayern: "Germany",
      dortmund: "Germany",
      psg: "France",
    };

    const lowerTeam = team.toLowerCase();
    for (const [key, country] of Object.entries(teamCountryMap)) {
      if (lowerTeam.includes(key)) {
        return country;
      }
    }

    return null;
  }
}

// Singleton instance for easy access
let highlightsServiceInstance: HighlightsService | null = null;

export function getHighlightsService(
  scorebatApiKey?: string,
): HighlightsService {
  if (!highlightsServiceInstance) {
    highlightsServiceInstance = new HighlightsService(scorebatApiKey);
  }
  return highlightsServiceInstance;
}
