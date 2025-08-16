/** @format */

"use client";

import type React from "react";

import { Button } from "../atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../molecules/dropdown";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  SettingsIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
  width: number;
  minWidth: number;
  resizable: boolean;
}

interface SortConfig {
  key: string;
  direction: "asc" | "desc";
  priority: number;
}

interface TableHeaderProps {
  columns: ColumnConfig[];
  sortConfigs: SortConfig[];
  onSort: (key: string, event: React.MouseEvent) => void;
  onColumnVisibilityChange: (key: string) => void;
  onColumnReorder: (fromIndex: number, toIndex: number) => void;
  onColumnResize: (index: number, width: number) => void;
  onResetColumns: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onSelectAll: (checked: boolean) => void;
}

export function TableHeader({
  columns,
  sortConfigs,
  onSort,
  onColumnVisibilityChange,
  onColumnReorder,
  onColumnResize,
  onResetColumns,
  isAllSelected,
  isIndeterminate,
  onSelectAll,
}: TableHeaderProps) {
  const visibleColumns = columns.filter((col) => col.visible);

  const getSortIcon = (key: string) => {
    const config = sortConfigs.find((c) => c.key === key);
    if (!config) return null;
    return config.direction === "asc" ? (
      <ArrowUpIcon className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDownIcon className="h-3 w-3 ml-1" />
    );
  };

  const getSortPriority = (key: string) => {
    const config = sortConfigs.find((c) => c.key === key);
    return config ? config.priority + 1 : null;
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SettingsIcon className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="p-2">
              <div className="text-sm font-medium mb-2">Show/Hide Columns</div>
              {columns
                .filter((col) => col.key !== "select" && col.key !== "expand")
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={column.visible}
                    onCheckedChange={() => onColumnVisibilityChange(column.key)}
                    className="flex items-center gap-2"
                  >
                    {column.visible ? (
                      <EyeIcon className="h-3 w-3" />
                    ) : (
                      <EyeOffIcon className="h-3 w-3" />
                    )}
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onResetColumns}>
              Reset Column Widths
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden lg:block text-sm text-muted-foreground">
        Hold Shift + Click for multi-column sorting
      </div>
    </div>
  );
}
