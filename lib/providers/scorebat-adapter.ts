// lib/providers/scorebat-adapter.ts
import {
  VideoProvider,
  UnifiedHighlight,
  HighlightFilters,
} from "@/types/highlight";

export class ScorebatAdapter implements VideoProvider {
  private baseUrl = "https://www.scorebat.com/video-api/v3";
  private readonly providerName = "scorebat";
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("Scorebat API key is required");
    }
    this.apiKey = apiKey;
  }

  async getHighlights(filters?: HighlightFilters): Promise<UnifiedHighlight[]> {
    try {
      console.log("Fetching highlights from Scorebat API...");

      // Try multiple Scorebat API endpoints
      const endpoints = [
        `${this.baseUrl}/feed/?token=${this.apiKey}`,
        `${this.baseUrl}/feed/?token=${this.apiKey}&page=1`,
        `${this.baseUrl}/feed/`,
      ];

      let data: unknown = null;
      let lastError: Error | null = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const response = await fetch(endpoint, {
            headers: {
              "Content-Type": "application/json",
              "User-Agent": "Football-Highlights-Platform/1.0",
            },
          });

          if (!response.ok) {
            throw new Error(
              `Scorebat API error: ${response.status} ${response.statusText}`,
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
        throw lastError || new Error("All Scorebat API endpoints failed");
      }

      console.log("Scorebat API response received, transforming data...");

      return this.transformData(data, filters);
    } catch (error) {
      console.error("Scorebat API failed:", error);
      return [];
    }
  }

  private transformData(
    data: unknown,
    filters?: HighlightFilters,
  ): UnifiedHighlight[] {
    if (!data) {
      console.warn("Invalid Scorebat API response format");
      return [];
    }

    // Handle different response formats from Scorebat API
    let items: unknown[] = [];

    // Format 1: Direct array response
    if (Array.isArray(data)) {
      items = data;
    }
    // Format 2: Data with response array
    else if (
      typeof data === "object" &&
      data !== null &&
      "response" in data &&
      Array.isArray(data.response)
    ) {
      items = data.response as unknown[];
    }
    // Format 3: Data with items array
    else if (
      typeof data === "object" &&
      data !== null &&
      "items" in data &&
      Array.isArray(data.items)
    ) {
      items = data.items as unknown[];
    } else {
      console.warn("Unknown Scorebat API response format:", data);
      return [];
    }

    console.log(`Found ${items.length} items in Scorebat API response`);

    return items
      .filter((item: unknown) => this.filterItem(item, filters))
      .map((item: unknown, index: number) =>
        this.mapItemToHighlight(item, index),
      );
  }

  private filterItem(item: unknown, filters?: HighlightFilters): boolean {
    if (!item || typeof item !== "object") return false;

    // Apply competition filter
    if (filters?.competition && "competition" in item && item.competition) {
      const competitionObj = item.competition;
      let itemCompetition = "";

      if (typeof competitionObj === "string") {
        itemCompetition = competitionObj.toLowerCase();
      } else if (
        typeof competitionObj === "object" &&
        competitionObj !== null &&
        "name" in competitionObj
      ) {
        itemCompetition = (
          competitionObj as { name: string }
        ).name.toLowerCase();
      }

      const filterCompetition = filters.competition.toLowerCase();
      if (itemCompetition && !itemCompetition.includes(filterCompetition)) {
        return false;
      }
    }

    // Apply team filter
    if (filters?.team) {
      const searchTeam = filters.team.toLowerCase();
      let homeTeam = "";
      let awayTeam = "";

      if (
        "side1" in item &&
        item.side1 &&
        typeof item.side1 === "object" &&
        "name" in item.side1
      ) {
        homeTeam = (item.side1 as { name: string }).name.toLowerCase();
      }
      if (
        "side2" in item &&
        item.side2 &&
        typeof item.side2 === "object" &&
        "name" in item.side2
      ) {
        awayTeam = (item.side2 as { name: string }).name.toLowerCase();
      }

      if (!homeTeam.includes(searchTeam) && !awayTeam.includes(searchTeam)) {
        return false;
      }
    }

    // Apply date filter
    if (filters?.date && "date" in item && item.date) {
      const itemDate = new Date(item.date as string)
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
    const teams = this.extractTeams(item);
    const score = this.extractScore(item);
    const duration = this.calculateDuration(item);

    const itemObj = item as Record<string, unknown>;

    return {
      id: `scorebat_${(itemObj.title as string)?.replace(/\s+/g, "_").toLowerCase()}_${index}`,
      title: (itemObj.title as string) || `${teams.home} vs ${teams.away}`,
      description:
        (itemObj.description as string) || "Football match highlights",
      thumbnailUrl:
        (itemObj.thumbnail as string) ||
        this.extractThumbnail(item) ||
        "/images/default-thumbnail.jpg",
      videoUrl: this.extractVideoUrl(item),
      embedUrl: itemObj.embed as string,
      duration,
      competition:
        (itemObj.competition as { name: string })?.name ||
        (itemObj.competition as string) ||
        "Unknown Competition",
      teams,
      score,
      matchDate: new Date((itemObj.date as string) || Date.now()),
      views: (itemObj.views as number) || 0,
      likes: (itemObj.likes as number) || 0,
      provider: "scorebat",
      providerId: (itemObj.id as string) || index.toString(),
      metadata: {
        quality: "hd",
        language: this.extractLanguage(),
        commentators: [],
        tags: this.extractTags(item),
      },
    };
  }

  private extractTeams(item: unknown): { home: string; away: string } {
    const itemObj = item as Record<string, unknown>;
    let homeTeam = "Home Team";
    let awayTeam = "Away Team";

    if (
      itemObj.side1 &&
      typeof itemObj.side1 === "object" &&
      itemObj.side1 !== null &&
      "name" in itemObj.side1
    ) {
      homeTeam = (itemObj.side1 as { name: string }).name;
    }
    if (
      itemObj.side2 &&
      typeof itemObj.side2 === "object" &&
      itemObj.side2 !== null &&
      "name" in itemObj.side2
    ) {
      awayTeam = (itemObj.side2 as { name: string }).name;
    }

    return {
      home: homeTeam,
      away: awayTeam,
    };
  }

  private extractScore(
    item: unknown,
  ): { home: number; away: number } | undefined {
    const itemObj = item as Record<string, unknown>;
    if (!itemObj.score) return undefined;

    // Handle different score formats
    if (typeof itemObj.score === "string") {
      const scoreParts = (itemObj.score as string).split("-");
      if (scoreParts.length === 2) {
        return {
          home: parseInt(scoreParts[0]) || 0,
          away: parseInt(scoreParts[1]) || 0,
        };
      }
    } else if (
      itemObj.score &&
      typeof itemObj.score === "object" &&
      itemObj.score !== null
    ) {
      const scoreObj = itemObj.score as Record<string, unknown>;
      if (scoreObj.home !== undefined && scoreObj.away !== undefined) {
        return {
          home: scoreObj.home as number,
          away: scoreObj.away as number,
        };
      }
    }

    return undefined;
  }

  private calculateDuration(item: unknown): number {
    // Estimate duration based on available data
    // Scorebat videos are typically 2-5 minutes for highlights
    const itemObj = item as Record<string, unknown>;
    return (itemObj.duration as number) || 180; // Default 3 minutes
  }

  private extractThumbnail(item: unknown): string | undefined {
    const itemObj = item as Record<string, unknown>;
    if (itemObj.thumbnail) return itemObj.thumbnail as string;
    if (itemObj.thumb) return itemObj.thumb as string;
    if (
      itemObj.videos &&
      Array.isArray(itemObj.videos) &&
      itemObj.videos[0] &&
      typeof itemObj.videos[0] === "object"
    ) {
      const video = itemObj.videos[0] as Record<string, unknown>;
      if (video.thumbnail) return video.thumbnail as string;
    }
    return undefined;
  }

  private extractVideoUrl(item: unknown): string {
    // Extract the best available video URL
    const itemObj = item as Record<string, unknown>;
    if (itemObj.videoUrl) return itemObj.videoUrl as string;
    if (itemObj.url) return itemObj.url as string;
    if (
      itemObj.videos &&
      Array.isArray(itemObj.videos) &&
      itemObj.videos[0] &&
      typeof itemObj.videos[0] === "object"
    ) {
      const video = itemObj.videos[0] as Record<string, unknown>;
      if (video.video) return video.video as string;
    }
    return "";
  }

  private extractLanguage(): string {
    // Default to English, can be enhanced based on actual API response
    return "en";
  }

  private extractTags(item: unknown): string[] {
    const tags = ["football", "highlights"];
    const itemObj = item as Record<string, unknown>;

    if (
      "competition" in itemObj &&
      itemObj.competition &&
      typeof itemObj.competition === "object" &&
      itemObj.competition !== null &&
      "name" in itemObj.competition
    ) {
      tags.push(
        (itemObj.competition as { name: string }).name
          .toLowerCase()
          .replace(/\s+/g, "-"),
      );
    }

    if (
      itemObj.side1 &&
      typeof itemObj.side1 === "object" &&
      "name" in itemObj.side1
    ) {
      tags.push(
        (itemObj.side1 as { name: string }).name
          .toLowerCase()
          .replace(/\s+/g, "-"),
      );
    }

    if (
      itemObj.side2 &&
      typeof itemObj.side2 === "object" &&
      "name" in itemObj.side2
    ) {
      tags.push(
        (itemObj.side2 as { name: string }).name
          .toLowerCase()
          .replace(/\s+/g, "-"),
      );
    }

    return tags;
  }

  getProviderName(): string {
    return this.providerName;
  }

  async getLiveMatches(): Promise<unknown[]> {
    // Scorebat may not have a dedicated live matches endpoint
    // We can filter highlights for recent matches
    try {
      const highlights = await this.getHighlights();
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      return highlights.filter((highlight) => highlight.matchDate > oneHourAgo);
    } catch (error) {
      console.error("Failed to get live matches:", error);
      return [];
    }
  }

  async getCompetitions(): Promise<string[]> {
    try {
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

  // Helper method to get highlights by competition
  async getHighlightsByCompetition(
    competition: string,
  ): Promise<UnifiedHighlight[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/competition/${competition}/?token=${this.apiKey}`,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Football-Highlights-Platform/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Scorebat competition API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformData(data);
    } catch (error) {
      console.error(
        `Scorebat competition API failed for ${competition}:`,
        error,
      );
      return this.getHighlights({ competition });
    }
  }

  // Helper method to get highlights by team
  async getHighlightsByTeam(team: string): Promise<UnifiedHighlight[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/team/${team}/?token=${this.apiKey}`,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Football-Highlights-Platform/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Scorebat team API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformData(data);
    } catch (error) {
      console.error(`Scorebat team API failed for ${team}:`, error);
      return this.getHighlights({ team });
    }
  }

  // Method to get recent highlights with pagination
  async getRecentHighlights(
    page: number = 1,
    pageSize: number = 20,
  ): Promise<UnifiedHighlight[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/feed/?token=${this.apiKey}&page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Football-Highlights-Platform/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Scorebat recent highlights API error: ${response.status}`,
        );
      }

      const data = await response.json();
      return this.transformData(data);
    } catch (error) {
      console.error("Scorebat recent highlights API failed:", error);
      return this.getHighlights();
    }
  }
}
