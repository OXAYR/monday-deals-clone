/**
 * Editable Cell Molecule
 * Handles inline editing for text and numeric values
 *
 * @format
 */

"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "../../../lib/utils";

interface EditableCellProps {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: "text" | "number" | "currency";
  className?: string;
  placeholder?: string;
}

export function EditableCell({
  value,
  onSave,
  type = "text",
  className,
  placeholder,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const finalValue =
      type === "number" || type === "currency"
        ? Number.parseFloat(tempValue) || 0
        : tempValue;
    onSave(finalValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value.toString());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const formatDisplayValue = (val: string | number) => {
    if (type === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(val));
    }
    return val.toString();
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          "h-8 px-2 text-sm border border-gray-200 dark:border-gray-700 rounded",
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "placeholder:text-gray-500 dark:placeholder:text-gray-400"
        )}
        placeholder={placeholder}
        type={type === "number" || type === "currency" ? "number" : "text"}
      />
    );
  }

  return (
    <div
      className={cn(
        "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors",
        "min-h-[2rem] flex items-center",
        type === "currency" && "font-medium",
        className
      )}
      onClick={() => setIsEditing(true)}
    >
      {formatDisplayValue(value)}
    </div>
  );
}
