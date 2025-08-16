/** @format */

import type React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
  className = "",
  type = "text",
  error = false,
  ...props
}) => {
  return (
    <input
      type={type}
      className={`
        flex h-10 w-full rounded-lg border px-3 py-2 text-sm
        transition-all duration-200 ease-in-out
        placeholder:text-slate-500
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${
          error
            ? `border-red-300 focus:border-red-500 focus:ring-red-500
             dark:border-red-600 dark:focus:border-red-400 dark:focus:ring-red-400`
            : `border-slate-300 bg-white text-slate-900 focus:border-slate-500 focus:ring-slate-500
             dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 
             dark:focus:border-slate-400 dark:focus:ring-slate-400`
        }
        hover:border-slate-400 dark:hover:border-slate-500
        ${className}
      `}
      {...props}
    />
  );
};
