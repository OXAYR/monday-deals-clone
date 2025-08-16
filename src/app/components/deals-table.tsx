/** @format */

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "lucide-react";
import { format } from "date-fns";

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
import { ExpandedRowDetails } from "./deals-table/organisms/expanded-row-details";

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
import HelpTooltip from "./deals-table/atoms/help-tooltip";
import TotalsBar from "./deals-table/molecules/totals-bar";
import DragIndicator from "./deals-table/atoms/drag-indicator";
import FilterStatusIndicator from "./deals-table/molecules/filter-status-indicator";
import SortStatusIndicator from "./deals-table/molecules/sort-status-indicator";
import ContextMenu from "./deals-table/molecules/context-menu";
import { DeleteConfirmDialog } from "./deals-table/molecules/delete-confirmation-dialog";
import { BulkActionsToolbar } from "./deals-table/organisms/bulk-action-bar";
import { NoDealsFound } from "./deals-table/molecules/no-deal-found";
import { DealsTableHeaderCell } from "./deals-table/organisms/deals-table-header";

function DealsTableCore() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const showDragDrop = isDesktop;

  useEffect(() => {
    const updateResponsiveState = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    updateResponsiveState();
    window.addEventListener("resize", updateResponsiveState);
    return () => window.removeEventListener("resize", updateResponsiveState);
  }, []);

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
  const [editingCell, setEditingCell] = useState<{
    dealId: string;
    field: keyof Deal;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [contextMenu, setContextMenu] = useState<{
    type: "header" | "row";
    x: number;
    y: number;
    target: any;
  } | null>(null);
  const [focusedCell, setFocusedCell] = useState<{
    rowIndex: number;
    colIndex: number;
  } | null>(null);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState<number>(0);
  const [resizeStartWidth, setResizeStartWidth] = useState<number>(0);
  const [draggingColumn, setDraggingColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [draggingRow, setDraggingRow] = useState<string | null>(null);
  const [dragOverRow, setDragOverRow] = useState<string | null>(null);
  const [headerFilters, setHeaderFilters] = useState<Record<string, any>>({});
  const [showHeaderFilters, setShowHeaderFilters] = useState(false);

  const getResponsiveColumns = useCallback(() => {
    if (isMobile) {
      return columns.filter(
        (col) =>
          ![
            "select",
            "expand",
            "company",
            "probability",
            "source",
            "actions",
          ].includes(col.key)
      );
    } else if (isTablet) {
      return columns.filter(
        (col) => !["select", "expand", "source"].includes(col.key)
      );
    }
    return columns;
  }, [columns, isMobile, isTablet]);

  const responsiveColumns = getResponsiveColumns();

  useEffect(() => {
    try {
      const savedState = localStorage.getItem("deals-table-state");
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.sortConfigs) setSortConfigs(parsed.sortConfigs);
        if (parsed.filters) setFilters(parsed.filters);
        if (parsed.columns) setColumns(parsed.columns);
        if (parsed.showFilters !== undefined)
          setShowFilters(parsed.showFilters);
        if (parsed.headerFilters) setHeaderFilters(parsed.headerFilters);
        if (parsed.showHeaderFilters !== undefined)
          setShowHeaderFilters(parsed.showHeaderFilters);
      }
    } catch (error) {
      console.warn("Failed to load saved state:", error);
    }
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (contextMenu) {
        if (e.key === "Escape") {
          closeContextMenu();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [contextMenu, closeContextMenu]);

  const uniqueValues = useMemo(() => getUniqueValues(deals), [deals]);

  const enhancedFilteredDeals = useMemo(() => {
    let filtered = filterDeals(deals, filters);

    Object.entries(headerFilters).forEach(([columnKey, filterValue]) => {
      if (filterValue && filterValue !== "") {
        filtered = filtered.filter((deal) => {
          const cellValue = deal[columnKey as keyof Deal];
          if (typeof cellValue === "string") {
            return cellValue.toLowerCase().includes(filterValue.toLowerCase());
          }
          return String(cellValue)
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        });
      }
    });

    return filtered;
  }, [deals, filters, headerFilters]);

  const filteredAndSortedDeals = useMemo(
    () => sortDeals(enhancedFilteredDeals, sortConfigs),
    [enhancedFilteredDeals, sortConfigs]
  );

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

  const handleActivityAdd = useCallback((dealId: string, activity: any) => {
    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === dealId
          ? {
              ...deal,
              activities: [...(deal.activities || []), activity],
              lastActivity: new Date().toISOString().split("T")[0],
            }
          : deal
      )
    );
  }, []);

  const handleFileUpload = useCallback((dealId: string, file: File) => {
    const newFile = {
      id: Date.now(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.name.split(".").pop() || "file",
      file: file,
    };

    setDeals((prev) =>
      prev.map((deal) =>
        deal.id === dealId
          ? {
              ...deal,
              files: [...(deal.files || []), newFile],
            }
          : deal
      )
    );
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

  // Keyboard shortcuts for selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "a" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSelectAll(true);
      } else if (e.key === "Escape") {
        setSelectedRows(new Set());
        setLastSelectedIndex(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSelectAll]);

  // Selection state calculations
  const isAllSelected =
    filteredAndSortedDeals.length > 0 &&
    filteredAndSortedDeals.every((deal) => selectedRows.has(deal.id));
  const isIndeterminate = selectedRows.size > 0 && !isAllSelected;

  // Calculate totals for selected rows
  const selectedTotals = useMemo(() => {
    const selectedDeals = deals.filter((deal) => selectedRows.has(deal.id));
    return {
      count: selectedDeals.length,
      totalValue: selectedDeals.reduce(
        (sum, deal) =>
          sum + Number.parseFloat(deal.amount.replace(/[$,]/g, "")),
        0
      ),
      avgProbability:
        selectedDeals.length > 0
          ? selectedDeals.reduce((sum, deal) => sum + deal.probability, 0) /
            selectedDeals.length
          : 0,
      stages: [...new Set(selectedDeals.map((deal) => deal.stage))],
      priorities: [...new Set(selectedDeals.map((deal) => deal.priority))],
    };
  }, [deals, selectedRows]);

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
    (key: string) => {
      const config = sortConfigs.find((c) => c.key === key);
      if (!config) return null;

      return config.direction === "asc" ? (
        <ArrowUpIcon className="h-3 w-3 ml-1 text-primary transition-colors" />
      ) : (
        <ArrowDownIcon className="h-3 w-3 ml-1 text-primary transition-colors" />
      );
    },
    [sortConfigs]
  );

  const getSortPriority = useCallback(
    (key: string) => {
      const config = sortConfigs.find((c) => c.key === key);
      return config && sortConfigs.length > 1 ? config.priority + 1 : null;
    },
    [sortConfigs]
  );

  const getSortTooltip = useCallback(
    (key: string) => {
      const config = sortConfigs.find((c) => c.key === key);
      if (!config) return "Click to sort, Shift+Click to add to sort";

      const direction = config.direction === "asc" ? "ascending" : "descending";
      const priority =
        sortConfigs.length > 1
          ? ` (${config.priority + 1} of ${sortConfigs.length})`
          : "";
      return `Sorted ${direction}${priority}. Click to change, Shift+Click to add another sort`;
    },
    [sortConfigs]
  );

  const getSortButtonClass = useCallback(
    (key: string) => {
      const config = sortConfigs.find((c) => c.key === key);
      const baseClass =
        "flex items-center gap-1 hover:text-primary transition-colors group focus:outline-none focus:ring-2 focus:ring-primary rounded flex-1";

      if (!config) {
        return `${baseClass} text-muted-foreground hover:text-primary`;
      }

      return `${baseClass} text-primary font-medium`;
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

  // Enhanced bulk actions
  const handleBulkAction = useCallback(
    (
      action:
        | "delete"
        | "duplicate"
        | "changeStage"
        | "changePriority"
        | "export",
      value?: string
    ) => {
      switch (action) {
        case "delete":
          setShowDeleteConfirm(true);
          break;
        case "duplicate":
          handleBulkDuplicate();
          break;
        case "changeStage":
          if (value) {
            selectedRows.forEach((dealId) => {
              updateDealField(dealId, "stage", value);
            });
            setSelectedRows(new Set());
          }
          break;
        case "changePriority":
          if (value) {
            selectedRows.forEach((dealId) => {
              updateDealField(dealId, "priority", value);
            });
            setSelectedRows(new Set());
          }
          break;
        case "export":
          // Export selected deals
          const selectedDeals = deals.filter((deal) =>
            selectedRows.has(deal.id)
          );
          const csvContent = [
            [
              "Name",
              "Company",
              "Stage",
              "Priority",
              "Amount",
              "Probability",
              "Close Date",
              "Owner",
            ],
            ...selectedDeals.map((deal) => [
              deal.name,
              deal.company,
              deal.stage,
              deal.priority,
              deal.amount,
              deal.probability,
              deal.closeDate,
              deal.owner.name,
            ]),
          ]
            .map((row) => row.join(","))
            .join("\n");

          const blob = new Blob([csvContent], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `deals-export-${
            new Date().toISOString().split("T")[0]
          }.csv`;
          a.click();
          window.URL.revokeObjectURL(url);
          break;
      }
    },
    [selectedRows, deals, updateDealField, handleBulkDuplicate]
  );

  const handleCellClick = useCallback(
    (dealId: string, field: string, currentValue: any) => {
      // Don't allow editing for certain fields
      if (field === "select" || field === "expand" || field === "actions") {
        return;
      }
      setEditingCell({ dealId, field: field as keyof Deal });
      setEditValue(String(currentValue || ""));
    },
    []
  );

  const handleCellEdit = useCallback(
    (dealId: string, field: keyof Deal, value: any) => {
      updateDealField(dealId, field, value);
      setEditingCell(null);
      setEditValue("");
    },
    [updateDealField]
  );

  const handleCellCancel = useCallback(() => {
    setEditingCell(null);
    setEditValue("");
  }, []);

  const handleCellKeyDown = useCallback(
    (e: React.KeyboardEvent, dealId: string, field: keyof Deal) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleCellEdit(dealId, field, editValue);
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleCellCancel();
      } else if (e.key === "Tab") {
        e.preventDefault();
        // Move to next editable cell
        const currentRowIndex = filteredAndSortedDeals.findIndex(
          (deal) => deal.id === dealId
        );
        const currentColIndex = visibleColumnsWithActions.findIndex(
          (col) => col.key === field
        );

        if (e.shiftKey) {
          // Move to previous cell
          if (currentColIndex > 0) {
            const prevColumn = visibleColumnsWithActions[currentColIndex - 1];
            if (
              prevColumn.key !== "select" &&
              prevColumn.key !== "expand" &&
              prevColumn.key !== "actions"
            ) {
              const deal = filteredAndSortedDeals[currentRowIndex];
              const dealKey = prevColumn.key as keyof Deal;
              handleCellClick(dealId, prevColumn.key as string, deal[dealKey]);
            }
          }
        } else {
          // Move to next cell
          if (currentColIndex < visibleColumnsWithActions.length - 1) {
            const nextColumn = visibleColumnsWithActions[currentColIndex + 1];
            if (
              nextColumn.key !== "select" &&
              nextColumn.key !== "expand" &&
              nextColumn.key !== "actions"
            ) {
              const deal = filteredAndSortedDeals[currentRowIndex];
              const dealKey = nextColumn.key as keyof Deal;
              handleCellClick(dealId, nextColumn.key as string, deal[dealKey]);
            }
          }
        }
      }
    },
    [
      editValue,
      handleCellEdit,
      handleCellCancel,
      filteredAndSortedDeals,
      visibleColumnsWithActions,
      handleCellClick,
    ]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, type: "header" | "row", target: any) => {
      e.preventDefault();
      e.stopPropagation();

      // Calculate position to ensure menu stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const menuWidth = 200; // Approximate menu width
      const menuHeight = type === "header" ? 120 : 80; // Approximate menu height

      let x = e.clientX;
      let y = e.clientY;

      // Adjust if menu would go off-screen
      if (x + menuWidth > viewportWidth) {
        x = viewportWidth - menuWidth - 10;
      }
      if (y + menuHeight > viewportHeight) {
        y = viewportHeight - menuHeight - 10;
      }

      setContextMenu({
        type,
        x,
        y,
        target,
      });
    },
    []
  );

  const handleColumnHide = useCallback(
    (columnKey: string) => {
      toggleColumnVisibility(columnKey);
      closeContextMenu();
    },
    [toggleColumnVisibility, closeContextMenu]
  );

  const handleColumnMove = useCallback(
    (columnKey: string, direction: "left" | "right") => {
      setColumns((prev) => {
        const currentIndex = prev.findIndex((col) => col.key === columnKey);
        if (currentIndex === -1) return prev;

        const newColumns = [...prev];
        const targetIndex =
          direction === "left" ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex >= 0 && targetIndex < newColumns.length) {
          const [movedColumn] = newColumns.splice(currentIndex, 1);
          newColumns.splice(targetIndex, 0, movedColumn);
        }

        return newColumns;
      });
      closeContextMenu();
    },
    [closeContextMenu]
  );

  const handleRowDuplicate = useCallback(
    (dealId: string) => {
      const dealToDuplicate = deals.find((d) => d.id === dealId);
      if (dealToDuplicate) {
        const duplicatedDeal = {
          ...dealToDuplicate,
          id: `${dealToDuplicate.id}-copy-${Date.now()}`,
          name: `${dealToDuplicate.name} (Copy)`,
        };
        setDeals((prev) => [duplicatedDeal, ...prev]);
      }
      closeContextMenu();
    },
    [deals, closeContextMenu]
  );

  const handleRowDelete = useCallback(
    (dealId: string) => {
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
      setSelectedRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(dealId);
        return newSet;
      });
      closeContextMenu();
    },
    [closeContextMenu]
  );

  const handleRowEdit = useCallback(
    (dealId: string) => {
      // Find the first editable field and start editing
      const deal = deals.find((d) => d.id === dealId);
      if (deal) {
        const firstEditableColumn = visibleColumnsWithActions.find(
          (col) =>
            col.key !== "select" &&
            col.key !== "expand" &&
            col.key !== "actions"
        );
        if (firstEditableColumn) {
          const dealKey = firstEditableColumn.key as keyof Deal;
          handleCellClick(dealId, firstEditableColumn.key, deal[dealKey]);
        }
      }
      closeContextMenu();
    },
    [deals, visibleColumnsWithActions, handleCellClick, closeContextMenu]
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

  const getStageColor = useCallback(
    (stage: string) => {
      const option = stageOptions.find((opt) => opt.value === stage);
      return option?.color || "#64748b";
    },
    [stageOptions]
  );

  const getPriorityColor = useCallback(
    (priority: string) => {
      const option = priorityOptions.find((opt) => opt.value === priority);
      return option?.color || "#f59e0b";
    },
    [priorityOptions]
  );

  const getStageTooltip = useCallback((stage: string) => {
    const stageInfo = {
      New: "Deal is newly created and needs qualification",
      Qualified: "Deal has been qualified and is ready for proposal",
      Proposal: "Proposal has been sent to the prospect",
      Negotiation: "Currently negotiating terms and conditions",
      Won: "Deal has been successfully closed",
      Lost: "Deal was lost to competition or other factors",
    };
    return stageInfo[stage as keyof typeof stageInfo] || "Unknown stage";
  }, []);

  const getPriorityTooltip = useCallback((priority: string) => {
    const priorityInfo = {
      Low: "Low priority - can be addressed later",
      Medium: "Medium priority - standard attention required",
      High: "High priority - needs immediate attention",
      Critical: "Critical priority - urgent action required",
    };
    return (
      priorityInfo[priority as keyof typeof priorityInfo] || "Unknown priority"
    );
  }, []);

  const renderCell = useCallback(
    (deal: Deal, column: ColumnConfig) => {
      const isEditing =
        editingCell?.dealId === deal.id && editingCell?.field === column.key;

      switch (column.key) {
        case "expand":
          return (
            <div
              title={
                expandedRows.has(deal.id)
                  ? "Collapse details"
                  : "Expand details"
              }
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 transition-all duration-200 hover:bg-muted/50 ${
                  expandedRows.has(deal.id)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRowExpansion(deal.id);
                }}
              >
                {expandedRows.has(deal.id) ? (
                  <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4 transition-transform duration-200" />
                )}
              </Button>
            </div>
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
            <div
              className={`font-medium text-foreground truncate max-w-[200px] cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors ${
                isEditing ? "ring-2 ring-primary bg-background" : ""
              }`}
              onClick={() => handleCellClick(deal.id, "name", deal.name)}
              title={
                isEditing
                  ? "Press Enter to save, Escape to cancel"
                  : "Click to edit"
              }
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleCellKeyDown(e, deal.id, "name")}
                  onBlur={() => handleCellEdit(deal.id, "name", editValue)}
                  className="w-full bg-background border-none outline-none text-sm font-medium"
                  autoFocus
                  placeholder="Enter deal name..."
                />
              ) : (
                deal.name
              )}
            </div>
          );
        case "stage":
          return (
            <div className="min-w-[120px]">
              {isEditing ? (
                <div className="ring-2 ring-primary bg-background rounded p-1">
                  <Select
                    value={editValue}
                    onValueChange={(value) =>
                      handleCellEdit(deal.id, "stage", value)
                    }
                    options={stageOptions}
                    className="w-full"
                  />
                </div>
              ) : (
                <div
                  className={`cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors ${
                    isEditing ? "ring-2 ring-primary bg-background" : ""
                  }`}
                  onClick={() => handleCellClick(deal.id, "stage", deal.stage)}
                  title={`${getStageTooltip(deal.stage)} - Click to edit`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStageColor(deal.stage) }}
                    />
                    <span className="text-sm font-medium">{deal.stage}</span>
                  </div>
                </div>
              )}
            </div>
          );
        case "owner":
          return (
            <div
              className={`flex items-center gap-2 min-w-0 cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors ${
                isEditing ? "ring-2 ring-primary bg-background" : ""
              }`}
              onClick={() => handleCellClick(deal.id, "owner", deal.owner)}
              title="Click to edit owner"
            >
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
            <div
              className={`text-sm text-foreground truncate max-w-[150px] cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors ${
                isEditing ? "ring-2 ring-primary bg-background" : ""
              }`}
              onClick={() => handleCellClick(deal.id, "company", deal.company)}
              title={
                isEditing
                  ? "Press Enter to save, Escape to cancel"
                  : "Click to edit"
              }
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleCellKeyDown(e, deal.id, "company")}
                  onBlur={() => handleCellEdit(deal.id, "company", editValue)}
                  className="w-full bg-background border-none outline-none text-sm"
                  autoFocus
                  placeholder="Enter company name..."
                />
              ) : (
                deal.company
              )}
            </div>
          );
        case "amount":
          return (
            <div
              className={`text-sm font-semibold text-foreground text-right cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors ${
                isEditing ? "ring-2 ring-primary bg-background" : ""
              }`}
              onClick={() => handleCellClick(deal.id, "amount", deal.amount)}
              title={
                isEditing
                  ? "Press Enter to save, Escape to cancel"
                  : "Click to edit"
              }
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleCellKeyDown(e, deal.id, "amount")}
                  onBlur={() => handleCellEdit(deal.id, "amount", editValue)}
                  className="w-full bg-background border-none outline-none text-sm font-semibold text-right"
                  autoFocus
                  placeholder="$0"
                />
              ) : (
                deal.amount
              )}
            </div>
          );
        case "probability":
          return (
            <div className="flex items-center gap-2 min-w-[120px]">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${deal.probability}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">
                {deal.probability}%
              </span>
            </div>
          );
        case "closeDate":
          return (
            <div
              className={`text-sm text-foreground cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors ${
                isEditing ? "ring-2 ring-primary bg-background" : ""
              }`}
              onClick={() =>
                handleCellClick(deal.id, "closeDate", deal.closeDate)
              }
              title={
                isEditing
                  ? "Press Enter to save, Escape to cancel"
                  : "Click to edit"
              }
            >
              {isEditing ? (
                <input
                  type="date"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleCellKeyDown(e, deal.id, "closeDate")}
                  onBlur={() => handleCellEdit(deal.id, "closeDate", editValue)}
                  className="w-full bg-background border-none outline-none text-sm"
                  autoFocus
                />
              ) : (
                format(new Date(deal.closeDate), "MMM d")
              )}
            </div>
          );
        case "priority":
          return (
            <div className="min-w-[100px]">
              {isEditing ? (
                <div className="ring-2 ring-primary bg-background rounded p-1">
                  <Select
                    value={editValue}
                    onValueChange={(value) =>
                      handleCellEdit(deal.id, "priority", value)
                    }
                    options={priorityOptions}
                    className="w-full"
                  />
                </div>
              ) : (
                <div
                  className={`cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors ${
                    isEditing ? "ring-2 ring-primary bg-background" : ""
                  }`}
                  onClick={() =>
                    handleCellClick(deal.id, "priority", deal.priority)
                  }
                  title={`${getPriorityTooltip(deal.priority)} - Click to edit`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getPriorityColor(deal.priority),
                      }}
                    />
                    <span className="text-sm font-medium">{deal.priority}</span>
                  </div>
                </div>
              )}
            </div>
          );
        case "source":
          return (
            <div
              className={`text-sm text-foreground truncate cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors ${
                isEditing ? "ring-2 ring-primary bg-background" : ""
              }`}
              onClick={() => handleCellClick(deal.id, "source", deal.source)}
              title={
                isEditing
                  ? "Press Enter to save, Escape to cancel"
                  : "Click to edit"
              }
            >
              {isEditing ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleCellKeyDown(e, deal.id, "source")}
                  onBlur={() => handleCellEdit(deal.id, "source", editValue)}
                  className="w-full bg-background border-none outline-none text-sm"
                  autoFocus
                  placeholder="Enter source..."
                />
              ) : (
                deal.source
              )}
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
          const columnKey = column.key as string;
          if (
            columnKey === "select" ||
            columnKey === "expand" ||
            columnKey === "actions"
          ) {
            return null;
          }
          return (
            <span className="text-sm text-foreground">
              {String(deal[column.key as keyof Deal] || "")}
            </span>
          );
      }
    },
    [
      selectedRows,
      expandedRows,
      updateDealField,
      toggleRowExpansion,
      editingCell,
      editValue,
      handleCellClick,
      handleCellEdit,
      handleCellCancel,
      handleCellKeyDown,
      getStageColor,
      getPriorityColor,
      getStageTooltip,
      getPriorityTooltip,
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!focusedCell) return;

      const { rowIndex, colIndex } = focusedCell;
      const totalRows = filteredAndSortedDeals.length;
      const totalCols = visibleColumnsWithActions.length;

      switch (e.key) {
        case "ArrowUp":
          // Disable keyboard shortcuts on mobile/tablet
          if (isMobile || isTablet) break;
          e.preventDefault();
          if (rowIndex > 0) {
            setFocusedCell({ rowIndex: rowIndex - 1, colIndex });
          }
          break;
        case "ArrowDown":
          // Disable keyboard shortcuts on mobile/tablet
          if (isMobile || isTablet) break;
          e.preventDefault();
          if (rowIndex < totalRows - 1) {
            setFocusedCell({ rowIndex: rowIndex + 1, colIndex });
          }
          break;
        case "ArrowLeft":
          // Disable keyboard shortcuts on mobile/tablet
          if (isMobile || isTablet) break;
          e.preventDefault();
          if (colIndex > 0) {
            setFocusedCell({ rowIndex, colIndex: colIndex - 1 });
          }
          break;
        case "ArrowRight":
          // Disable keyboard shortcuts on mobile/tablet
          if (isMobile || isTablet) break;
          e.preventDefault();
          if (colIndex < totalCols - 1) {
            setFocusedCell({ rowIndex, colIndex: colIndex + 1 });
          }
          break;
        case "Enter":
          e.preventDefault();
          if (focusedCell) {
            const deal = filteredAndSortedDeals[rowIndex];
            const column = visibleColumnsWithActions[colIndex];
            if (
              deal &&
              column &&
              column.key !== "select" &&
              column.key !== "expand" &&
              column.key !== "actions"
            ) {
              const dealKey = column.key as keyof Deal;
              handleCellClick(deal.id, column.key as string, deal[dealKey]);
            }
          }
          break;
        case "Escape":
          e.preventDefault();
          if (editingCell) {
            handleCellCancel();
          }
          break;
      }
    },
    [
      focusedCell,
      filteredAndSortedDeals,
      visibleColumnsWithActions,
      editingCell,
      handleCellClick,
      handleCellCancel,
    ]
  );

  const handleCellFocus = useCallback((rowIndex: number, colIndex: number) => {
    setFocusedCell({ rowIndex, colIndex });
  }, []);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, columnKey: string) => {
      e.preventDefault();
      e.stopPropagation();
      setResizingColumn(columnKey);
      setResizeStartX(e.clientX);
      const column = columns.find((col) => col.key === columnKey);
      setResizeStartWidth(column?.width || 150);
    },
    [columns]
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizingColumn) return;

      const deltaX = e.clientX - resizeStartX;
      const newWidth = Math.max(100, resizeStartWidth + deltaX); // Minimum width of 100px

      setColumns((prev) =>
        prev.map((col) =>
          col.key === resizingColumn ? { ...col, width: newWidth } : col
        )
      );
    },
    [resizingColumn, resizeStartX, resizeStartWidth]
  );

  const handleResizeEnd = useCallback(() => {
    setResizingColumn(null);
  }, []);

  useEffect(() => {
    if (resizingColumn) {
      document.addEventListener("mousemove", handleResizeMove);
      document.addEventListener("mouseup", handleResizeEnd);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleResizeMove);
        document.removeEventListener("mouseup", handleResizeEnd);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [resizingColumn, handleResizeMove, handleResizeEnd]);

  const handleColumnDragStart = useCallback(
    (e: React.DragEvent, columnKey: string) => {
      // Disable drag-and-drop on mobile/tablet
      if (!showDragDrop) return;

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", columnKey);
      setDraggingColumn(columnKey);
    },
    [showDragDrop]
  );

  const handleColumnDragOver = useCallback(
    (e: React.DragEvent, columnKey: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverColumn(columnKey);
    },
    []
  );

  const handleColumnDrop = useCallback(
    (e: React.DragEvent, targetColumnKey: string) => {
      e.preventDefault();
      const draggedColumnKey = e.dataTransfer.getData("text/plain");

      if (draggedColumnKey && draggedColumnKey !== targetColumnKey) {
        setColumns((prev) => {
          const draggedIndex = prev.findIndex(
            (col) => col.key === draggedColumnKey
          );
          const targetIndex = prev.findIndex(
            (col) => col.key === targetColumnKey
          );

          if (draggedIndex === -1 || targetIndex === -1) return prev;

          const newColumns = [...prev];
          const [draggedColumn] = newColumns.splice(draggedIndex, 1);
          newColumns.splice(targetIndex, 0, draggedColumn);

          return newColumns;
        });
      }

      setDraggingColumn(null);
      setDragOverColumn(null);
    },
    []
  );

  const handleColumnDragEnd = useCallback(() => {
    setDraggingColumn(null);
    setDragOverColumn(null);
  }, []);

  // Row drag and drop functionality
  const handleRowDragStart = useCallback(
    (e: React.DragEvent, dealId: string) => {
      // Disable drag-and-drop on mobile/tablet
      if (!showDragDrop) return;

      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", dealId);
      setDraggingRow(dealId);

      // Add visual feedback
      const target = e.currentTarget as HTMLElement;
      target.style.opacity = "0.5";
      target.style.transform = "rotate(1deg)";
    },
    [showDragDrop]
  );

  const handleRowDragOver = useCallback(
    (e: React.DragEvent, dealId: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverRow(dealId);
    },
    []
  );

  const handleRowDrop = useCallback(
    (e: React.DragEvent, targetDealId: string) => {
      e.preventDefault();
      const draggedDealId = e.dataTransfer.getData("text/plain");

      if (draggedDealId && draggedDealId !== targetDealId) {
        setDeals((prev) => {
          const draggedIndex = prev.findIndex(
            (deal) => deal.id === draggedDealId
          );
          const targetIndex = prev.findIndex(
            (deal) => deal.id === targetDealId
          );

          if (draggedIndex === -1 || targetIndex === -1) return prev;

          const newDeals = [...prev];
          const [draggedDeal] = newDeals.splice(draggedIndex, 1);
          newDeals.splice(targetIndex, 0, draggedDeal);

          return newDeals;
        });
      }

      setDraggingRow(null);
      setDragOverRow(null);
    },
    []
  );

  const handleRowDragEnd = useCallback((e: React.DragEvent) => {
    // Reset visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = "";
    target.style.transform = "";

    setDraggingRow(null);
    setDragOverRow(null);
  }, []);

  // Handle click events to prevent conflicts with drag
  const handleColumnClick = useCallback(
    (e: React.MouseEvent, columnKey: string) => {
      // Handle sort click
      handleSort(columnKey as keyof Deal, e);
    },
    [handleSort]
  );

  // Get drag and drop visual classes for columns
  const getDragDropClasses = useCallback(
    (columnKey: string) => {
      let classes = "transition-all duration-200";

      if (draggingColumn === columnKey) {
        classes += " opacity-50 scale-95";
      } else if (dragOverColumn === columnKey) {
        classes += " bg-primary/10 border-l-2 border-l-primary";
      }

      return classes;
    },
    [draggingColumn, dragOverColumn]
  );

  // Get drag and drop visual classes for rows
  const getRowDragDropClasses = useCallback(
    (dealId: string) => {
      let classes = "transition-all duration-200";

      if (draggingRow === dealId) {
        classes += " opacity-50 scale-98";
      } else if (dragOverRow === dealId) {
        classes += " bg-primary/10 border-l-4 border-l-primary";
      }

      return classes;
    },
    [draggingRow, dragOverRow]
  );

  // Get resize handle classes
  const getResizeHandleClasses = useCallback(
    (columnKey: string) => {
      let classes =
        "w-1 h-6 bg-border hover:bg-primary cursor-col-resize transition-all duration-200";

      if (resizingColumn === columnKey) {
        classes += " bg-primary w-2";
      }

      return classes;
    },
    [resizingColumn]
  );

  const handleHeaderFilterChange = useCallback(
    (columnKey: string, value: any) => {
      setHeaderFilters((prev) => ({
        ...prev,
        [columnKey]: value,
      }));
    },
    []
  );

  const clearHeaderFilters = useCallback(() => {
    setHeaderFilters({});
  }, []);

  const getHeaderFilterValue = useCallback(
    (columnKey: string) => {
      return headerFilters[columnKey] || "";
    },
    [headerFilters]
  );

  const hasActiveHeaderFilters = useCallback(() => {
    return Object.values(headerFilters).some((value) => value && value !== "");
  }, [headerFilters]);

  const getActiveFilterCount = useCallback(() => {
    return Object.values(headerFilters).filter((value) => value && value !== "")
      .length;
  }, [headerFilters]);

  const clearAllSorts = useCallback(() => {
    setSortConfigs([]);
  }, []);

  const getSortIndicatorText = useCallback(() => {
    if (sortConfigs.length === 0) return "No sorting applied";
    if (sortConfigs.length === 1) {
      const config = sortConfigs[0];
      return `Sorted by ${config.key} (${config.direction})`;
    }
    return `Sorted by ${sortConfigs.length} columns`;
  }, [sortConfigs]);

  const clearSavedState = useCallback(() => {
    try {
      localStorage.removeItem("deals-table-state");
      // Reset to defaults
      setSortConfigs([]);
      setFilters({
        stages: [],
        priorities: [],
        owners: [],
        sources: [],
        amountRange: { min: 0, max: 200000 },
        searchTerm: "",
      });
      setColumns(DEFAULT_COLUMNS);
      setShowFilters(false);
      setHeaderFilters({});
      setShowHeaderFilters(false);
    } catch (error) {
      console.warn("Failed to clear saved state:", error);
    }
  }, []);

  const totalBarData = {
    totalDeals: 120,
    totalValue: 450000,
    weightedValue: 320000.75,
    avgProbability: 67.8,
    wonDeals: 45,
    lostDeals: 30,
  };

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
        showHeaderFilters={showHeaderFilters}
        setShowHeaderFilters={setShowHeaderFilters}
        headerFilters={headerFilters}
        clearHeaderFilters={clearHeaderFilters}
        ThemeToggle={ThemeToggle}
        TableFilters={TableFilters}
        columns={columns}
        setColumns={setColumns}
        onColumnHide={handleColumnHide}
        onColumnMove={handleColumnMove}
      />
      {/* Table Section */}
      <div className="flex-1 w-full pt-6">
        <div className="relative shadow-xl overflow-x-auto bg-card border border-border rounded-lg">
          <table
            className={`w-full text-sm ${
              isMobile
                ? "min-w-[600px]"
                : isTablet
                ? "min-w-[800px]"
                : "min-w-[900px]"
            }`}
          >
            <thead className="sticky top-0 z-20 bg-background border-b border-border">
              <tr>
                {responsiveColumns.map((column, colIndex) => (
                  <DealsTableHeaderCell
                    key={column.key}
                    column={column}
                    colIndex={colIndex}
                    isAllSelected={isAllSelected}
                    isIndeterminate={isIndeterminate}
                    draggingColumn={draggingColumn}
                    showDragDrop={showDragDrop}
                    showHeaderFilters={showHeaderFilters}
                    getDragDropClasses={getDragDropClasses}
                    handleCellFocus={handleCellFocus}
                    handleColumnDragStart={handleColumnDragStart}
                    handleColumnDragOver={handleColumnDragOver}
                    handleColumnDrop={handleColumnDrop}
                    handleColumnDragEnd={handleColumnDragEnd}
                    handleColumnClick={handleColumnClick}
                    handleContextMenu={handleContextMenu}
                    handleSelectAll={handleSelectAll}
                    handleResizeStart={handleResizeStart}
                    handleHeaderFilterChange={handleHeaderFilterChange}
                    getSortButtonClass={getSortButtonClass}
                    getSortTooltip={getSortTooltip}
                    getSortIcon={getSortIcon}
                    getSortPriority={getSortPriority}
                    getResizeHandleClasses={getResizeHandleClasses}
                    getHeaderFilterValue={getHeaderFilterValue}
                  />
                ))}
              </tr>
            </thead>

            <DealsTableBody
              deals={filteredAndSortedDeals}
              columns={responsiveColumns}
              selectedRows={selectedRows}
              expandedRows={expandedRows}
              rowDeleteConfirm={rowDeleteConfirm}
              onRowClick={handleRowSelection}
              onContextMenu={(e: React.MouseEvent, deal: Deal) =>
                handleContextMenu(e, "row", deal)
              }
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
                setRowDeleteConfirm((prev) => (prev === dealId ? null : dealId))
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
              onKeyDown={handleKeyDown}
              onCellFocus={handleCellFocus}
              onRowDragStart={
                showDragDrop
                  ? (e, deal) => handleRowDragStart(e, deal.id)
                  : undefined
              }
              onRowDragOver={
                showDragDrop
                  ? (e, deal) => handleRowDragOver(e, deal.id)
                  : undefined
              }
              onRowDrop={
                showDragDrop
                  ? (e, deal) => handleRowDrop(e, deal.id)
                  : undefined
              }
              onRowDragEnd={showDragDrop ? handleRowDragEnd : undefined}
              getRowDragDropClasses={
                showDragDrop ? getRowDragDropClasses : () => ""
              }
              onActivityAdd={handleActivityAdd}
              onFileUpload={handleFileUpload}
            />
          </table>
          {filteredAndSortedDeals.length === 0 && (
            <NoDealsFound
              filters={filters}
              onCreateDeal={() => setShowNewDealModal(true)}
            />
          )}
          {/* Pinned Totals Bar */}
          <TotalsBar
            stats={[
              { label: "Total Deals", value: totalBarData.totalDeals },
              {
                label: "Total Value",
                value: totalBarData.totalValue,
                format: "currency",
                className: "text-primary",
              },
              {
                label: "Weighted Value",
                value: totalBarData.weightedValue,
                format: "currency",
                className: "text-primary",
              },
              {
                label: "Avg Probability",
                value: totalBarData.avgProbability,
                format: "percent",
                className: "text-primary",
              },
              {
                label: "Won",
                value: totalBarData.wonDeals,
                className: "text-emerald-600 dark:text-emerald-400",
              },
              {
                label: "Lost",
                value: totalBarData.lostDeals,
                className: "text-red-600 dark:text-red-400",
              },
            ]}
          />
        </div>
      </div>

      {/* Modal for New Deal */}
      {showNewDealModal && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card/90  rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-border animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="p-4 sm:p-6 border-b border-border">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Create New Deal
              </h2>
            </div>
            <div className="p-4 sm:p-6">
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
        <BulkActionsToolbar
          selectedCount={selectedRows.size}
          selectedDeals={filteredAndSortedDeals.filter((deal) =>
            selectedRows.has(deal.id)
          )}
          stageOptions={stageOptions}
          priorityOptions={priorityOptions}
          onBulkAction={handleBulkAction}
        />
      )}

      {/* Custom Delete Confirmation Bar */}
      {selectedRows.size > 0 && showDeleteConfirm && (
        <DeleteConfirmDialog
          open={showDeleteConfirm}
          count={selectedRows.size}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            handleBulkDelete();
            setShowDeleteConfirm(false);
          }}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          contextMenu={contextMenu}
          columns={columns}
          onClose={closeContextMenu}
          onColumnHide={handleColumnHide}
          onColumnMove={handleColumnMove}
          onRowEdit={handleRowEdit as (id: string | number) => void}
          onRowDuplicate={handleRowDuplicate as (id: string | number) => void}
          onRowDelete={handleRowDelete as (id: string | number) => void}
        />
      )}

      {/* Click outside to close context menu */}
      {contextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeContextMenu}
          aria-hidden="true"
        />
      )}

      {/* Sort Status Indicator */}
      {sortConfigs.length > 0 && (
        <SortStatusIndicator
          sortText={getSortIndicatorText()}
          onClear={clearAllSorts}
        />
      )}

      {/* Header Filter Status Indicator */}
      {hasActiveHeaderFilters() && (
        <FilterStatusIndicator
          activeFilterCount={getActiveFilterCount()}
          onClear={clearHeaderFilters}
          sortCount={sortConfigs.length}
        />
      )}

      {draggingColumn && (
        <DragIndicator
          type="column"
          label={columns.find((col) => col.key === draggingColumn)?.label ?? ""}
        />
      )}

      {draggingRow && (
        <DragIndicator
          type="row"
          label={deals.find((deal) => deal.id === draggingRow)?.name ?? ""}
        />
      )}

      {resizingColumn && (
        <DragIndicator
          type="resize"
          label={columns.find((col) => col.key === resizingColumn)?.label ?? ""}
          subLabel={`${
            columns.find((col) => col.key === resizingColumn)?.width
          }px`}
        />
      )}

      {/* Keyboard navigation help tooltip */}
      <HelpTooltip
        sections={[
          {
            title: "Keyboard Shortcuts:",
            items: [
              "↑↓←→ Navigate cells",
              "Enter Edit cell",
              "Esc Cancel edit",
              "Ctrl/Cmd+Click Multi-select",
              "Shift+Click Range select",
              "Ctrl/Cmd+A Select All",
              "Escape Deselect All",
            ],
          },
          {
            title: "Table Features:",
            items: [
              "• Drag column headers to reorder",
              "• Drag table rows to reorder deals",
              "• Drag resize handles to resize",
              "• Right-click for context menus",
              "• Header filters for quick search",
              "• Shift+Click for multi-column sort",
              "• Ctrl+F to focus header filters",
              "• Ctrl+A to select all deals",
              "• Escape to deselect all",
            ],
          },
          {
            title: "Drag & Drop:",
            items: [
              "• Grab column headers to reorder",
              "• Grab table rows to reorder deals",
              "• Drag resize handles to adjust width",
              "• Visual feedback shows drop zones",
            ],
          },
        ]}
      />
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
