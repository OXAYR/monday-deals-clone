/**
 * Probability Cell Molecule
 * Interactive probability slider with visual feedback
 *
 * @format
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "../atoms/progress-bar";

interface ProbabilityCellProps {
  value: number;
  onSave: (value: number) => void;
}

export function ProbabilityCell({ value, onSave }: ProbabilityCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-1">
        <input
          type="range"
          min="0"
          max="100"
          value={tempValue}
          onChange={(e) => setTempValue(Number(e.target.value))}
          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <span className="text-xs w-10 text-center font-medium">
          {tempValue}%
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSave}
          className="h-6 px-2 text-green-600"
        >
          ✓
        </Button>
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
      onClick={() => setIsEditing(true)}
    >
      <ProgressBar value={value} />
    </div>
  );
}
