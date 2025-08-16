/** @format */

"use client";

import { Button } from "../atoms/button";
import { TrashIcon } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  open,
  count,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed left-0 right-0 top-20 z-50 flex justify-center animate-in fade-in-0 slide-in-from-top-4 duration-200">
      <div className="bg-red-100 dark:bg-red-900/80 border border-red-300 dark:border-red-700 rounded-xl shadow-2xl px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 max-w-2xl w-full mx-4">
        <span className="text-base font-semibold text-red-800 dark:text-red-200">
          Are you sure you want to delete {count} deal{count !== 1 ? "s" : ""}?
          This action cannot be undone.
        </span>
        <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            className="hover:bg-red-600 hover:text-white transition-colors"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Confirm Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
