/** @format */

import React from "react";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import {
  FilterIcon,
  SettingsIcon,
  PlusIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

interface DealsTableTopBarProps {
  totalsData: any;
  selectedRows: Set<string>;
  onNewDeal: () => void;
  filters: any;
  setFilters: (filters: any) => void;
  uniqueValues: any;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  showHeaderFilters: boolean;
  setShowHeaderFilters: (show: boolean) => void;
  headerFilters: Record<string, any>;
  clearHeaderFilters: () => void;
  ThemeToggle: React.ComponentType;
  TableFilters: React.ComponentType<any>;
}

function DealsTableTitleStats({ totalsData, selectedRows }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Deals</h1>
        <p className="text-sm text-muted-foreground">
          {selectedRows.size > 0
            ? `${selectedRows.size} selected`
            : `${totalsData.totalDeals} total deals`}
        </p>
      </div>
      {selectedRows.size > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" size="sm">
            ${totalsData.totalValue.toLocaleString()} selected
          </Badge>
        </div>
      )}
    </div>
  );
}

function DealsTableActions({
  ThemeToggle,
  onNewDeal,
  showHeaderFilters,
  setShowHeaderFilters,
  headerFilters,
  clearHeaderFilters,
}: any) {
  const hasActiveHeaderFilters = Object.values(headerFilters).some(
    (value) => value && value !== ""
  );

  const activeFilterCount = Object.values(headerFilters).filter(
    (value) => value && value !== ""
  ).length;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowHeaderFilters(!showHeaderFilters)}
        className={`flex items-center gap-2 transition-all duration-200 ${
          showHeaderFilters ? "bg-primary/10 border-primary/30" : ""
        }`}
      >
        {showHeaderFilters ? (
          <EyeOffIcon className="h-4 w-4" />
        ) : (
          <EyeIcon className="h-4 w-4" />
        )}
        Header Filters
        {hasActiveHeaderFilters && (
          <Badge
            variant="secondary"
            size="sm"
            className="ml-1 bg-primary/10 text-primary border-primary/20"
          >
            {activeFilterCount}
          </Badge>
        )}
      </Button>
      {hasActiveHeaderFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHeaderFilters}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear All
        </Button>
      )}
      <ThemeToggle />
      <Button
        variant="default"
        size="sm"
        onClick={onNewDeal}
        className="shadow-md"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        New Deal
      </Button>
    </div>
  );
}

function DealsTableFilters({
  filters,
  setFilters,
  uniqueValues,
  showFilters,
  setShowFilters,
  TableFilters,
}: any) {
  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
          Close
        </Button>
      </div>
      <TableFilters
        filters={filters}
        setFilters={setFilters}
        uniqueValues={uniqueValues}
      />
    </div>
  );
}

export function DealsTableTopBar({
  totalsData,
  selectedRows,
  onNewDeal,
  filters,
  setFilters,
  uniqueValues,
  showFilters,
  setShowFilters,
  showHeaderFilters,
  setShowHeaderFilters,
  headerFilters,
  clearHeaderFilters,
  ThemeToggle,
  TableFilters,
}: DealsTableTopBarProps) {
  return (
    <div className="bg-card/90 border-b border-border px-4 py-6 sm:px-8 flex flex-col gap-4 shadow-lg sticky top-0 z-30 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <DealsTableTitleStats
          totalsData={totalsData}
          selectedRows={selectedRows}
        />
        <DealsTableActions
          ThemeToggle={ThemeToggle}
          onNewDeal={onNewDeal}
          showHeaderFilters={showHeaderFilters}
          setShowHeaderFilters={setShowHeaderFilters}
          headerFilters={headerFilters}
          clearHeaderFilters={clearHeaderFilters}
        />
      </div>
      {showFilters && (
        <DealsTableFilters
          filters={filters}
          setFilters={setFilters}
          uniqueValues={uniqueValues}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          TableFilters={TableFilters}
        />
      )}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <FilterIcon className="h-4 w-4" />
          {showFilters ? "Hide" : "Show"} Filters
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <SettingsIcon className="h-4 w-4" />
          Column Settings
        </Button>
      </div>
    </div>
  );
}
