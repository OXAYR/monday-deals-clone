/** @format */

"use client";

/**
 * New Deal Creation Form Component
 *
 * A comprehensive form for creating new deals with validation
 * and proper UX patterns following atomic design principles
 */

import type React from "react";
import { useState } from "react";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { Select } from "./select";
import type { Deal } from "../types";

interface NewDealFormProps {
  onSubmit: (dealData: Partial<Deal>) => void;
  onCancel: () => void;
}

const stageOptions = [
  { value: "New", label: "New", color: "#64748b" },
  { value: "Qualified", label: "Qualified", color: "#3b82f6" },
  { value: "Proposal", label: "Proposal", color: "#f59e0b" },
  { value: "Negotiation", label: "Negotiation", color: "#ef4444" },
  { value: "Won", label: "Won", color: "#10b981" },
  { value: "Lost", label: "Lost", color: "#6b7280" },
];

const priorityOptions = [
  { value: "Low", label: "Low", color: "#10b981" },
  { value: "Medium", label: "Medium", color: "#f59e0b" },
  { value: "High", label: "High", color: "#ef4444" },
  { value: "Critical", label: "Critical", color: "#dc2626" },
];

export function NewDealForm({ onSubmit, onCancel }: NewDealFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    amount: "",
    stage: "New",
    priority: "Medium",
    probability: 50,
    closeDate: new Date().toISOString().split("T")[0],
    source: "Direct",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Deal name is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Amount is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Format amount to include $ and commas
    const formattedAmount = formData.amount.startsWith("$")
      ? formData.amount
      : `$${Number(formData.amount.replace(/[^0-9]/g, "")).toLocaleString()}`;

    onSubmit({
      ...formData,
      amount: formattedAmount,
      owner: { name: "Current User", initials: "CU" },
      tags: [],
      stage: formData.stage as Deal["stage"],
      priority: formData.priority as Deal["priority"],
    });
    // Optionally reset the form after submit
    setFormData({
      name: "",
      company: "",
      amount: "",
      stage: "New",
      priority: "Medium",
      probability: 50,
      closeDate: new Date().toISOString().split("T")[0],
      source: "Direct",
      description: "",
    });
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Deal Name *
        </label>
        <Input
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Enter deal name"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Company *
        </label>
        <Input
          value={formData.company}
          onChange={(e) => updateField("company", e.target.value)}
          placeholder="Enter company name"
          className={errors.company ? "border-red-500" : ""}
        />
        {errors.company && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.company}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Amount *
          </label>
          <Input
            value={formData.amount}
            onChange={(e) => updateField("amount", e.target.value)}
            placeholder="$10,000"
            className={errors.amount ? "border-red-500" : ""}
          />
          {errors.amount && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.amount}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Probability (%)
          </label>
          <Input
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => updateField("probability", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Stage
          </label>
          <Select
            value={formData.stage}
            onValueChange={(value) => updateField("stage", value)}
            options={stageOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Priority
          </label>
          <Select
            value={formData.priority}
            onValueChange={(value) => updateField("priority", value)}
            options={priorityOptions}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Expected Close Date
        </label>
        <Input
          type="date"
          value={formData.closeDate}
          onChange={(e) => updateField("closeDate", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Source
        </label>
        <Input
          value={formData.source}
          onChange={(e) => updateField("source", e.target.value)}
          placeholder="e.g., Website, Referral, Cold Call"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Add deal description..."
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 dark:bg-slate-800 dark:text-slate-100 resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          Create Deal
        </Button>
      </div>
    </form>
  );
}
