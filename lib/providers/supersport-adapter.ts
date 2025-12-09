// lib/providers/supersport-adapter.ts
import {
  VideoProvider,
  UnifiedHighlight,
  HighlightFilters,
} from "@/types/highlight";

export class SupersportAdapter implements VideoProvider {
  private baseUrl = "https://supersport.com/apix";
  private readonly providerName = "supersport";

  async getHighlights(filters?: HighlightFilters): Promise<UnifiedHighlight[]> {
    try {
      console.log("Fetching highlights from Supersport API...");

      // Try multiple Supersport API endpoints
      const endpoints = [
        `${this.baseUrl}/guide/v5.3/livenow?live=true`,
        `${this.baseUrl}/guide/v5.3/livenow`,
        `${this.baseUrl}/content/v5.1/indaleko-web/curatedfavourites`,
        `${this.baseUrl}/football/v5.1/feed/score/summary?pageSize=20&eventStatusIds=1,2`,
      ];

      let data: unknown = null;
      let lastError: Error | null = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await fetch(endpoint, {
            headers: this.getHeaders(),
          });

          if (!response.ok) {
            throw new Error(
              `Supersport API error: ${response.status} ${response.statusText}`,
            );
          }

          data = await response.json();
          console.log(`✅ Success with endpoint: ${endpoint}`);
          break;
        } catch (error) {
          console.warn(`❌ Failed with endpoint ${endpoint}:`, error);
          lastError = error as Error;
          continue;
        }
      }

      if (!data) {
        throw lastError || new Error("All Supersport API endpoints failed");
      }

      console.log("Supersport API response received, transforming data...");

      return this.transformData(data, filters);
    } catch (error) {
      console.error("Supersport API failed:", error);
      return [];
    }
  }

  private transformData(
    data: unknown,
    filters?: HighlightFilters,
  ): UnifiedHighlight[] {
    if (!data) {
      console.warn("Invalid Supersport API response format");
      return [];
    }

    // Handle different response formats from various Supersport endpoints
    let items: unknown[] = [];

    // Format 1: data.items array (livenow endpoint)
    if (
      typeof data === "object" &&
      data !== null &&
      "items" in data &&
      Array.isArray(data.items)
    ) {
      items = data.items as unknown[];
    }
    // Format 2: data array directly (curatedfavourites endpoint)
    else if (Array.isArray(data)) {
      items = data;
    }
    // Format 3: data.events array (football feed endpoint)
    else if (
      typeof data === "object" &&
      data !== null &&
      "events" in data &&
      Array.isArray(data.events)
    ) {
      items = data.events as unknown[];
    }
    // Format 4: data.data array (some endpoints)
    else if (
      typeof data === "object" &&
      data !== null &&
      "data" in data &&
      Array.isArray(data.data)
    ) {
      items = data.data as unknown[];
    } else {
      console.warn("Unknown Supersport API response format:", data);
      return [];
    }

    console.log(`Found ${items.length} items in Supersport API response`);

    return items
      .filter((item: unknown) => this.filterItem(item, filters))
      .map((item: unknown, index: number) =>
        this.mapItemToHighlight(item, index),
      );
  }

  private filterItem(item: unknown, filters?: HighlightFilters): boolean {
    if (!item || typeof item !== "object") return false;

    const itemObj = item as Record<string, unknown>;

    // Apply competition filter
    if (filters?.competition && itemObj.competition) {
      const itemCompetition = (itemObj.competition as string).toLowerCase();
      const filterCompetition = filters.competition.toLowerCase();
      if (!itemCompetition.includes(filterCompetition)) {
        return false;
      }
    }

    // Apply team filter
    if (filters?.team && itemObj.homeTeam && itemObj.awayTeam) {
      const searchTeam = filters.team.toLowerCase();
      const homeTeam = (itemObj.homeTeam as string).toLowerCase();
      const awayTeam = (itemObj.awayTeam as string).toLowerCase();

      if (!homeTeam.includes(searchTeam) && !awayTeam.includes(searchTeam)) {
        return false;
      }
    }

    // Apply date filter
    if (filters?.date && itemObj.date) {
      const itemDate = new Date(itemObj.date as string)
        .toISOString()
        .split("T")[0];
      const filterDate = filters.date;

      if (itemDate !== filterDate) {
        return false;
      }
    }

    return true;
  }

  private mapItemToHighlight(item: unknown, index: number): UnifiedHighlight {
    const itemObj = item as Record<string, unknown>;

    return {
      id: `supersport_${(itemObj.id as string) || `item_${index}_${Date.now()}`}`,
      title: (itemObj.title as string) || "Unknown Match",
      description:
        (itemObj.description as string) || "Football match highlights",
      thumbnailUrl:
        (itemObj.thumbnail as string) || "/images/default-thumbnail.jpg",
      videoUrl: (itemObj.videoUrl as string) || "",
      duration: (itemObj.duration as number) || 180,
      competition: (itemObj.competition as string) || "Unknown Competition",
      teams: {
        home: (itemObj.homeTeam as string) || "Home Team",
        away: (itemObj.awayTeam as string) || "Away Team",
      },
      score: itemObj.score
        ? {
            home:
              ((itemObj.score as Record<string, unknown>).home as number) || 0,
            away:
              ((itemObj.score as Record<string, unknown>).away as number) || 0,
          }
        : undefined,
      matchDate: new Date((itemObj.date as string) || Date.now()),
      views: (itemObj.views as number) || 0,
      likes: (itemObj.likes as number) || 0,
      provider: "supersport",
      providerId: (itemObj.id as string) || index.toString(),
      metadata: {
        quality: (itemObj.quality as string) || "hd",
        language: (itemObj.language as string) || "en",
        commentators: (itemObj.commentators as string[]) || [],
        tags: (itemObj.tags as string[]) || ["football", "highlights"],
      },
    };
  }

  getProviderName(): string {
    return this.providerName;
  }

  async getLiveMatches(): Promise<unknown[]> {
    try {
      console.log("Fetching live matches from Supersport API...");

      const response = await fetch(
        `${this.baseUrl}/guide/v5.3/livenow?live=true`,
        {
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Supersport live matches error: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats
      if (data.items && Array.isArray(data.items)) {
        return data.items;
      } else if (Array.isArray(data)) {
        return data;
      } else if (data.events && Array.isArray(data.events)) {
        return data.events;
      }

      return [];
    } catch (error) {
      console.error("Supersport live matches failed:", error);
      return [];
    }
  }

  async getCompetitions(): Promise<string[]> {
    try {
      // For Supersport, we might need to extract competitions from existing data
      // since there might not be a dedicated competitions endpoint
      const highlights = await this.getHighlights();
      const competitions = new Set<string>();

      highlights.forEach((highlight) => {
        if (
          highlight.competition &&
          highlight.competition !== "Unknown Competition"
        ) {
          competitions.add(highlight.competition);
        }
      });

      return Array.from(competitions).sort();
    } catch (error) {
      console.error("Failed to get competitions:", error);
      return [];
    }
  }

  async getTeams(): Promise<string[]> {
    try {
      const highlights = await this.getHighlights();
      const teams = new Set<string>();

      highlights.forEach((highlight) => {
        if (highlight.teams.home && highlight.teams.home !== "Home Team") {
          teams.add(highlight.teams.home);
        }
        if (highlight.teams.away && highlight.teams.away !== "Away Team") {
          teams.add(highlight.teams.away);
        }
      });

      return Array.from(teams).sort();
    } catch (error) {
      console.error("Failed to get teams:", error);
      return [];
    }
  }

  private getHeaders() {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "User-Agent": "Football-Highlights-Platform/1.0",
      Accept: "application/json",
    };

    // Add API key if available
    const apiKey = process.env.SUPERSPORT_API_KEY;
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
      headers["X-API-Key"] = apiKey;
    }

    // Add required headers for Supersport API
    headers["X-Platform"] = "indaleko-web";
    headers["X-Region"] = "de"; // Default to Germany, can be made configurable
    headers["X-Version"] = "v5.1";

    return headers;
  }

  // Helper method to get country-specific content
  async getHighlightsByCountry(
    countryCode: string = "de",
  ): Promise<UnifiedHighlight[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/guide/v5.3/livenow?countryCode=${countryCode}&live=true`,
        {
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Supersport country API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformData(data);
    } catch (error) {
      console.error(`Supersport country API failed for ${countryCode}:`, error);
      return [];
    }
  }

  // Additional method to get football-specific content
  async getFootballHighlights(): Promise<UnifiedHighlight[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/guide/v5.3/livenow?sport=football&live=true`,
        {
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Supersport football API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformData(data);
    } catch (error) {
      console.error("Supersport football API failed:", error);
      return [];
    }
  }

  // Method to get score summaries
  async getScoreSummaries(): Promise<UnifiedHighlight[]> {
    try {
      const startDate = Math.floor(Date.now() / 1000) - 24 * 60 * 60; // Last 24 hours
      const endDate = Math.floor(Date.now() / 1000);

      const response = await fetch(
        `${this.baseUrl}/football/v5.1/feed/score/summary?pageSize=50&eventStatusIds=1,2&startDate=${startDate}&endDate=${endDate}&orderAscending=false&region=de&platform=indaleko-web`,
        {
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Supersport score API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformData(data);
    } catch (error) {
      console.error("Supersport score API failed:", error);
      return [];
    }
  }
}
