/** @format */

// components/molecules/BulkActionsToolbar.tsx
"use client";

import { Button } from "../atoms/button";
import { Badge } from "../atoms/badge";
import { CopyIcon, TrashIcon, DownloadIcon } from "lucide-react";
import { Select } from "../molecules/select";

interface Deal {
  id: string | number;
  amount: string;
}

type BulkActionType =
  | "delete"
  | "duplicate"
  | "changeStage"
  | "changePriority"
  | "export";

interface BulkActionsToolbarProps {
  onBulkAction: (action: BulkActionType, value?: string) => void;
  selectedCount: number;
  selectedDeals: Deal[];
  stageOptions: { label: string; value: string }[];
  priorityOptions: { label: string; value: string }[];
}

export function BulkActionsToolbar({
  selectedCount,
  selectedDeals,
  stageOptions,
  priorityOptions,
  onBulkAction,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  const totalValue = selectedDeals
    .reduce(
      (sum, deal) => sum + Number.parseFloat(deal.amount.replace(/[$,]/g, "")),
      0
    )
    .toLocaleString();

  return (
    <div className="fixed left-0 right-0 top-20 z-40 flex justify-center animate-in fade-in-0 slide-in-from-top-4 duration-200">
      <div className="bg-gradient-to-r from-red-50 to-slate-100 dark:from-red-900/60 dark:to-slate-800/80 border border-red-200 dark:border-red-700 rounded-xl shadow-2xl px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 max-w-2xl w-full mx-4">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-foreground">
            {selectedCount} deal{selectedCount !== 1 ? "s" : ""} selected
          </span>
          <Badge variant="secondary" size="sm">
            ${totalValue} total
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction("duplicate")}
            className="hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <CopyIcon className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Select
            placeholder="Change Stage"
            options={stageOptions}
            onValueChange={(value) => onBulkAction("changeStage", value)}
            className="w-32"
          />
          <Select
            placeholder="Change Priority"
            options={priorityOptions}
            onValueChange={(value) => onBulkAction("changePriority", value)}
            className="w-32"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onBulkAction("delete")}
            className="hover:bg-red-600 hover:text-white transition-colors"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction("export")}
            className="hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}
