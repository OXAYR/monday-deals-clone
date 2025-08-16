/** @format */

import { cn } from "../../../lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = true,
  size = "sm",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const height = size === "sm" ? "h-2" : "h-3";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex-1 bg-muted rounded-full", height)}>
        <div
          className={cn(
            "bg-primary rounded-full transition-all duration-300",
            height
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground font-medium min-w-[3rem] text-right">
          {value}%
        </span>
      )}
    </div>
  );
}
