// lib/providers/scorebat-adapter.ts
import { VideoProvider, UnifiedHighlight, HighlightFilters } from '@/types/highlight';

export class ScorebatAdapter implements VideoProvider {
  private baseUrl = 'https://www.scorebat.com/video-api';
  private readonly providerName = 'scorebat';
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Scorebat API key is required');
    }
    this.apiKey = apiKey;
  }

  async getHighlights(filters?: HighlightFilters): Promise<UnifiedHighlight[]> {
    try {
      console.log('Fetching highlights from Scorebat API...');

      const response = await fetch(this.baseUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Football-Highlights-Platform/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Scorebat API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Scorebat API response received, transforming data...');

      return this.transformData(data, filters);
    } catch (error) {
      console.error('Scorebat API failed:', error);
      return [];
    }
  }

  private transformData(data: any, filters?: HighlightFilters): UnifiedHighlight[] {
    if (!data || !Array.isArray(data)) {
      console.warn('Invalid Scorebat API response format');
      return [];
    }

    return data
      .filter((item: any) => this.filterItem(item, filters))
      .map((item: any, index: number) => this.mapItemToHighlight(item, index));
  }

  private filterItem(item: any, filters?: HighlightFilters): boolean {
    if (!item) return false;

    // Apply competition filter
    if (filters?.competition && item.competition) {
      const itemCompetition = item.competition.name?.toLowerCase() || item.competition.toLowerCase();
      const filterCompetition = filters.competition.toLowerCase();
      if (!itemCompetition.includes(filterCompetition)) {
        return false;
      }
    }

    // Apply team filter
    if (filters?.team) {
      const searchTeam = filters.team.toLowerCase();
      const homeTeam = item.side1?.name?.toLowerCase() || '';
      const awayTeam = item.side2?.name?.toLowerCase() || '';

      if (!homeTeam.includes(searchTeam) && !awayTeam.includes(searchTeam)) {
        return false;
      }
    }

    // Apply date filter
    if (filters?.date && item.date) {
      const itemDate = new Date(item.date).toISOString().split('T')[0];
      const filterDate = filters.date;

      if (itemDate !== filterDate) {
        return false;
      }
    }

    return true;
  }

  private mapItemToHighlight(item: any, index: number): UnifiedHighlight {
    const teams = this.extractTeams(item);
    const score = this.extractScore(item);
    const duration = this.calculateDuration(item);

    return {
      id: `scorebat_${item.title?.replace(/\s+/g, '_').toLowerCase()}_${index}`,
      title: item.title || `${teams.home} vs ${teams.away}`,
      description: item.description || 'Football match highlights',
      thumbnailUrl: item.thumbnail || this.extractThumbnail(item) || '/images/default-thumbnail.jpg',
      videoUrl: this.extractVideoUrl(item),
      embedUrl: item.embed,
      duration,
      competition: item.competition?.name || item.competition || 'Unknown Competition',
      teams,
      score,
      matchDate: new Date(item.date || Date.now()),
      views: item.views || 0,
      likes: item.likes || 0,
      provider: 'scorebat',
      providerId: item.id || index.toString(),
      metadata: {
        quality: 'hd',
        language: this.extractLanguage(item),
        commentators: [],
        tags: this.extractTags(item),
      },
    };
  }

  private extractTeams(item: any): { home: string; away: string } {
    return {
      home: item.side1?.name || 'Home Team',
      away: item.side2?.name || 'Away Team',
    };
  }

  private extractScore(item: any): { home: number; away: number } | undefined {
    if (!item.score) return undefined;

    // Handle different score formats
    if (typeof item.score === 'string') {
      const scoreParts = item.score.split('-');
      if (scoreParts.length === 2) {
        return {
          home: parseInt(scoreParts[0]) || 0,
          away: parseInt(scoreParts[1]) || 0,
        };
      }
    } else if (item.score.home !== undefined && item.score.away !== undefined) {
      return {
        home: item.score.home,
        away: item.score.away,
      };
    }

    return undefined;
  }

  private calculateDuration(item: any): number {
    // Estimate duration based on available data
    // Scorebat videos are typically 2-5 minutes for highlights
    return item.duration || 180; // Default 3 minutes
  }

  private extractThumbnail(item: any): string | undefined {
    if (item.thumbnail) return item.thumbnail;
    if (item.thumb) return item.thumb;
    if (item.videos && item.videos[0]?.thumbnail) {
      return item.videos[0].thumbnail;
    }
    return undefined;
  }

  private extractVideoUrl(item: any): string {
    // Extract the best available video URL
    if (item.videoUrl) return item.videoUrl;
    if (item.url) return item.url;
    if (item.videos && item.videos[0]?.video) {
      return item.videos[0].video;
    }
    return '';
  }

  private extractLanguage(item: any): string {
    // Default to English, can be enhanced based on actual API response
    return 'en';
  }

  private extractTags(item: any): string[] {
    const tags = ['football', 'highlights'];

    if (item.competition?.name) {
      tags.push(item.competition.name.toLowerCase().replace(/\s+/g, '-'));
    }

    if (item.side1?.name) {
      tags.push(item.side1.name.toLowerCase().replace(/\s+/g, '-'));
    }

    if (item.side2?.name) {
      tags.push(item.side2.name.toLowerCase().replace(/\s+/g, '-'));
    }

    return tags;
  }

  getProviderName(): string {
    return this.providerName;
  }

  async getLiveMatches(): Promise<any[]> {
    // Scorebat may not have a dedicated live matches endpoint
    // We can filter highlights for recent matches
    try {
      const highlights = await this.getHighlights();
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      return highlights.filter(highlight =>
        highlight.matchDate > oneHourAgo
      );
    } catch (error) {
      console.error('Failed to get live matches:', error);
      return [];
    }
  }

  async getCompetitions(): Promise<string[]> {
    try {
      const highlights = await this.getHighlights();
      const competitions = new Set<string>();

      highlights.forEach(highlight => {
        if (highlight.competition && highlight.competition !== 'Unknown Competition') {
          competitions.add(highlight.competition);
        }
      });

      return Array.from(competitions).sort();
    } catch (error) {
      console.error('Failed to get competitions:', error);
      return [];
    }
  }

  async getTeams(): Promise<string[]> {
    try {
      const highlights = await this.getHighlights();
      const teams = new Set<string>();

      highlights.forEach(highlight => {
        if (highlight.teams.home && highlight.teams.home !== 'Home Team') {
          teams.add(highlight.teams.home);
        }
        if (highlight.teams.away && highlight.teams.away !== 'Away Team') {
          teams.add(highlight.teams.away);
        }
      });

      return Array.from(teams).sort();
    } catch (error) {
      console.error('Failed to get teams:', error);
      return [];
    }
  }

  // Helper method to get highlights by competition
  async getHighlightsByCompetition(competition: string): Promise<UnifiedHighlight[]> {
    return this.getHighlights({ competition });
  }
}
