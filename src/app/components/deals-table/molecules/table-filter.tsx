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
import { cn } from "../../../lib/utils";

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
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 w-full sm:w-auto">
          <Input
            placeholder="Search deals, companies, owners..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            className="w-full sm:w-64"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <XIcon className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Clear All</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Dropdowns */}
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
          <DropdownMenuContent align="start" className="w-48">
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
          <DropdownMenuContent align="start" className="w-48">
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
          <DropdownMenuContent align="start" className="w-48">
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
          <DropdownMenuContent align="start" className="w-48">
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

      {/* Amount Range Filter */}
      <div className="p-4 bg-muted/30 rounded-lg border">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Amount Range
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Min Amount
            </label>
            <Input
              type="number"
              placeholder="0"
              value={filters.amountRange.min}
              onChange={(e) =>
                updateFilter("amountRange", {
                  ...filters.amountRange,
                  min: Number(e.target.value) || 0,
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">
              Max Amount
            </label>
            <Input
              type="number"
              placeholder="200000"
              value={filters.amountRange.max}
              onChange={(e) =>
                updateFilter("amountRange", {
                  ...filters.amountRange,
                  max: Number(e.target.value) || 200000,
                })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <span className="text-sm font-medium text-primary">
            Active Filters:
          </span>
          {filters.stages.map((stage) => (
            <Badge key={stage} variant="secondary" className="text-xs">
              Stage: {stage}
            </Badge>
          ))}
          {filters.priorities.map((priority) => (
            <Badge key={priority} variant="secondary" className="text-xs">
              Priority: {priority}
            </Badge>
          ))}
          {filters.owners.map((owner) => (
            <Badge key={owner} variant="secondary" className="text-xs">
              Owner: {owner}
            </Badge>
          ))}
          {filters.sources.map((source) => (
            <Badge key={source} variant="secondary" className="text-xs">
              Source: {source}
            </Badge>
          ))}
          {filters.searchTerm && (
            <Badge variant="secondary" className="text-xs">
              Search: "{filters.searchTerm}"
            </Badge>
          )}
          {(filters.amountRange.min > 0 ||
            filters.amountRange.max < 200000) && (
            <Badge variant="secondary" className="text-xs">
              Amount: ${filters.amountRange.min.toLocaleString()} - $
              {filters.amountRange.max.toLocaleString()}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
