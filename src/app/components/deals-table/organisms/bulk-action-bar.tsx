/**
 * Bulk Actions Bar Organism
 * Displays when rows are selected, provides bulk operations
 *
 * @format
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  XIcon,
  CopyIcon,
  EditIcon,
  TrashIcon,
  ChevronDownIcon,
} from "lucide-react";
import { StatusBadge } from "../atoms/status-badge";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkDuplicate: () => void;
  onBulkStageChange: (stage: string) => void;
  onBulkPriorityChange: (priority: string) => void;
  onBulkDelete: () => void;
}

const STAGES = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkDuplicate,
  onBulkStageChange,
  onBulkPriorityChange,
  onBulkDelete,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {selectedCount} row{selectedCount !== 1 ? "s" : ""} selected
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button size="sm" variant="outline" onClick={onBulkDuplicate}>
            <CopyIcon className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Duplicate</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <EditIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Change Stage</span>
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {STAGES.map((stage) => (
                <DropdownMenuItem
                  key={stage}
                  onClick={() => onBulkStageChange(stage)}
                >
                  <StatusBadge variant="stage" value={stage} className="mr-2" />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <EditIcon className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Change Priority</span>
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {PRIORITIES.map((priority) => (
                <DropdownMenuItem
                  key={priority}
                  onClick={() => onBulkPriorityChange(priority)}
                >
                  <StatusBadge
                    variant="priority"
                    value={priority}
                    className="mr-2"
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" variant="destructive" onClick={onBulkDelete}>
            <TrashIcon className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Delete</span>
          </Button>

          <Button size="sm" variant="ghost" onClick={onClearSelection}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
