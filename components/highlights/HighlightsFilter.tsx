"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterOptions } from "@/types/highlight";
import useRTL from "@/hooks/useRTL";

interface HighlightsFilterProps {
  filterOptions: FilterOptions;
  locale: string;
}

export default function HighlightsFilter({
  filterOptions,
  locale,
}: HighlightsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isRTL, direction } = useRTL();
  const [selectedCompetition, setSelectedCompetition] = useState<string>(
    searchParams.get("competition") || "",
  );
  const [selectedTeam, setSelectedTeam] = useState<string>(
    searchParams.get("team") || "",
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    searchParams.get("date") || "",
  );

  // Update URL when filters change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (selectedCompetition) {
        params.set("competition", selectedCompetition);
      } else {
        params.delete("competition");
      }

      if (selectedTeam) {
        params.set("team", selectedTeam);
      } else {
        params.delete("team");
      }

      if (selectedDate) {
        params.set("date", selectedDate);
      } else {
        params.delete("date");
      }

      // Reset to page 1 when filters change
      params.set("page", "1");

      router.push(`/${locale}/highlights?${params.toString()}`, {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    selectedCompetition,
    selectedTeam,
    selectedDate,
    router,
    searchParams,
    locale,
  ]);

  const clearFilters = () => {
    setSelectedCompetition("");
    setSelectedTeam("");
    setSelectedDate("");
  };

  const hasActiveFilters = selectedCompetition || selectedTeam || selectedDate;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8" dir={direction}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Filter Highlights
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {isRTL ? "مسح الكل" : "Clear all"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Competition Filter */}
        <div>
          <label
            htmlFor="competition"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {isRTL ? "البطولة" : "Competition"}
          </label>
          <select
            id="competition"
            value={selectedCompetition}
            onChange={(e) => setSelectedCompetition(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          >
            <option value="">
              {isRTL ? "كل البطولات" : "All competitions"}
            </option>
            {filterOptions.competitions.map((competition) => (
              <option key={competition.value} value={competition.value}>
                {competition.label}
              </option>
            ))}
          </select>
        </div>

        {/* Team Filter */}
        <div>
          <label
            htmlFor="team"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {isRTL ? "الفريق" : "Team"}
          </label>
          <select
            id="team"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          >
            <option value="">{isRTL ? "كل الفرق" : "All teams"}</option>
            {filterOptions.teams.map((team) => (
              <option key={team.value} value={team.value}>
                {team.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {isRTL ? "التاريخ" : "Date"}
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={filterOptions.dateRange.min.toISOString().split("T")[0]}
            max={filterOptions.dateRange.max.toISOString().split("T")[0]}
            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedCompetition && (
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {isRTL ? "البطولة: " : "Competition: "}
              {
                filterOptions.competitions.find(
                  (c) => c.value === selectedCompetition,
                )?.label
              }
              <button
                onClick={() => setSelectedCompetition("")}
                className={
                  isRTL
                    ? "mr-2 rounded-full hover:bg-blue-200 p-1"
                    : "ml-2 rounded-full hover:bg-blue-200 p-1"
                }
              >
                ×
              </button>
            </span>
          )}
          {selectedTeam && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              {isRTL ? "الفريق: " : "Team: "}
              {filterOptions.teams.find((t) => t.value === selectedTeam)?.label}
              <button
                onClick={() => setSelectedTeam("")}
                className={
                  isRTL
                    ? "mr-2 rounded-full hover:bg-green-200 p-1"
                    : "ml-2 rounded-full hover:bg-green-200 p-1"
                }
              >
                ×
              </button>
            </span>
          )}
          {selectedDate && (
            <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
              {isRTL ? "التاريخ: " : "Date: "}
              {new Date(selectedDate).toLocaleDateString(locale)}
              <button
                onClick={() => setSelectedDate("")}
                className={
                  isRTL
                    ? "mr-2 rounded-full hover:bg-purple-200 p-1"
                    : "ml-2 rounded-full hover:bg-purple-200 p-1"
                }
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
