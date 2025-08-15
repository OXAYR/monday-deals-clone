/**
 * Status Badge Atom
 * Reusable badge component for displaying deal stages and priorities
 * Pure Tailwind CSS implementation without shadcn dependencies
 *
 * @format
 */

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  variant: "stage" | "priority";
  value: string;
  className?: string;
}

const STAGE_COLORS = {
  New: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  Qualified:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
  Proposal:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
  Negotiation:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  Won: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  Lost: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
};

const PRIORITY_COLORS = {
  Low: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  Medium:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  High: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  Critical:
    "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
};

export function StatusBadge({ variant, value, className }: StatusBadgeProps) {
  const colors = variant === "stage" ? STAGE_COLORS : PRIORITY_COLORS;
  const colorClass =
    colors[value as keyof typeof colors] ||
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border",
        colorClass,
        className
      )}
    >
      {value}
    </span>
  );
}
