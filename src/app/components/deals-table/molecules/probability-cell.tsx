/** @format */

"use client";

import { useState } from "react";
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
          className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <span className="text-xs w-10 text-center font-medium">
          {tempValue}%
        </span>
        <button
          onClick={handleSave}
          className="h-6 px-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
        >
          ✓
        </button>
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
      onClick={() => setIsEditing(true)}
    >
      <ProgressBar value={value} />
    </div>
  );
}
