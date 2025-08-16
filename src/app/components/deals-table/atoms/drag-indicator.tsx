/** @format */

// components/molecules/DragIndicator.tsx
import React from "react";

interface DragIndicatorProps {
  type: "column" | "row" | "resize";
  label: string;
  subLabel?: string; // optional extra info like width
  position?: "top" | "below"; // for adjusting Y offset
}

const DragIndicator: React.FC<DragIndicatorProps> = ({
  type,
  label,
  subLabel,
  position = "top",
}) => {
  const yOffset = type === "row" ? "top-16" : "top-4";

  return (
    <div
      className={`fixed ${yOffset} left-1/2 transform -translate-x-1/2 z-50`}
    >
      <div className="bg-primary/90 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-in fade-in-0 slide-in-from-top-2 duration-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          {type === "column" && "Dragging column:"}
          {type === "row" && "Dragging deal:"}
          {type === "resize" && "Resizing:"} {label}
          {subLabel && <span>({subLabel})</span>}
        </div>
      </div>
    </div>
  );
};

export default DragIndicator;
