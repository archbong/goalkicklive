// types/highlight.ts

export interface UnifiedHighlight {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  embedUrl?: string;
  duration: number;
  competition: string;
  teams: {
    home: string;
    away: string;
  };
  score?: {
    home: number;
    away: number;
  };
  matchDate: Date;
  date?: string;
  views: number;
  likes: number;
  provider: "supersport" | "scorebat";
  providerId: string;
  metadata: {
    quality: string;
    language?: string;
    commentators?: string[];
    tags: string[];
  };
}

export interface HighlightFilters {
  competition?: string;
  team?: string;
  date?: string;
  page?: number;
  pageSize?: number;
  provider?: "all" | "supersport" | "scorebat";
}

export interface HighlightsResponse {
  highlights: UnifiedHighlight[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  providers: {
    supersport: number;
    scorebat: number;
  };
}

export interface FilterOptions {
  competitions: Array<{
    value: string;
    label: string;
    country: string | null;
  }>;
  teams: Array<{
    value: string;
    label: string;
    country: string | null;
  }>;
  dateRange: {
    min: Date;
    max: Date;
  };
  providers: Array<{
    id: string;
    name: string;
    count: number;
  }>;
}

export interface VideoProvider {
  getHighlights(filters?: HighlightFilters): Promise<UnifiedHighlight[]>;
  getLiveMatches(): Promise<any[]>;
  getCompetitions(): Promise<string[]>;
  getTeams(): Promise<string[]>;
  getProviderName(): string;
}
