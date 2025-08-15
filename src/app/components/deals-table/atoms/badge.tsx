/**
 * Badge Atom Component
 * Versatile badge component for status indicators and tags
 * Multiple variants with professional color schemes
 *
 * @format
 */

import type React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "outline";
  size?: "sm" | "default" | "lg";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "default",
  size = "default",
}) => {
  // Professional color variants with semantic meaning
  const variants = {
    default: `
      bg-slate-900 text-white
      dark:bg-slate-100 dark:text-slate-900
    `,
    secondary: `
      bg-slate-100 text-slate-700
      dark:bg-slate-800 dark:text-slate-300
    `,
    success: `
      bg-emerald-100 text-emerald-800 border border-emerald-200
      dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800
    `,
    warning: `
      bg-amber-100 text-amber-800 border border-amber-200
      dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800
    `,
    error: `
      bg-red-100 text-red-800 border border-red-200
      dark:bg-red-900/20 dark:text-red-400 dark:border-red-800
    `,
    outline: `
      border border-slate-300 bg-transparent text-slate-700
      dark:border-slate-600 dark:text-slate-300
    `,
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        transition-colors duration-200
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </span>
  );
};
