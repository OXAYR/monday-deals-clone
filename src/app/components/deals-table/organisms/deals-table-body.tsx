/** @format */

import React from "react";
import { TableRow } from "./table-row";

function TableBodyRow({
  deal,
  columns,
  selectedRows,
  expandedRows,
  rowDeleteConfirm,
  onRowClick,
  onDelete,
  onDeleteConfirm,
  renderCell,
  ExpandedRowDetails,
  rowIndex,
  onExpand,
  onSelect,
}: any) {
  return (
    <TableRow
      key={deal.id}
      deal={deal}
      columns={columns}
      isSelected={selectedRows.has(deal.id)}
      isExpanded={expandedRows.has(deal.id)}
      onRowClick={(e: React.MouseEvent) => onRowClick(deal.id, rowIndex, e)}
      onDelete={() => onDelete(deal.id)}
      onDeleteConfirm={() => onDeleteConfirm(deal.id)}
      deleteConfirmId={rowDeleteConfirm}
      renderCell={renderCell}
      expandedRowDetails={<ExpandedRowDetails deal={deal} />}
      rowIndex={rowIndex}
      onExpand={() => onExpand(deal.id)}
      onSelect={() => onSelect(deal.id, rowIndex)}
    />
  );
}

export function DealsTableBody({
  deals,
  columns,
  selectedRows,
  expandedRows,
  rowDeleteConfirm,
  onRowClick,
  onDelete,
  onDeleteConfirm,
  renderCell,
  ExpandedRowDetails,
  onExpand,
  onSelect,
}: any) {
  return (
    <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
      {deals.map((deal: any, rowIndex: number) => (
        <TableBodyRow
          key={deal.id}
          deal={deal}
          columns={columns}
          selectedRows={selectedRows}
          expandedRows={expandedRows}
          rowDeleteConfirm={rowDeleteConfirm}
          onRowClick={onRowClick}
          onDelete={onDelete}
          onDeleteConfirm={onDeleteConfirm}
          renderCell={renderCell}
          ExpandedRowDetails={ExpandedRowDetails}
          rowIndex={rowIndex}
          onExpand={onExpand}
          onSelect={onSelect}
        />
      ))}
    </tbody>
  );
}
