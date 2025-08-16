/** @format */

import React from "react";
import { Button } from "../atoms/button";
import { TrashIcon } from "lucide-react";
import type { Deal, ColumnConfig } from "../types";

interface TableRowProps {
  deal: Deal;
  columns: ColumnConfig[];
  isSelected: boolean;
  isExpanded: boolean;
  onRowClick: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDelete: (dealId: string) => void;
  onDeleteConfirm: (dealId: string) => void;
  deleteConfirmId: string | null;
  renderCell: (deal: Deal, column: ColumnConfig) => React.ReactNode;
  ExpandedRowDetails: React.ComponentType<{
    deal: Deal;
    onActivityAdd?: (dealId: string, activity: any) => void;
    onFileUpload?: (dealId: string, file: File) => void;
  }>;
  onExpand: () => void;
  onSelect: (e: React.MouseEvent) => void;
  rowIndex: number;
  onCellFocus: (rowIndex: number, colIndex: number) => void;
  onRowDragStart?: (e: React.DragEvent) => void;
  onRowDragOver?: (e: React.DragEvent) => void;
  onRowDrop?: (e: React.DragEvent) => void;
  onRowDragEnd?: (e: React.DragEvent) => void;
  getRowDragDropClasses?: (dealId: string) => string;
  onActivityAdd?: (dealId: string, activity: any) => void;
  onFileUpload?: (dealId: string, file: File) => void;
}

export function TableRow({
  deal,
  columns,
  isSelected,
  isExpanded,
  onRowClick,
  onContextMenu,
  onDelete,
  onDeleteConfirm,
  deleteConfirmId,
  renderCell,
  ExpandedRowDetails,
  onExpand,
  onSelect,
  rowIndex,
  onCellFocus,
  onRowDragStart,
  onRowDragOver,
  onRowDrop,
  onRowDragEnd,
  getRowDragDropClasses,
  onActivityAdd,
  onFileUpload,
}: TableRowProps) {
  return (
    <>
      <tr
        className={`${
          isSelected ? "bg-accent/10 border-l-accent" : ""
        } hover:bg-muted/30 transition-colors cursor-pointer ${
          getRowDragDropClasses?.(deal.id) || ""
        }`}
        onClick={onRowClick}
        onContextMenu={onContextMenu}
        draggable={!!onRowDragStart}
        onDragStart={onRowDragStart}
        onDragOver={onRowDragOver}
        onDrop={onRowDrop}
        onDragEnd={onRowDragEnd}
      >
        {columns.map((column, colIndex) => (
          <td
            key={`${deal.id}-${column.key}`}
            className="p-4 border-r border-border last:border-r-0 whitespace-nowrap"
            style={{
              width: `${column.width}px`,
              minWidth: `${column.minWidth}px`,
            }}
            onClick={() => onCellFocus(rowIndex, colIndex)}
            tabIndex={0}
          >
            {renderCell(deal, column)}
          </td>
        ))}
        <td
          key={`${deal.id}-actions`}
          className="p-4 border-r border-border last:border-r-0 whitespace-nowrap text-center"
          style={{ width: "80px", minWidth: "60px" }}
          onClick={(e) => e.stopPropagation()}
          tabIndex={0}
        >
          {deleteConfirmId === deal.id ? (
            <div className="flex items-center gap-2 justify-center">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(deal.id)}
                className="h-6 px-2 text-xs"
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteConfirm(deal.id)}
                className="h-6 px-2 text-xs"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteConfirm(deal.id)}
              className="text-foreground hover:bg-muted"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={columns.length + 1} className="p-0">
            <ExpandedRowDetails
              deal={deal}
              onActivityAdd={onActivityAdd}
              onFileUpload={onFileUpload}
            />
          </td>
        </tr>
      )}
    </>
  );
}
