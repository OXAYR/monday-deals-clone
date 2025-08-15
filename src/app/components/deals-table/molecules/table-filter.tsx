/**
 * Table Filters Molecule
 * Comprehensive filtering controls for the deals table
 *
 * @format
 */

"use client";

import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "./dropdown";
import { FilterIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterConfig {
  stages: string[];
  priorities: string[];
  owners: string[];
  sources: string[];
  amountRange: { min: number; max: number };
  searchTerm: string;
}

interface TableFiltersProps {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
  uniqueValues: {
    stages: string[];
    priorities: string[];
    owners: string[];
    sources: string[];
  };
  showFilters: boolean;
  onToggleFilters: () => void;
}

export function TableFilters({
  filters,
  onFiltersChange,
  uniqueValues,
  showFilters,
  onToggleFilters,
}: TableFiltersProps) {
  const hasActiveFilters =
    filters.stages.length > 0 ||
    filters.priorities.length > 0 ||
    filters.owners.length > 0 ||
    filters.sources.length > 0 ||
    filters.searchTerm.length > 0 ||
    filters.amountRange.min > 0 ||
    filters.amountRange.max < 200000;

  const activeFilterCount = [
    filters.stages.length,
    filters.priorities.length,
    filters.owners.length,
    filters.sources.length,
    filters.searchTerm ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearFilters = () => {
    onFiltersChange({
      stages: [],
      priorities: [],
      owners: [],
      sources: [],
      amountRange: { min: 0, max: 200000 },
      searchTerm: "",
    });
  };

  const updateFilter = (key: keyof FilterConfig, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (
    key: "stages" | "priorities" | "owners" | "sources",
    value: string
  ) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 w-full sm:w-auto">
          <Input
            placeholder="Search deals, companies, owners..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            className="w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFilters}
            className={cn(
              "flex-1 sm:flex-none",
              hasActiveFilters && "bg-primary/10 border-primary"
            )}
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <XIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg border">
          {/* Stage Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="justify-between w-full bg-transparent"
              >
                Stage ({filters.stages.length})
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {uniqueValues.stages.map((stage) => (
                <DropdownMenuCheckboxItem
                  key={stage}
                  checked={filters.stages.includes(stage)}
                  onCheckedChange={() => toggleArrayFilter("stages", stage)}
                >
                  {stage}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="justify-between w-full bg-transparent"
              >
                Priority ({filters.priorities.length})
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {uniqueValues.priorities.map((priority) => (
                <DropdownMenuCheckboxItem
                  key={priority}
                  checked={filters.priorities.includes(priority)}
                  onCheckedChange={() =>
                    toggleArrayFilter("priorities", priority)
                  }
                >
                  {priority}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Owner Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="justify-between w-full bg-transparent"
              >
                Owner ({filters.owners.length})
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {uniqueValues.owners.map((owner) => (
                <DropdownMenuCheckboxItem
                  key={owner}
                  checked={filters.owners.includes(owner)}
                  onCheckedChange={() => toggleArrayFilter("owners", owner)}
                >
                  {owner}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Source Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="justify-between w-full bg-transparent"
              >
                Source ({filters.sources.length})
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              {uniqueValues.sources.map((source) => (
                <DropdownMenuCheckboxItem
                  key={source}
                  checked={filters.sources.includes(source)}
                  onCheckedChange={() => toggleArrayFilter("sources", source)}
                >
                  {source}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
