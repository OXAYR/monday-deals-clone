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
  MessageSquareIcon,
  FileTextIcon,
  ClockIcon,
  UserIcon,
  CopyIcon,
  TrashIcon,
  FilterIcon,
  SettingsIcon,
  SearchIcon,
  PlusIcon,
} from "lucide-react";
import { format } from "date-fns";

// Import atomic design components
import { Button } from "./deals-table/atoms/button";
import { Checkbox } from "./deals-table/atoms/checkbox";
import { Input } from "./deals-table/atoms/input";
import { Badge } from "./deals-table/atoms/badge";
import { ThemeToggle } from "./deals-table/atoms/theme-toggle";
import { Select } from "./deals-table/molecules/select";
import { ThemeProvider } from "./deals-table/hooks/use-theme";
import { NewDealForm } from "./deals-table/molecules/new-deal-form";

// Import types
import type {
  Deal,
  ColumnConfig,
  SortConfig,
  FilterConfig,
} from "./deals-table/types";
import {
  DEFAULT_COLUMNS,
  SAMPLE_DEALS,
  stageOptions,
  priorityOptions,
} from "./deals-table/types/static-data";

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

  const uniqueOwners = useMemo(
    () => [...new Set(deals.map((deal) => deal.owner.name))],
    [deals]
  );
  const uniqueSources = useMemo(
    () => [...new Set(deals.map((deal) => deal.source))],
    [deals]
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

  const filteredAndSortedDeals = useMemo(() => {
    const filtered = deals.filter((deal) => {
      // Search term filter with improved matching
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          deal.name.toLowerCase().includes(searchLower) ||
          deal.company.toLowerCase().includes(searchLower) ||
          deal.owner.name.toLowerCase().includes(searchLower) ||
          deal.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Multi-criteria filtering
      if (filters.stages.length > 0 && !filters.stages.includes(deal.stage))
        return false;
      if (
        filters.priorities.length > 0 &&
        !filters.priorities.includes(deal.priority)
      )
        return false;
      if (
        filters.owners.length > 0 &&
        !filters.owners.includes(deal.owner.name)
      )
        return false;
      if (filters.sources.length > 0 && !filters.sources.includes(deal.source))
        return false;

      // Amount range filtering
      const amount = Number.parseFloat(deal.amount.replace(/[$,]/g, ""));
      if (amount < filters.amountRange.min || amount > filters.amountRange.max)
        return false;

      return true;
    });

    // Multi-level sorting implementation
    if (sortConfigs.length > 0) {
      filtered.sort((a, b) => {
        for (const config of sortConfigs) {
          let aVal = a[config.key];
          let bVal = b[config.key];

          // Handle nested owner object
          if (config.key === "owner") {
            aVal = (a.owner as any).name;
            bVal = (b.owner as any).name;
          }

          // Handle amount parsing for numerical comparison
          if (config.key === "amount") {
            aVal = Number.parseFloat((aVal as string).replace(/[$,]/g, ""));
            bVal = Number.parseFloat((bVal as string).replace(/[$,]/g, ""));
          }

          // Date comparison
          if (config.key === "closeDate") {
            aVal = new Date(aVal as string).getTime();
            bVal = new Date(bVal as string).getTime();
          }

          // String comparison (case-insensitive)
          if (typeof aVal === "string") {
            aVal = aVal.toLowerCase();
            bVal = (bVal as string).toLowerCase();
          }

          if (aVal < bVal) return config.direction === "asc" ? -1 : 1;
          if (aVal > bVal) return config.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [deals, sortConfigs, filters]);

  const visibleColumns = useMemo(
    () => columns.filter((col) => col.visible),
    [columns]
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
            <div className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
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
              <span className="text-sm text-slate-900 dark:text-slate-100 truncate hidden sm:inline">
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
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 text-right">
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

  const ExpandedRowDetails = React.memo(({ deal }: { deal: Deal }) => {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
        <div className="p-6 border-l-4 border-l-slate-500 dark:border-l-slate-400">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Deal Details Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                Deal Details
              </h4>
              {deal.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {deal.description}
                </p>
              )}
              {deal.contact && (
                <div className="space-y-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {deal.contact.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquareIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {deal.contact.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {deal.contact.phone}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Activity Timeline Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ClockIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                Recent Activity
              </h4>
              <div className="space-y-3">
                {deal.activities?.slice(0, 3).map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <MessageSquareIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {activity.type}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        {format(new Date(activity.date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    No recent activity
                  </p>
                )}
              </div>
            </div>

            {/* Files Section */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileTextIcon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                Files ({deal.files?.length || 0})
              </h4>
              <div className="space-y-2">
                {deal.files?.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                  >
                    <FileTextIcon className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-900 dark:text-slate-100 flex-1 truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                      {file.size}
                    </span>
                  </div>
                )) || (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    No files attached
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  const totalsData = useMemo(() => {
    const deals = filteredAndSortedDeals;
    const totalValue = deals.reduce(
      (sum, deal) => sum + Number.parseFloat(deal.amount.replace(/[$,]/g, "")),
      0
    );
    const weightedValue = deals.reduce((sum, deal) => {
      const amount = Number.parseFloat(deal.amount.replace(/[$,]/g, ""));
      return sum + (amount * deal.probability) / 100;
    }, 0);
    const avgProbability =
      deals.length > 0
        ? deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length
        : 0;

    return {
      totalDeals: deals.length,
      totalValue,
      weightedValue,
      avgProbability,
      wonDeals: deals.filter((deal) => deal.stage === "Won").length,
      lostDeals: deals.filter((deal) => deal.stage === "Lost").length,
    };
  }, [filteredAndSortedDeals]);

  return (
    <div className="w-full h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-6 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Deals Pipeline
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {totalsData.totalDeals} deals • {selectedRows.size} selected • $
              {totalsData.totalValue.toLocaleString()} total value
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search deals, companies, owners..."
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchTerm: e.target.value,
                  }))
                }
                className="pl-10 w-72"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
              {(filters.stages.length > 0 || filters.priorities.length > 0) && (
                <Badge variant="secondary" size="sm" className="ml-2">
                  {filters.stages.length + filters.priorities.length}
                </Badge>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnSettings(!showColumnSettings)}
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              Columns
            </Button>

            <ThemeToggle />

            <Button
              variant="default"
              size="sm"
              onClick={() => setShowNewDealModal(true)}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Deal
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Stage
                </label>
                <Select
                  value=""
                  placeholder="Select stages..."
                  options={stageOptions}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      stages: prev.stages.includes(value)
                        ? prev.stages.filter((s) => s !== value)
                        : [...prev.stages, value],
                    }));
                  }}
                />
                {filters.stages.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.stages.map((stage) => (
                      <Badge
                        key={stage}
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            stages: prev.stages.filter((s) => s !== stage),
                          }))
                        }
                      >
                        {stage} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Priority
                </label>
                <Select
                  value=""
                  placeholder="Select priorities..."
                  options={priorityOptions}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      priorities: prev.priorities.includes(value)
                        ? prev.priorities.filter((p) => p !== value)
                        : [...prev.priorities, value],
                    }));
                  }}
                />
                {filters.priorities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.priorities.map((priority) => (
                      <Badge
                        key={priority}
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            priorities: prev.priorities.filter(
                              (p) => p !== priority
                            ),
                          }))
                        }
                      >
                        {priority} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Owner
                </label>
                <Select
                  value=""
                  placeholder="Select owners..."
                  options={uniqueOwners.map((owner) => ({
                    value: owner,
                    label: owner,
                  }))}
                  onValueChange={(value) => {
                    setFilters((prev) => ({
                      ...prev,
                      owners: prev.owners.includes(value)
                        ? prev.owners.filter((o) => o !== value)
                        : [...prev.owners, value],
                    }));
                  }}
                />
                {filters.owners.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.owners.map((owner) => (
                      <Badge
                        key={owner}
                        variant="secondary"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            owners: prev.owners.filter((o) => o !== owner),
                          }))
                        }
                      >
                        {owner} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Amount Range
                </label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Min amount"
                    value={filters.amountRange.min}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        amountRange: {
                          ...prev.amountRange,
                          min: Number(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Max amount"
                    value={filters.amountRange.max}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        amountRange: {
                          ...prev.amountRange,
                          max: Number(e.target.value) || 200000,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {filteredAndSortedDeals.length} of {deals.length} deals shown
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({
                    stages: [],
                    priorities: [],
                    owners: [],
                    sources: [],
                    amountRange: { min: 0, max: 200000 },
                    searchTerm: "",
                  });
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {showColumnSettings && (
          <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {columns
                .filter((col) => col.key !== "expand" && col.key !== "select")
                .map((column) => (
                  <label
                    key={column.key}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={column.visible}
                      onCheckedChange={() => toggleColumnVisibility(column.key)}
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {column.label}
                    </span>
                  </label>
                ))}
            </div>
            <div className="flex justify-end mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setColumns(DEFAULT_COLUMNS);
                }}
              >
                Reset to Default
              </Button>
            </div>
          </div>
        )}
      </div>

      {selectedRows.size > 0 && (
        <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleBulkDuplicate}>
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
                onClick={handleBulkDelete}
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <table className="w-full min-w-max">
            <thead className="bg-slate-100 dark:bg-slate-800 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 last:border-r-0"
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
                      ) : (
                        <button
                          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors group"
                          onClick={(e) =>
                            handleSort(column.key as keyof Deal, e)
                          }
                        >
                          <span className="truncate text-sm">
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

            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
              {filteredAndSortedDeals.map((deal, rowIndex) => (
                <React.Fragment key={deal.id}>
                  <tr
                    className={`
                        hover:bg-slate-50 dark:hover:bg-slate-800/50 
                        transition-all duration-150 cursor-pointer
                        ${
                          selectedRows.has(deal.id)
                            ? "bg-slate-100 dark:bg-slate-800 border-l-4 border-l-slate-500 dark:border-l-slate-400"
                            : ""
                        }
                      `}
                    onClick={(e) => handleRowSelection(deal.id, rowIndex, e)}
                  >
                    {visibleColumns.map((column) => (
                      <td
                        key={`${deal.id}-${column.key}`}
                        className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0"
                        style={{
                          width: `${column.width}px`,
                          minWidth: `${column.minWidth}px`,
                        }}
                      >
                        {renderCell(deal, column)}
                      </td>
                    ))}
                  </tr>

                  {expandedRows.has(deal.id) && (
                    <tr>
                      <td colSpan={visibleColumns.length} className="p-0">
                        <ExpandedRowDetails deal={deal} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>

          {filteredAndSortedDeals.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-slate-400 dark:text-slate-600 mb-4">
                <SearchIcon className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
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
                className="mt-4"
                onClick={() => setShowNewDealModal(true)}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Deal
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-6 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {totalsData.totalDeals}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Deals
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${totalsData.totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total Value
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${Math.round(totalsData.weightedValue).toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Weighted Value
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(totalsData.avgProbability)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Avg Probability
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalsData.wonDeals}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Won
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {totalsData.lostDeals}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Lost
            </div>
          </div>
        </div>
      </div>

      {showNewDealModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
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
