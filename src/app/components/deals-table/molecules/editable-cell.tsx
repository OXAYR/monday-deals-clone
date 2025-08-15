/**
 * Editable Cell Molecule
 * Handles inline editing for text and numeric values
 *
 * @format
 */

"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
      <Input
        ref={inputRef}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-8 text-sm"
        placeholder={placeholder}
        type={type === "number" || type === "currency" ? "number" : "text"}
      />
    );
  }

  return (
    <div
      className={cn(
        "cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors",
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
