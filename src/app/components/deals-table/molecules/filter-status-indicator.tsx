/** @format */

import React from "react";
import { Button } from "../atoms/button";

interface FilterStatusIndicatorProps {
  activeFilterCount: number;
  onClear: () => void;
  sortCount?: number;
}

const FilterStatusIndicator: React.FC<FilterStatusIndicatorProps> = ({
  activeFilterCount,
  onClear,
  sortCount = 0,
}) => {
  if (activeFilterCount === 0) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-30"
      style={{ top: sortCount > 0 ? "calc(4rem + 60px)" : "1rem" }}
    >
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Filters:</span>
          <span className="text-muted-foreground">
            {activeFilterCount} active header filter
            {activeFilterCount !== 1 ? "s" : ""}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-6 px-2 text-xs hover:bg-muted"
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterStatusIndicator;
