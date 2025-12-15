// lib/hooks/useHighlights.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type { UnifiedHighlight, HighlightFilters, HighlightsResponse } from "@/types/highlight";

interface UseHighlightsOptions {
  filters?: HighlightFilters;
  autoFetch?: boolean;
  cacheTime?: number;
}

interface UseHighlightsReturn {
  highlights: UnifiedHighlight[];
  featuredHighlights: UnifiedHighlight[];
  liveMatches: UnifiedHighlight[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  competitions: string[];
  teams: string[];
  refetch: () => Promise<void>;
  setFilters: (filters: HighlightFilters) => void;
  setPage: (page: number) => void;
  clearError: () => void;
}

export function useHighlights({
  filters = {},
  autoFetch = true,
  cacheTime = 5 * 60 * 1000, // 5 minutes
}: UseHighlightsOptions = {}): UseHighlightsReturn {
  const [highlights, setHighlights] = useState<UnifiedHighlight[]>([]);
  const [featuredHighlights, setFeaturedHighlights] = useState<UnifiedHighlight[]>([]);
  const [liveMatches, setLiveMatches] = useState<UnifiedHighlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPageState] = useState(filters.page || 1);
  const [pageSize, setPageSize] = useState(filters.pageSize || 20);
  const [hasMore, setHasMore] = useState(false);
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [currentFilters, setCurrentFilters] = useState<HighlightFilters>(filters);

  // Cache for API responses
  const [cache, setCache] = useState<Map<string, { data: any; timestamp: number }>>(new Map());

  const generateCacheKey = useCallback((endpoint: string, params?: any) => {
    const paramsString = params ? JSON.stringify(params) : "";
    return `${endpoint}_${paramsString}`;
  }, []);

  const getFromCache = useCallback((key: string) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }
    return null;
  }, [cache, cacheTime]);

  const setCacheData = useCallback((key: string, data: any) => {
    setCache(prev => new Map(prev).set(key, {
      data,
      timestamp: Date.now(),
    }));
  }, []);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  const fetchHighlights = useCallback(async (filtersToUse: HighlightFilters = currentFilters) => {
    setLoading(true);
    setError(null);

    try {
      const cacheKey = generateCacheKey("highlights", filtersToUse);
      const cachedData = getFromCache(cacheKey);

      if (cachedData) {
        const response = cachedData as HighlightsResponse;
        setHighlights(response.highlights);
        setTotalCount(response.totalCount);
        setPageSize(response.pageSize);
        setHasMore(response.hasMore);
        setLoading(false);
        return;
      }

      const queryParams = new URLSearchParams();

      if (filtersToUse.competition) {
        queryParams.append("competition", filtersToUse.competition);
      }
      if (filtersToUse.team) {
        queryParams.append("team", filtersToUse.team);
      }
      if (filtersToUse.date) {
        queryParams.append("date", filtersToUse.date);
      }
      if (filtersToUse.page) {
        queryParams.append("page", filtersToUse.page.toString());
      }
      if (filtersToUse.pageSize) {
        queryParams.append("pageSize", filtersToUse.pageSize.toString());
      }
      if (filtersToUse.provider) {
        queryParams.append("provider", filtersToUse.provider);
      }

      const response = await fetch(`/api/highlights?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch highlights: ${response.statusText}`);
      }

      const data: HighlightsResponse = await response.json();

      setHighlights(data.highlights);
      setTotalCount(data.totalCount);
      setPageSize(data.pageSize);
      setHasMore(data.hasMore);
      setCacheData(cacheKey, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch highlights");
      console.error("Error fetching highlights:", err);
    } finally {
      setLoading(false);
    }
  }, [currentFilters, generateCacheKey, getFromCache, setCacheData]);

  const fetchFeaturedHighlights = useCallback(async (limit: number = 6) => {
    try {
      const cacheKey = generateCacheKey("featured", { limit });
      const cachedData = getFromCache(cacheKey);

      if (cachedData) {
        setFeaturedHighlights(cachedData.highlights || cachedData);
        return;
      }

      const response = await fetch(`/api/highlights/featured?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch featured highlights: ${response.statusText}`);
      }

      const data = await response.json();
      setFeaturedHighlights(data.highlights);
      setCacheData(cacheKey, data);
    } catch (err) {
      console.error("Error fetching featured highlights:", err);
    }
  }, [generateCacheKey, getFromCache, setCacheData]);

  const fetchLiveMatches = useCallback(async (limit: number = 10) => {
    try {
      const cacheKey = generateCacheKey("live", { limit });
      const cachedData = getFromCache(cacheKey);

      if (cachedData) {
        setLiveMatches(cachedData.matches || cachedData);
        return;
      }

      const response = await fetch(`/api/highlights/live?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch live matches: ${response.statusText}`);
      }

      const data = await response.json();
      setLiveMatches(data.matches);
      setCacheData(cacheKey, data);
    } catch (err) {
      console.error("Error fetching live matches:", err);
    }
  }, [generateCacheKey, getFromCache, setCacheData]);

  const fetchCompetitions = useCallback(async () => {
    try {
      const cacheKey = generateCacheKey("competitions");
      const cachedData = getFromCache(cacheKey);

      if (cachedData) {
        setCompetitions(cachedData);
        return;
      }

      // Extract competitions from highlights if we have them
      if (highlights.length > 0) {
        const uniqueCompetitions = Array.from(
          new Set(highlights.map(h => h.competition).filter(Boolean))
        ).sort();
        setCompetitions(uniqueCompetitions);
        setCacheData(cacheKey, uniqueCompetitions);
      }
    } catch (err) {
      console.error("Error fetching competitions:", err);
    }
  }, [highlights, generateCacheKey, getFromCache, setCacheData]);

  const fetchTeams = useCallback(async () => {
    try {
      const cacheKey = generateCacheKey("teams");
      const cachedData = getFromCache(cacheKey);

      if (cachedData) {
        setTeams(cachedData);
        return;
      }

      // Extract teams from highlights if we have them
      if (highlights.length > 0) {
        const allTeams = new Set<string>();
        highlights.forEach(highlight => {
          if (highlight.teams.home) allTeams.add(highlight.teams.home);
          if (highlight.teams.away) allTeams.add(highlight.teams.away);
        });
        const uniqueTeams = Array.from(allTeams).filter(Boolean).sort();
        setTeams(uniqueTeams);
        setCacheData(cacheKey, uniqueTeams);
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  }, [highlights, generateCacheKey, getFromCache, setCacheData]);

  const refetch = useCallback(async () => {
    clearCache();
    await Promise.all([
      fetchHighlights(),
      fetchFeaturedHighlights(),
      fetchLiveMatches(),
    ]);
  }, [fetchHighlights, fetchFeaturedHighlights, fetchLiveMatches, clearCache]);

  const setFilters = useCallback((newFilters: HighlightFilters) => {
    setCurrentFilters(prev => ({ ...prev, ...newFilters }));
    if (newFilters.page !== undefined) {
      setPageState(newFilters.page);
    }
  }, []);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
    setFilters({ page: newPage });
  }, [setFilters]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initial data fetching
  useEffect(() => {
    if (autoFetch) {
      fetchHighlights();
      fetchFeaturedHighlights();
      fetchLiveMatches();
    }
  }, [autoFetch, fetchHighlights, fetchFeaturedHighlights, fetchLiveMatches]);

  // Update competitions and teams when highlights change
  useEffect(() => {
    if (highlights.length > 0) {
      fetchCompetitions();
      fetchTeams();
    }
  }, [highlights, fetchCompetitions, fetchTeams]);

  // Refetch when filters change
  useEffect(() => {
    if (autoFetch) {
      fetchHighlights();
    }
  }, [autoFetch, currentFilters, fetchHighlights]);

  return {
    highlights,
    featuredHighlights,
    liveMatches,
    loading,
    error,
    totalCount,
    page,
    pageSize,
    hasMore,
    competitions,
    teams,
    refetch,
    setFilters,
    setPage,
    clearError,
  };
}

// Hook for fetching highlights by competition
export function useHighlightsByCompetition(competition: string) {
  const [highlights, setHighlights] = useState<UnifiedHighlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHighlights = useCallback(async () => {
    if (!competition) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/highlights?competition=${encodeURIComponent(competition)}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch highlights for ${competition}: ${response.statusText}`);
      }

      const data = await response.json();
      setHighlights(Array.isArray(data) ? data : data.highlights || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch highlights");
      console.error(`Error fetching highlights for ${competition}:`, err);
    } finally {
      setLoading(false);
    }
  }, [competition]);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  return { highlights, loading, error, refetch: fetchHighlights };
}

// Hook for fetching highlights by team
export function useHighlightsByTeam(team: string) {
  const [highlights, setHighlights] = useState<UnifiedHighlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHighlights = useCallback(async () => {
    if (!team) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/highlights?team=${encodeURIComponent(team)}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch highlights for ${team}: ${response.statusText}`);
      }

      const data = await response.json();
      setHighlights(Array.isArray(data) ? data : data.highlights || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch highlights");
      console.error(`Error fetching highlights for ${team}:`, err);
    } finally {
      setLoading(false);
    }
  }, [team]);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  return { highlights, loading, error, refetch: fetchHighlights };
}

// Hook for fetching live matches
export function useLiveMatches(limit: number = 10) {
  const [matches, setMatches] = useState<UnifiedHighlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/highlights/live?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch live matches: ${response.statusText}`);
      }

      const data = await response.json();
      setMatches(data.matches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch live matches");
      console.error("Error fetching live matches:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchMatches();

    // Refresh live matches every 30 seconds
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  return { matches, loading, error, refetch: fetchMatches };
}

// Hook for fetching featured highlights
export function useFeaturedHighlights(limit: number = 6) {
  const [highlights, setHighlights] = useState<UnifiedHighlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHighlights = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/highlights/featured?limit=${limit}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch featured highlights: ${response.statusText}`);
      }

      const data = await response.json();
      setHighlights(data.highlights || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch featured highlights");
      console.error("Error fetching featured highlights:", err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  return { highlights, loading, error, refetch: fetchHighlights };
}
