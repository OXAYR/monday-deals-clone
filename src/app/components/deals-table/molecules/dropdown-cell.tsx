/**
 * Dropdown Cell Molecule
 * Handles dropdown selection for stages, priorities, etc.
 *
 * @format
 */

"use client";

import { Button } from "../atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown";
import { ChevronDownIcon } from "lucide-react";
import { StatusBadge } from "../atoms/status-badge";

interface DropdownCellProps {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  variant: "stage" | "priority";
}

export function DropdownCell({
  value,
  options,
  onSelect,
  variant,
}: DropdownCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-1 hover:bg-muted/50">
          <StatusBadge variant={variant} value={value} />
          <ChevronDownIcon className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[120px]">
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => onSelect(option)}>
            <StatusBadge variant={variant} value={option} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
