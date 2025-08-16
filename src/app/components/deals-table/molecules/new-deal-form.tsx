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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Deal Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter deal name"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="company"
            className="text-sm font-medium text-foreground"
          >
            Company *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Enter company name"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="amount"
            className="text-sm font-medium text-foreground"
          >
            Amount *
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="$0"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="stage"
            className="text-sm font-medium text-foreground"
          >
            Stage *
          </label>
          <select
            id="stage"
            name="stage"
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select stage</option>
            <option value="New">New</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="priority"
            className="text-sm font-medium text-foreground"
          >
            Priority *
          </label>
          <select
            id="priority"
            name="priority"
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="probability"
            className="text-sm font-medium text-foreground"
          >
            Probability (%) *
          </label>
          <input
            type="number"
            id="probability"
            name="probability"
            min="0"
            max="100"
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="closeDate"
            className="text-sm font-medium text-foreground"
          >
            Close Date *
          </label>
          <input
            type="date"
            id="closeDate"
            name="closeDate"
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="source"
            className="text-sm font-medium text-foreground"
          >
            Source *
          </label>
          <select
            id="source"
            name="source"
            required
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select source</option>
            <option value="Direct">Direct</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
            <option value="Email Campaign">Email Campaign</option>
            <option value="Cold Call">Cold Call</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-foreground"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          placeholder="Enter deal description..."
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Create Deal
        </Button>
      </div>
    </form>
  );
}
