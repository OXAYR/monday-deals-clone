/** @format */

// components/molecules/SortStatusIndicator.tsx
import React from "react";
import { Button } from "../atoms/button"; // adjust path if needed

interface SortStatusIndicatorProps {
  sortText: string;
  onClear: () => void;
}

const SortStatusIndicator: React.FC<SortStatusIndicatorProps> = ({
  sortText,
  onClear,
}) => {
  if (!sortText) return null;

  return (
    <div className="fixed bottom-4 left-4 z-30">
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Sort:</span>
          <span className="text-muted-foreground">{sortText}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-6 px-2 text-xs hover:bg-muted"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SortStatusIndicator;
