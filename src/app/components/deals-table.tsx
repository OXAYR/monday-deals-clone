/** @format */

"use client";

/**
 * Professional Monday.com-style Deals Table
 *
 * A comprehensive CRM deals management interface built with:
 * - Atomic Design Principles (Atoms, Molecules, Organisms)
 * - Dark Mode Support with System Preference Detection
 * - Professional Developer Color Schemes
 * - Responsive Design with Mobile-First Approach
 * - Advanced Features: Sorting, Filtering, Bulk Actions, Expandable Rows
 *
 * Architecture:
 * - TypeScript for type safety and developer experience
 * - Custom hooks for state management and theme handling
 * - Modular component structure for maintainability
 * - Performance optimized with React.memo and useCallback
 */

import React, { useState, useCallback, useMemo } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CopyIcon,
  TrashIcon,
  SearchIcon,
  PlusIcon,
} from "lucide-react";
import { format } from "date-fns";

// Import atomic design components
import { Button } from "./deals-table/atoms/button";
import { Checkbox } from "./deals-table/atoms/checkbox";

import { Badge } from "./deals-table/atoms/badge";
import { ThemeToggle } from "./deals-table/atoms/theme-toggle";
import { Select } from "./deals-table/molecules/select";
import { ThemeProvider } from "./deals-table/hooks/use-theme";
import { NewDealForm } from "./deals-table/molecules/new-deal-form";
import { TableFilters } from "./deals-table/molecules/table-filter";

import { DealsTableTopBar } from "./deals-table/organisms/deals-table-top-bar";
import { DealsTableBody } from "./deals-table/organisms/deals-table-body";
import ExpandedRowDetails from "./deals-table/organisms/expanded-row-details";

// Import types
import type {
  Deal,
  ColumnConfig,
  SortConfig,
  FilterConfig,
} from "./deals-table/types";
import { DEFAULT_COLUMNS, SAMPLE_DEALS } from "./deals-table/types/static-data";
import {
  filterDeals,
  sortDeals,
  calculateTotals,
  getUniqueValues,
} from "./deals-table/services/deal-table.service";

/**
 * Main Deals Table Component
 * Implements comprehensive CRM functionality with professional UX
 */
function DealsTableCore() {
  const [deals, setDeals] = useState<Deal[]>(SAMPLE_DEALS);
  const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);
  const [filters, setFilters] = useState<FilterConfig>({
    stages: [],
    priorities: [],
    owners: [],
    sources: [],
    amountRange: { min: 0, max: 200000 },
    searchTerm: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null
  );
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [rowDeleteConfirm, setRowDeleteConfirm] = useState<string | null>(null);

  // Unique values for filters
  const uniqueValues = useMemo(() => getUniqueValues(deals), [deals]);

  // Filtering and sorting using service
  const filteredDeals = useMemo(
    () => filterDeals(deals, filters),
    [deals, filters]
  );
  const filteredAndSortedDeals = useMemo(
    () => sortDeals(filteredDeals, sortConfigs),
    [filteredDeals, sortConfigs]
  );

  // Totals using service
  const totalsData = useMemo(
    () => calculateTotals(filteredAndSortedDeals),
    [filteredAndSortedDeals]
  );

  const handleCreateDeal = useCallback((dealData: Partial<Deal>) => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      name: dealData.name || "",
      stage: dealData.stage || "New",
      owner: dealData.owner || { name: "Current User", initials: "CU" },
      company: dealData.company || "",
      amount: dealData.amount || "$0",
      probability: dealData.probability || 50,
      closeDate: dealData.closeDate || new Date().toISOString().split("T")[0],
      lastActivity: new Date().toISOString().split("T")[0],
      priority: dealData.priority || "Medium",
      source: dealData.source || "Direct",
      tags: dealData.tags || [],
      description: dealData.description,
      activities: [],
      files: [],
    };

    setDeals((prev) => [newDeal, ...prev]);
    setShowNewDealModal(false);
  }, []);

  const handleBulkDelete = useCallback(() => {
    setDeals((prev) => prev.filter((deal) => !selectedRows.has(deal.id)));
    setSelectedRows(new Set());
  }, [selectedRows]);

  const handleBulkDuplicate = useCallback(() => {
    const dealsToDuplicate = deals.filter((deal) => selectedRows.has(deal.id));
    const duplicatedDeals = dealsToDuplicate.map((deal) => ({
      ...deal,
      id: `${deal.id}-copy-${Date.now()}`,
      name: `${deal.name} (Copy)`,
    }));
    setDeals((prev) => [...duplicatedDeals, ...prev]);
    setSelectedRows(new Set());
  }, [deals, selectedRows]);

  const toggleColumnVisibility = useCallback((columnKey: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === columnKey ? { ...col, visible: !col.visible } : col
      )
    );
  }, []);

  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible),
    [columns]
  );

  // Add an Actions column to the visibleColumns array for rendering
  const visibleColumnsWithActions = useMemo(
    () => [
      ...visibleColumns,
      {
        key: "actions",
        label: "Actions",
        visible: true,
        width: 80,
        minWidth: 60,
        resizable: false,
      },
    ],
    [visibleColumns]
  );

  const handleSort = useCallback((key: keyof Deal, event: React.MouseEvent) => {
    const isShiftClick = event.shiftKey;

    setSortConfigs((prev) => {
      const existingIndex = prev.findIndex((config) => config.key === key);

      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        if (existing.direction === "asc") {
          // Change to descending
          return prev.map((config, index) =>
            index === existingIndex
              ? { ...config, direction: "desc" as const }
              : config
          );
        } else {
          // Remove this sort config
          return prev.filter((_, index) => index !== existingIndex);
        }
      } else {
        // Add new sort config
        const newConfig: SortConfig = {
          key,
          direction: "asc",
          priority: prev.length,
        };

        return isShiftClick ? [...prev, newConfig] : [newConfig];
      }
    });
  }, []);

  const handleRowSelection = useCallback(
    (dealId: string, index: number, event: React.MouseEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;

      setSelectedRows((prev) => {
        const newSelection = new Set(prev);

        if (isShift && lastSelectedIndex !== null) {
          // Shift-click: select range
          const start = Math.min(lastSelectedIndex, index);
          const end = Math.max(lastSelectedIndex, index);

          for (let i = start; i <= end; i++) {
            if (filteredAndSortedDeals[i]) {
              newSelection.add(filteredAndSortedDeals[i].id);
            }
          }
        } else if (isCtrlOrCmd) {
          // Ctrl/Cmd-click: toggle individual
          if (newSelection.has(dealId)) {
            newSelection.delete(dealId);
          } else {
            newSelection.add(dealId);
          }
          setLastSelectedIndex(index);
        } else {
          // Regular click: select only this one
          newSelection.clear();
          newSelection.add(dealId);
          setLastSelectedIndex(index);
        }

        return newSelection;
      });
    },
    [lastSelectedIndex, filteredAndSortedDeals]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedRows(new Set(filteredAndSortedDeals.map((deal) => deal.id)));
      } else {
        setSelectedRows(new Set());
      }
      setLastSelectedIndex(null);
    },
    [filteredAndSortedDeals]
  );

  // Selection state calculations
  const isAllSelected =
    filteredAndSortedDeals.length > 0 &&
    filteredAndSortedDeals.every((deal) => selectedRows.has(deal.id));
  const isIndeterminate = selectedRows.size > 0 && !isAllSelected;

  const toggleRowExpansion = useCallback((dealId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
      } else {
        newSet.add(dealId);
      }
      return newSet;
    });
  }, []);

  const getSortIcon = useCallback(
    (key: keyof Deal) => {
      const config = sortConfigs.find((c) => c.key === key);
      if (!config) return null;

      return config.direction === "asc" ? (
        <ArrowUpIcon className="h-3 w-3 ml-1 text-slate-600 dark:text-slate-400" />
      ) : (
        <ArrowDownIcon className="h-3 w-3 ml-1 text-slate-600 dark:text-slate-400" />
      );
    },
    [sortConfigs]
  );

  const getSortPriority = useCallback(
    (key: keyof Deal) => {
      const config = sortConfigs.find((c) => c.key === key);
      return config && sortConfigs.length > 1 ? config.priority + 1 : null;
    },
    [sortConfigs]
  );

  const updateDealField = useCallback(
    (dealId: string, field: keyof Deal, value: any) => {
      setDeals((prev) =>
        prev.map((deal) =>
          deal.id === dealId ? { ...deal, [field]: value } : deal
        )
      );
    },
    []
  );

  const stageOptions = [
    { value: "New", label: "New", color: "#64748b" },
    { value: "Qualified", label: "Qualified", color: "#3b82f6" },
    { value: "Proposal", label: "Proposal", color: "#f59e0b" },
    { value: "Negotiation", label: "Negotiation", color: "#ef4444" },
    { value: "Won", label: "Won", color: "#10b981" },
    { value: "Lost", label: "Lost", color: "#6b7280" },
  ];

  const priorityOptions = [
    { value: "Low", label: "Low", color: "#10b981" },
    { value: "Medium", label: "Medium", color: "#f59e0b" },
    { value: "High", label: "High", color: "#ef4444" },
    { value: "Critical", label: "Critical", color: "#dc2626" },
  ];

  const renderCell = useCallback(
    (deal: Deal, column: ColumnConfig) => {
      switch (column.key) {
        case "expand":
          return (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                toggleRowExpansion(deal.id);
              }}
            >
              {expandedRows.has(deal.id) ? (
                <ChevronDownIcon className="h-4 w-4" />
              ) : (
                <ChevronRightIcon className="h-4 w-4" />
              )}
            </Button>
          );
        case "select":
          return (
            <Checkbox
              checked={selectedRows.has(deal.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedRows((prev) => new Set([...prev, deal.id]));
                } else {
                  setSelectedRows((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(deal.id);
                    return newSet;
                  });
                }
              }}
            />
          );
        case "name":
          return (
            <div className="font-medium text-foreground truncate max-w-[200px]">
              {deal.name}
            </div>
          );
        case "stage":
          return (
            <Select
              value={deal.stage}
              onValueChange={(value) =>
                updateDealField(deal.id, "stage", value)
              }
              options={stageOptions}
              className="min-w-[120px]"
            />
          );
        case "owner":
          return (
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
                {deal.owner.initials}
              </div>
              <span className="text-sm text-foreground truncate hidden sm:inline">
                {deal.owner.name}
              </span>
            </div>
          );
        case "company":
          return (
            <div className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
              {deal.company}
            </div>
          );
        case "amount":
          return (
            <div className="text-sm font-semibold text-foreground text-right">
              {deal.amount}
            </div>
          );
        case "probability":
          return (
            <div className="flex items-center gap-2 min-w-[120px]">
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-slate-500 to-slate-700 dark:from-slate-400 dark:to-slate-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${deal.probability}%` }}
                />
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400 w-8 text-right">
                {deal.probability}%
              </span>
            </div>
          );
        case "closeDate":
          return (
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {format(new Date(deal.closeDate), "MMM d")}
            </div>
          );
        case "priority":
          return (
            <Select
              value={deal.priority}
              onValueChange={(value) =>
                updateDealField(deal.id, "priority", value)
              }
              options={priorityOptions}
              className="min-w-[100px]"
            />
          );
        case "source":
          return (
            <div className="text-sm text-slate-700 dark:text-slate-300 truncate">
              {deal.source}
            </div>
          );
        case "tags":
          return (
            <div className="flex gap-1 flex-wrap max-w-[140px]">
              {deal.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
              {deal.tags.length > 2 && (
                <Badge variant="outline" size="sm">
                  +{deal.tags.length - 2}
                </Badge>
              )}
            </div>
          );
        default:
          return (
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {String(deal[column.key as keyof Deal] || "")}
            </span>
          );
      }
    },
    [selectedRows, expandedRows, updateDealField, toggleRowExpansion]
  );

  return (
    <div className="w-full min-h-screen  flex flex-col transition-colors duration-200">
      <DealsTableTopBar
        totalsData={totalsData}
        selectedRows={selectedRows}
        onNewDeal={() => setShowNewDealModal(true)}
        filters={filters}
        setFilters={setFilters}
        uniqueValues={uniqueValues}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        ThemeToggle={ThemeToggle}
        TableFilters={TableFilters}
      />
      {/* Table Section */}
      <div className="flex-1 w-full pt-6">
        <div className="shadow-xl overflow-hidden bg-card border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 sticky top-0 z-10 border-b border-border">
                <tr>
                  {visibleColumnsWithActions.map((column) => (
                    <th
                      key={column.key}
                      className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300 border-r border-border last:border-r-0 whitespace-nowrap select-none"
                      style={{
                        width: `${column.width}px`,
                        minWidth: `${column.minWidth}px`,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {column.key === "select" ? (
                          <Checkbox
                            checked={isAllSelected}
                            indeterminate={isIndeterminate}
                            onCheckedChange={handleSelectAll}
                          />
                        ) : column.key === "expand" ? (
                          <span></span>
                        ) : column.key === "actions" ? (
                          <span>Actions</span>
                        ) : (
                          <button
                            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                            onClick={(e) =>
                              handleSort(column.key as keyof Deal, e)
                            }
                          >
                            <span className="truncate text-base font-semibold">
                              {column.label}
                            </span>
                            {getSortIcon(column.key as keyof Deal)}
                            {getSortPriority(column.key as keyof Deal) && (
                              <Badge
                                variant="secondary"
                                size="sm"
                                className="ml-1"
                              >
                                {getSortPriority(column.key as keyof Deal)}
                              </Badge>
                            )}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <DealsTableBody
                deals={filteredAndSortedDeals}
                columns={visibleColumns}
                selectedRows={selectedRows}
                expandedRows={expandedRows}
                rowDeleteConfirm={rowDeleteConfirm}
                onRowClick={handleRowSelection}
                onDelete={(dealId: string) => {
                  setDeals((prev) => prev.filter((d) => d.id !== dealId));
                  setRowDeleteConfirm(null);
                  setSelectedRows((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(dealId);
                    return newSet;
                  });
                }}
                onDeleteConfirm={(dealId: string) =>
                  setRowDeleteConfirm((prev) =>
                    prev === dealId ? null : dealId
                  )
                }
                renderCell={renderCell}
                ExpandedRowDetails={ExpandedRowDetails}
                onExpand={(dealId: string) => toggleRowExpansion(dealId)}
                onSelect={(dealId: string, rowIndex: number) =>
                  handleRowSelection(dealId, rowIndex, {
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: false,
                  } as any)
                }
              />
            </table>
            {filteredAndSortedDeals.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="text-slate-400 dark:text-slate-600 mb-4">
                  <SearchIcon className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No deals found
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center max-w-md">
                  {filters.searchTerm ||
                  filters.stages.length > 0 ||
                  filters.priorities.length > 0
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Get started by creating your first deal."}
                </p>
                <Button
                  variant="default"
                  size="sm"
                  className="mt-4 shadow-md"
                  onClick={() => setShowNewDealModal(true)}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Deal
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Totals Bar Section */}
      <div className="bg-background/90 dark:bg-slate-900/90 border-t border-border px-4 py-6 sm:px-8 shadow-inner">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground drop-shadow-sm">
              {totalsData.totalDeals}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Deals
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
              ${totalsData.totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Value
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary dark:text-primary-400 drop-shadow-sm">
              ${Math.round(totalsData.weightedValue).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Weighted Value
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary dark:text-primary-400 drop-shadow-sm">
              {Math.round(totalsData.avgProbability)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Avg Probability
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 drop-shadow-sm">
              {totalsData.wonDeals}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Won
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 drop-shadow-sm">
              {totalsData.lostDeals}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Lost
            </div>
          </div>
        </div>
      </div>

      {/* Modal for New Deal */}
      {showNewDealModal && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                Create New Deal
              </h2>
            </div>
            <div className="p-6">
              <NewDealForm
                onSubmit={handleCreateDeal}
                onCancel={() => setShowNewDealModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Bar - visually prominent, animated, with confirmation bar */}
      {selectedRows.size > 0 && !showDeleteConfirm && (
        <div className="fixed left-0 right-0 top-20 z-40 flex justify-center animate-in fade-in-0 slide-in-from-top-4 duration-200">
          <div className="bg-gradient-to-r from-red-50 to-slate-100 dark:from-red-900/60 dark:to-slate-800/80 border border-red-200 dark:border-red-700 rounded-xl shadow-2xl px-8 py-4 flex items-center gap-6 max-w-2xl w-full mx-4">
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold text-foreground">
                {selectedRows.size} deal{selectedRows.size !== 1 ? "s" : ""}{" "}
                selected
              </span>
              <Badge variant="secondary" size="sm">
                $
                {filteredAndSortedDeals
                  .filter((deal) => selectedRows.has(deal.id))
                  .reduce(
                    (sum, deal) =>
                      sum + Number.parseFloat(deal.amount.replace(/[$,]/g, "")),
                    0
                  )
                  .toLocaleString()}{" "}
                total
              </Badge>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDuplicate}
                className="hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <CopyIcon className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Select
                placeholder="Change Stage"
                options={stageOptions}
                onValueChange={(value) => {
                  selectedRows.forEach((dealId) => {
                    updateDealField(dealId, "stage", value);
                  });
                  setSelectedRows(new Set());
                }}
                className="w-32"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="hover:bg-red-600 hover:text-white transition-colors"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Bar */}
      {selectedRows.size > 0 && showDeleteConfirm && (
        <div className="fixed left-0 right-0 top-20 z-50 flex justify-center animate-in fade-in-0 slide-in-from-top-4 duration-200">
          <div className="bg-red-100 dark:bg-red-900/80 border border-red-300 dark:border-red-700 rounded-xl shadow-2xl px-8 py-4 flex items-center gap-6 max-w-2xl w-full mx-4">
            <span className="text-base font-semibold text-red-800 dark:text-red-200">
              Are you sure you want to delete {selectedRows.size} deal
              {selectedRows.size !== 1 ? "s" : ""}? This action cannot be
              undone.
            </span>
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                className="hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  handleBulkDelete();
                  setShowDeleteConfirm(false);
                }}
                className="hover:bg-red-600 hover:text-white transition-colors"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Main Export with Theme Provider Wrapper
 * Ensures proper theme context for all child components
 */
export function DealsTable() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="deals-table-theme">
      <DealsTableCore />
    </ThemeProvider>
  );
}
