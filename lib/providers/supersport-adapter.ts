// lib/providers/supersport-adapter.ts
import { VideoProvider, UnifiedHighlight, HighlightFilters } from '@/types/highlight';

export class SupersportAdapter implements VideoProvider {
  private baseUrl = 'https://supersport.com/apix';
  private readonly providerName = 'supersport';

  async getHighlights(filters?: HighlightFilters): Promise<UnifiedHighlight[]> {
    try {
      console.log('Fetching highlights from Supersport API...');

      const response = await fetch(`${this.baseUrl}/guide/v5.3/livenow`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Supersport API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Supersport API response received, transforming data...');

      return this.transformData(data, filters);
    } catch (error) {
      console.error('Supersport API failed:', error);
      return [];
    }
  }

  private transformData(data: any, filters?: HighlightFilters): UnifiedHighlight[] {
    if (!data || !data.items || !Array.isArray(data.items)) {
      console.warn('Invalid Supersport API response format');
      return [];
    }

    return data.items
      .filter((item: any) => this.filterItem(item, filters))
      .map((item: any, index: number) => this.mapItemToHighlight(item, index));
  }

  private filterItem(item: any, filters?: HighlightFilters): boolean {
    if (!item) return false;

    // Apply competition filter
    if (filters?.competition && item.competition) {
      const itemCompetition = item.competition.toLowerCase();
      const filterCompetition = filters.competition.toLowerCase();
      if (!itemCompetition.includes(filterCompetition)) {
        return false;
      }
    }

    // Apply team filter
    if (filters?.team && item.homeTeam && item.awayTeam) {
      const searchTeam = filters.team.toLowerCase();
      const homeTeam = item.homeTeam.toLowerCase();
      const awayTeam = item.awayTeam.toLowerCase();

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
    return {
      id: `supersport_${item.id || `item_${index}_${Date.now()}`}`,
      title: item.title || 'Unknown Match',
      description: item.description || 'Football match highlights',
      thumbnailUrl: item.thumbnail || '/images/default-thumbnail.jpg',
      videoUrl: item.videoUrl || '',
      duration: item.duration || 180,
      competition: item.competition || 'Unknown Competition',
      teams: {
        home: item.homeTeam || 'Home Team',
        away: item.awayTeam || 'Away Team',
      },
      score: item.score ? {
        home: item.score.home || 0,
        away: item.score.away || 0,
      } : undefined,
      matchDate: new Date(item.date || Date.now()),
      views: item.views || 0,
      likes: item.likes || 0,
      provider: 'supersport',
      providerId: item.id || index.toString(),
      metadata: {
        quality: item.quality || 'hd',
        language: item.language || 'en',
        commentators: item.commentators || [],
        tags: item.tags || ['football', 'highlights'],
      },
    };
  }

  getProviderName(): string {
    return this.providerName;
  }

  async getLiveMatches(): Promise<any[]> {
    try {
      console.log('Fetching live matches from Supersport API...');

      const response = await fetch(`${this.baseUrl}/guide/v5.3/livenow?live=true`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Supersport live matches error: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Supersport live matches failed:', error);
      return [];
    }
  }

  async getCompetitions(): Promise<string[]> {
    try {
      // For Supersport, we might need to extract competitions from existing data
      // since there might not be a dedicated competitions endpoint
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

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'User-Agent': 'Football-Highlights-Platform/1.0',
      'Accept': 'application/json',
    };
  }

  // Helper method to get country-specific content
  async getHighlightsByCountry(countryCode: string = 'de'): Promise<UnifiedHighlight[]> {
    try {
      const response = await fetch(`${this.baseUrl}/guide/v5.3/livenow?countryCode=${countryCode}`, {
        headers: this.getHeaders(),
      });

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
}
