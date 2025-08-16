/** @format */

"use client";

import type React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
  type = "button",
  ...props
}) => {
  // Base styles with focus states and transitions
  const baseClasses = `
    inline-flex items-center justify-center rounded-lg font-medium 
    transition-all duration-200 ease-in-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
    disabled:pointer-events-none disabled:opacity-50
    active:scale-95
  `;

  // Professional color variants with dark mode support
  const variants = {
    default: `
      bg-slate-900 text-white shadow-sm
      hover:bg-slate-800 hover:shadow-md
      focus-visible:ring-slate-500
      dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200
    `,
    ghost: `
      text-slate-700 hover:bg-slate-100 hover:text-slate-900
      dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100
    `,
    outline: `
      border border-slate-300 bg-white text-slate-700 shadow-sm
      hover:bg-slate-50 hover:border-slate-400
      dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300
      dark:hover:bg-slate-800 dark:hover:border-slate-500
    `,
    destructive: `
      bg-red-600 text-white shadow-sm
      hover:bg-red-700 hover:shadow-md
      focus-visible:ring-red-500
      dark:bg-red-700 dark:hover:bg-red-800
    `,
    secondary: `
      bg-slate-100 text-slate-900 shadow-sm
      hover:bg-slate-200 hover:shadow-md
      dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700
    `,
  };

  // Size variants with proper spacing
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
