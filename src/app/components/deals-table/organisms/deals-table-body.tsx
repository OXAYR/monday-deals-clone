/** @format */

import React from "react";
import { TableRow } from "./table-row";
import type { Deal, ColumnConfig } from "../types";

interface DealsTableBodyProps {
  deals: Deal[];
  columns: ColumnConfig[];
  selectedRows: Set<string>;
  expandedRows: Set<string>;
  rowDeleteConfirm: string | null;
  onRowClick: (dealId: string, index: number, event: React.MouseEvent) => void;
  onContextMenu: (event: React.MouseEvent, deal: Deal) => void;
  onDelete: (dealId: string) => void;
  onDeleteConfirm: (dealId: string) => void;
  renderCell: (deal: Deal, column: ColumnConfig) => React.ReactNode;
  ExpandedRowDetails: React.ComponentType<{
    deal: Deal;
    onActivityAdd?: (dealId: string, activity: any) => void;
    onFileUpload?: (dealId: string, file: File) => void;
  }>;
  onExpand: (dealId: string) => void;
  onSelect: (dealId: string, rowIndex: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onCellFocus: (rowIndex: number, colIndex: number) => void;
  onRowDragStart?: (e: React.DragEvent, deal: Deal) => void;
  onRowDragOver?: (e: React.DragEvent, deal: Deal) => void;
  onRowDrop?: (e: React.DragEvent, deal: Deal) => void;
  onRowDragEnd?: (e: React.DragEvent) => void;
  getRowDragDropClasses?: (dealId: string) => string;
  onActivityAdd?: (dealId: string, activity: any) => void;
  onFileUpload?: (dealId: string, file: File) => void;
}

export function DealsTableBody({
  deals,
  columns,
  selectedRows,
  expandedRows,
  rowDeleteConfirm,
  onRowClick,
  onContextMenu,
  onDelete,
  onDeleteConfirm,
  renderCell,
  ExpandedRowDetails,
  onExpand,
  onSelect,
  onKeyDown,
  onCellFocus,
  onRowDragStart,
  onRowDragOver,
  onRowDrop,
  onRowDragEnd,
  getRowDragDropClasses,
  onActivityAdd,
  onFileUpload,
}: DealsTableBodyProps) {
  return (
    <tbody className="bg-card divide-y divide-border" onKeyDown={onKeyDown}>
      {deals.map((deal, rowIndex) => (
        <TableRow
          key={deal.id}
          deal={deal}
          columns={columns}
          isSelected={selectedRows.has(deal.id)}
          isExpanded={expandedRows.has(deal.id)}
          onRowClick={(e) => onRowClick(deal.id, rowIndex, e)}
          onContextMenu={(e) => onContextMenu(e, deal)}
          onDelete={onDelete}
          onDeleteConfirm={onDeleteConfirm}
          deleteConfirmId={rowDeleteConfirm}
          renderCell={renderCell}
          ExpandedRowDetails={ExpandedRowDetails}
          onExpand={() => onExpand(deal.id)}
          onSelect={(e) => onSelect(deal.id, rowIndex)}
          rowIndex={rowIndex}
          onCellFocus={onCellFocus}
          onRowDragStart={(e: React.DragEvent) => onRowDragStart?.(e, deal)}
          onRowDragOver={(e: React.DragEvent) => onRowDragOver?.(e, deal)}
          onRowDrop={(e: React.DragEvent) => onRowDrop?.(e, deal)}
          onRowDragEnd={onRowDragEnd || (() => {})}
          getRowDragDropClasses={getRowDragDropClasses || (() => "")}
          onActivityAdd={onActivityAdd}
          onFileUpload={onFileUpload}
        />
      ))}
    </tbody>
  );
}
