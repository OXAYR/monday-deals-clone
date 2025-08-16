/** @format */

import React, { useState } from "react";
import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { Checkbox } from "../atoms/checkbox";
import {
  FilterIcon,
  SettingsIcon,
  PlusIcon,
  EyeIcon,
  EyeOffIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
  columns: any[];
  setColumns: (columns: any[]) => void;
  onColumnHide: (columnKey: string) => void;
  onColumnMove: (columnKey: string, direction: "left" | "right") => void;
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
        onFiltersChange={setFilters}
        uniqueValues={uniqueValues}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />
    </div>
  );
}

function ColumnSettingsModal({
  columns,
  setColumns,
  onColumnHide,
  onColumnMove,
  onClose,
}: {
  columns: any[];
  setColumns: (columns: any[]) => void;
  onColumnHide: (columnKey: string) => void;
  onColumnMove: (columnKey: string, direction: "left" | "right") => void;
  onClose: () => void;
}) {
  // Get all available columns (including hidden ones)
  const allColumns = [
    { key: "select", label: "Select", width: 50, minWidth: 50 },
    { key: "expand", label: "Expand", width: 50, minWidth: 50 },
    { key: "name", label: "Name", width: 200, minWidth: 150 },
    { key: "company", label: "Company", width: 150, minWidth: 120 },
    { key: "stage", label: "Stage", width: 120, minWidth: 100 },
    { key: "owner", label: "Owner", width: 120, minWidth: 100 },
    { key: "amount", label: "Amount", width: 120, minWidth: 100 },
    { key: "probability", label: "Probability", width: 100, minWidth: 80 },
    { key: "closeDate", label: "Close Date", width: 120, minWidth: 100 },
    { key: "lastActivity", label: "Last Activity", width: 120, minWidth: 100 },
    { key: "priority", label: "Priority", width: 100, minWidth: 80 },
    { key: "source", label: "Source", width: 120, minWidth: 100 },
    { key: "actions", label: "Actions", width: 80, minWidth: 60 },
  ];

  const [localColumns, setLocalColumns] = useState(columns);

  const handleColumnToggle = (columnKey: string, visible: boolean) => {
    if (visible) {
      // Show column - find it in the allColumns list and add it back
      const originalColumn = allColumns.find((col) => col.key === columnKey);
      if (originalColumn) {
        setLocalColumns((prev) => [...prev, originalColumn]);
      }
    } else {
      // Hide column
      setLocalColumns((prev) => prev.filter((col) => col.key !== columnKey));
    }
  };

  const handleSave = () => {
    setColumns(localColumns);
    onClose();
  };

  const handleReset = () => {
    setLocalColumns(columns);
  };

  const handleMoveColumn = (columnKey: string, direction: "left" | "right") => {
    setLocalColumns((prev) => {
      const currentIndex = prev.findIndex((col) => col.key === columnKey);
      if (currentIndex === -1) return prev;

      const newColumns = [...prev];
      const targetIndex =
        direction === "left"
          ? Math.max(0, currentIndex - 1)
          : Math.min(newColumns.length - 1, currentIndex + 1);

      if (targetIndex === currentIndex) return prev;

      const [movedColumn] = newColumns.splice(currentIndex, 1);
      newColumns.splice(targetIndex, 0, movedColumn);

      return newColumns;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 border border-border animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              Column Settings
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-semibold text-foreground">
                Visible Columns
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Reset
                </Button>
                <Button variant="default" size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {allColumns.map((column, index) => {
                const isVisible = localColumns.some(
                  (col) => col.key === column.key
                );
                const currentIndex = localColumns.findIndex(
                  (col) => col.key === column.key
                );

                return (
                  <div
                    key={column.key}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isVisible ? "bg-muted/30" : "bg-muted/10 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isVisible}
                        onCheckedChange={(checked) =>
                          handleColumnToggle(column.key, checked as boolean)
                        }
                      />
                      <span
                        className={`text-sm font-medium ${
                          isVisible
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {column.label}
                      </span>
                    </div>
                    {isVisible && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveColumn(column.key, "left")}
                          disabled={currentIndex <= 0}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronLeftIcon className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveColumn(column.key, "right")}
                          disabled={currentIndex >= localColumns.length - 1}
                          className="h-6 w-6 p-0"
                        >
                          <ChevronRightIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
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
  columns,
  setColumns,
  onColumnHide,
  onColumnMove,
}: DealsTableTopBarProps) {
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  return (
    <>
      <div className="bg-card/90 border-b border-border px-4 py-6 sm:px-8 flex flex-col gap-4 rounded-lg shadow-lg border border-border sticky top-0 z-30 backdrop-blur-md">
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
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowColumnSettings(true)}
          >
            <SettingsIcon className="h-4 w-4" />
            Column Settings
          </Button>
        </div>
      </div>
      {showColumnSettings && (
        <ColumnSettingsModal
          columns={columns}
          setColumns={setColumns}
          onColumnHide={onColumnHide}
          onColumnMove={onColumnMove}
          onClose={() => setShowColumnSettings(false)}
        />
      )}
    </>
  );
}
