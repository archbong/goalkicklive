"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterOptions } from "@/types/highlight";
import useRTL from "@/hooks/useRTL";
import { X, Search, Filter, Calendar, ChevronDown } from "lucide-react";

interface AdvancedHighlightsFilterProps {
  filterOptions: FilterOptions;
  locale: string;
}

interface FilterState {
  selectedCompetitions: string[];
  selectedTeams: string[];
  dateRange: {
    from: string;
    to: string;
  };
  searchQuery: string;
  selectedProvider: string;
}

export default function AdvancedHighlightsFilter({
  filterOptions,
  locale,
}: AdvancedHighlightsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isRTL, direction } = useRTL();

  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    selectedCompetitions: searchParams.get('competitions')?.split(',') || [],
    selectedTeams: searchParams.get('teams')?.split(',') || [],
    dateRange: {
      from: searchParams.get('dateFrom') || '',
      to: searchParams.get('dateTo') || '',
    },
    searchQuery: searchParams.get('search') || '',
    selectedProvider: searchParams.get('provider') || 'all',
  });

  // Update URL when filters change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      // Update competitions
      if (filters.selectedCompetitions.length > 0) {
        params.set('competitions', filters.selectedCompetitions.join(','));
        params.delete('competition');
      } else {
        params.delete('competitions');
      }

      // Update teams
      if (filters.selectedTeams.length > 0) {
        params.set('teams', filters.selectedTeams.join(','));
        params.delete('team');
      } else {
        params.delete('teams');
      }

      // Update date range
      if (filters.dateRange.from) {
        params.set('dateFrom', filters.dateRange.from);
      } else {
        params.delete('dateFrom');
      }

      if (filters.dateRange.to) {
        params.set('dateTo', filters.dateRange.to);
      } else {
        params.delete('dateTo');
      }

      // Update search
      if (filters.searchQuery) {
        params.set('search', filters.searchQuery);
      } else {
        params.delete('search');
      }

      // Update provider
      if (filters.selectedProvider && filters.selectedProvider !== 'all') {
        params.set('provider', filters.selectedProvider);
      } else {
        params.delete('provider');
      }

      // Reset to page 1 when filters change
      params.set('page', '1');

      router.push(`/${locale}/highlights?${params.toString()}`, {
        scroll: false,
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, router, searchParams, locale]);

  const clearFilters = () => {
    setFilters({
      selectedCompetitions: [],
      selectedTeams: [],
      dateRange: { from: '', to: '' },
      searchQuery: '',
      selectedProvider: 'all',
    });
  };

  const hasActiveFilters =
    filters.selectedCompetitions.length > 0 ||
    filters.selectedTeams.length > 0 ||
    filters.dateRange.from ||
    filters.dateRange.to ||
    filters.searchQuery ||
    filters.selectedProvider !== 'all';

  const toggleCompetition = (competition: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCompetitions: prev.selectedCompetitions.includes(competition)
        ? prev.selectedCompetitions.filter(c => c !== competition)
        : [...prev.selectedCompetitions, competition]
    }));
  };

  const toggleTeam = (team: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTeams: prev.selectedTeams.includes(team)
        ? prev.selectedTeams.filter(t => t !== team)
        : [...prev.selectedTeams, team]
    }));
  };

  const getCompetitionLabel = (value: string) => {
    return filterOptions.competitions.find(c => c.value === value)?.label || value;
  };

  const getTeamLabel = (value: string) => {
    return filterOptions.teams.find(t => t.value === value)?.label || value;
  };

  const getProviderLabel = (id: string) => {
    const provider = filterOptions.providers.find(p => p.id === id);
    return provider ? `${provider.name} (${provider.count})` : id;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Filter className="h-6 w-6 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {isRTL ? "تصفية المباريات" : "Filter Highlights"}
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              {isRTL ? "مسح الكل" : "Clear all"}
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center"
          >
            {isExpanded ? (isRTL ? "إخفاء" : "Hide") : (isRTL ? "عرض الكل" : "Show all")}
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isRTL ? "بحث" : "Search"}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder={isRTL ? "ابحث عن مباراة أو فريق..." : "Search matches or teams..."}
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Provider Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isRTL ? "المزود" : "Provider"}
        </label>
        <select
          value={filters.selectedProvider}
          onChange={(e) => setFilters(prev => ({ ...prev, selectedProvider: e.target.value }))}
          className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        >
          <option value="all">{isRTL ? "جميع المزودين" : "All providers"}</option>
          {filterOptions.providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {getProviderLabel(provider.id)}
            </option>
          ))}
        </select>
      </div>

      {/* Basic Filters (Always visible) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Competitions - Quick select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isRTL ? "البطولات الشائعة" : "Popular Competitions"}
          </label>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                toggleCompetition(e.target.value);
              }
            }}
            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          >
            <option value="">{isRTL ? "إضافة بطولة" : "Add competition"}</option>
            {filterOptions.competitions.slice(0, 10).map((competition) => (
              <option key={competition.value} value={competition.value}>
                {competition.label}
              </option>
            ))}
          </select>
        </div>

        {/* Teams - Quick select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isRTL ? "الفرق الشائعة" : "Popular Teams"}
          </label>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                toggleTeam(e.target.value);
              }
            }}
            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          >
            <option value="">{isRTL ? "إضافة فريق" : "Add team"}</option>
            {filterOptions.teams.slice(0, 10).map((team) => (
              <option key={team.value} value={team.value}>
                {team.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isRTL ? "نطاق التاريخ" : "Date Range"}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              placeholder={isRTL ? "من" : "From"}
              value={filters.dateRange.from}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, from: e.target.value }
              }))}
              min={filterOptions.dateRange.min.toISOString().split('T')[0]}
              max={filterOptions.dateRange.max.toISOString().split('T')[0]}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              placeholder={isRTL ? "إلى" : "To"}
              value={filters.dateRange.to}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                dateRange: { ...prev.dateRange, to: e.target.value }
              }))}
              min={filterOptions.dateRange.min.toISOString().split('T')[0]}
              max={filterOptions.dateRange.max.toISOString().split('T')[0]}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-6 border-t pt-6">
          {/* Competitions Multi-select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {isRTL ? "جميع البطولات" : "All Competitions"}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {filterOptions.competitions.map((competition) => (
                <label key={competition.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.selectedCompetitions.includes(competition.value)}
                    onChange={() => toggleCompetition(competition.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {competition.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Teams Multi-select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {isRTL ? "جميع الفرق" : "All Teams"}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {filterOptions.teams.map((team) => (
                <label key={team.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.selectedTeams.includes(team.value)}
                    onChange={() => toggleTeam(team.value)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {team.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {isRTL ? "التصفيات النشطة" : "Active Filters"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {/* Competition chips */}
            {filters.selectedCompetitions.map((competition) => (
              <span
                key={competition}
                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
              >
                {isRTL ? "البطولة: " : "Competition: "}
                {getCompetitionLabel(competition)}
                <button
                  onClick={() => toggleCompetition(competition)}
                  className="ml-2 rounded-full hover:bg-blue-200 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {/* Team chips */}
            {filters.selectedTeams.map((team) => (
              <span
                key={team}
                className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
              >
                {isRTL ? "الفريق: " : "Team: "}
                {getTeamLabel(team)}
                <button
                  onClick={() => toggleTeam(team)}
                  className="ml-2 rounded-full hover:bg-green-200 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            {/* Date range chips */}
            {filters.dateRange.from && filters.dateRange.to && (
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                {isRTL ? "التاريخ: " : "Date: "}
                {new Date(filters.dateRange.from).toLocaleDateString(locale)} - {new Date(filters.dateRange.to).toLocaleDateString(locale)}
                <button
                  onClick={() => setFilters(prev => ({
                    ...prev,
                    dateRange: { from: '', to: '' }
                  }))}
                  className="ml-2 rounded-full hover:bg-purple-200 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* Search chip */}
            {filters.searchQuery && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                {isRTL ? "بحث: " : "Search: "}
                {filters.searchQuery}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                  className="ml-2 rounded-full hover:bg-yellow-200 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {/* Provider chip */}
            {filters.selectedProvider !== 'all' && (
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                {isRTL ? "المزود: " : "Provider: "}
                {getProviderLabel(filters.selectedProvider)}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, selectedProvider: 'all' }))}
                  className="ml-2 rounded-full hover:bg-red-200 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
