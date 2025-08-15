/**
 * Status Badge Atom
 * Reusable badge component for displaying deal stages and priorities
 *
 * @format
 */

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  variant: "stage" | "priority";
  value: string;
  className?: string;
}

const STAGE_COLORS = {
  New: "bg-blue-100 text-blue-800 border-blue-200",
  Qualified: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Proposal: "bg-purple-100 text-purple-800 border-purple-200",
  Negotiation: "bg-orange-100 text-orange-800 border-orange-200",
  Won: "bg-green-100 text-green-800 border-green-200",
  Lost: "bg-red-100 text-red-800 border-red-200",
};

const PRIORITY_COLORS = {
  Low: "bg-gray-100 text-gray-600 border-gray-200",
  Medium: "bg-blue-100 text-blue-700 border-blue-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Critical: "bg-red-100 text-red-700 border-red-200",
};

export function StatusBadge({ variant, value, className }: StatusBadgeProps) {
  const colors = variant === "stage" ? STAGE_COLORS : PRIORITY_COLORS;
  const colorClass =
    colors[value as keyof typeof colors] || "bg-gray-100 text-gray-600";

  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium", colorClass, className)}
    >
      {value}
    </Badge>
  );
}
