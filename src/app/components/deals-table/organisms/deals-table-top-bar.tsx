/** @format */

import React from "react";
import { Button } from "../atoms/button";
import { PlusIcon } from "lucide-react";

function DealsTableTitleStats({ totalsData, selectedRows }: any) {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight drop-shadow-sm">
        Deals Pipeline
      </h1>
      <p className="text-base text-slate-600 dark:text-slate-400 mt-2 font-medium">
        {totalsData.totalDeals} deals • {selectedRows.size} selected • $
        {totalsData.totalValue.toLocaleString()} total value
      </p>
    </div>
  );
}

function DealsTableActions({ ThemeToggle, onNewDeal }: any) {
  return (
    <div className="flex flex-wrap items-center gap-3">
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
    <div className="rounded-xl shadow-md bg-gradient-to-r from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      <TableFilters
        filters={filters}
        onFiltersChange={setFilters}
        uniqueValues={uniqueValues}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((v: boolean) => !v)}
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
  ThemeToggle,
  TableFilters,
}: any) {
  return (
    <div className="bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-4 py-6 sm:px-8 flex flex-col gap-4 shadow-lg sticky top-0 z-30 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <DealsTableTitleStats
          totalsData={totalsData}
          selectedRows={selectedRows}
        />
        <DealsTableActions ThemeToggle={ThemeToggle} onNewDeal={onNewDeal} />
      </div>
      <DealsTableFilters
        filters={filters}
        setFilters={setFilters}
        uniqueValues={uniqueValues}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        TableFilters={TableFilters}
      />
    </div>
  );
}
