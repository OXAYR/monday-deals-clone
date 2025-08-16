/** @format */

"use client";

import type React from "react";
import { useEffect, useRef } from "react";

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  indeterminate?: boolean;
  disabled?: boolean;
  id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  className = "",
  indeterminate = false,
  disabled = false,
  id,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null);

  // Handle indeterminate state which can't be set via props
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
      className={`
        h-4 w-4 rounded border-2 transition-all duration-200
        border-slate-300 text-slate-900 
        focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
        hover:border-slate-400
        disabled:cursor-not-allowed disabled:opacity-50
        dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100
        dark:focus:ring-slate-400 dark:hover:border-slate-500
        ${className}
      `}
      {...props}
    />
  );
};
