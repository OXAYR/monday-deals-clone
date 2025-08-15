/** @format */

import React from "react";
import { Button } from "../atoms/button";
import { TrashIcon } from "lucide-react";

export function TableRow({
  deal,
  columns,
  isSelected,
  isExpanded,
  onRowClick,
  onDelete,
  onDeleteConfirm,
  deleteConfirmId,
  renderCell,
  expandedRowDetails,
  rowIndex,
  onExpand,
  onSelect,
}: {
  deal: any;
  columns: any[];
  isSelected: boolean;
  isExpanded: boolean;
  onRowClick: (e: React.MouseEvent) => void;
  onDelete: () => void;
  onDeleteConfirm: () => void;
  deleteConfirmId: string | null;
  renderCell: (deal: any, column: any) => React.ReactNode;
  expandedRowDetails: React.ReactNode;
  rowIndex: number;
  onExpand?: () => void;
  onSelect?: () => void;
}) {
  return (
    <>
      <tr
        className={`
          hover:bg-slate-50 dark:hover:bg-slate-800/50 
          transition-all duration-150 cursor-pointer
          ${
            isSelected
              ? "bg-slate-100 dark:bg-slate-800 border-l-4 border-l-blue-500 dark:border-l-blue-400 shadow-md"
              : ""
          }
        `}
        onClick={onRowClick}
      >
        {columns.map((column) => (
          <td
            key={`${deal.id}-${column.key}`}
            className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 whitespace-nowrap"
            style={{
              width: `${column.width}px`,
              minWidth: `${column.minWidth}px`,
            }}
          >
            {renderCell(deal, column)}
          </td>
        ))}
        {/* Actions column */}
        <td
          key={`${deal.id}-actions`}
          className="p-4 border-r border-slate-100 dark:border-slate-800 last:border-r-0 whitespace-nowrap text-center"
          style={{ width: "80px", minWidth: "60px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {deleteConfirmId === deal.id ? (
            <span className="inline-flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onDeleteConfirm}
                className="px-2"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
                className="px-2"
              >
                Delete
              </Button>
            </span>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={onDeleteConfirm}
              className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td
            colSpan={columns.length + 1}
            className="p-0 bg-slate-50 dark:bg-slate-900/70"
          >
            {expandedRowDetails}
          </td>
        </tr>
      )}
    </>
  );
}
