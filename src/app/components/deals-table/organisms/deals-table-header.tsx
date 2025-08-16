/** @format */

import { Checkbox } from "../atoms/checkbox";
import { Badge } from "../atoms/badge";

interface DealsTableHeaderCellProps {
  column: {
    key: string;
    label: string;
    width: number;
    minWidth: number;
  };
  colIndex: number;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  draggingColumn: string | null;
  showDragDrop: boolean;
  showHeaderFilters: boolean;

  getDragDropClasses: (key: string) => string;
  handleCellFocus: (rowIndex: number, colIndex: number) => void;
  handleColumnDragStart: (e: React.DragEvent, key: string) => void;
  handleColumnDragOver: (e: React.DragEvent, key: string) => void;
  handleColumnDrop: (e: React.DragEvent, key: string) => void;
  handleColumnDragEnd: () => void;
  handleColumnClick: (e: React.MouseEvent, key: string) => void;
  handleContextMenu: (
    e: React.MouseEvent,
    type: "header" | "row",
    payload: any
  ) => void;
  handleSelectAll: (checked: boolean) => void;
  handleResizeStart: (e: React.MouseEvent, key: string) => void;
  handleHeaderFilterChange: (key: string, value: string) => void;

  // helpers
  getSortButtonClass: (key: string) => string;
  getSortTooltip: (key: string) => string;
  getSortIcon: (key: string) => React.ReactNode;
  getSortPriority: (key: string) => number | null;
  getResizeHandleClasses: (key: string) => string;
  getHeaderFilterValue: (key: string) => string;
}

export const DealsTableHeaderCell = ({
  column,
  colIndex,
  isAllSelected,
  isIndeterminate,
  draggingColumn,
  showDragDrop,
  showHeaderFilters,
  getDragDropClasses,
  handleCellFocus,
  handleColumnDragStart,
  handleColumnDragOver,
  handleColumnDrop,
  handleColumnDragEnd,
  handleColumnClick,
  handleContextMenu,
  handleSelectAll,
  handleResizeStart,
  handleHeaderFilterChange,
  getSortButtonClass,
  getSortTooltip,
  getSortIcon,
  getSortPriority,
  getResizeHandleClasses,
  getHeaderFilterValue,
}: DealsTableHeaderCellProps) => {
  return (
    <th
      key={column.key}
      className={`text-left p-4 font-semibold text-foreground border-r border-border last:border-r-0 whitespace-nowrap select-none bg-background ${getDragDropClasses(
        column.key
      )}`}
      style={{
        width: `${column.width}px`,
        minWidth: `${column.minWidth}px`,
      }}
      onClick={() => handleCellFocus(0, colIndex)}
      draggable={
        showDragDrop &&
        column.key !== "select" &&
        column.key !== "expand" &&
        column.key !== "actions"
      }
      onDragStart={
        showDragDrop ? (e) => handleColumnDragStart(e, column.key) : undefined
      }
      onDragOver={
        showDragDrop ? (e) => handleColumnDragOver(e, column.key) : undefined
      }
      onDrop={showDragDrop ? (e) => handleColumnDrop(e, column.key) : undefined}
      onDragEnd={showDragDrop ? handleColumnDragEnd : undefined}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {column.key === "select" ? (
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onCheckedChange={handleSelectAll}
            />
          ) : column.key === "expand" ? (
            <span></span>
          ) : column.key === "actions" ? (
            <span>Actions</span>
          ) : (
            <div className="flex items-center gap-1 w-full">
              <button
                className={`${getSortButtonClass(column.key)} ${
                  draggingColumn === column.key
                    ? "cursor-grabbing"
                    : "cursor-grab"
                }`}
                onClick={(e) => handleColumnClick(e, column.key)}
                onContextMenu={(e) => handleContextMenu(e, "header", column)}
                title={`${getSortTooltip(column.key)}${
                  draggingColumn ? "" : " - Drag to reorder"
                }`}
              >
                <span className="truncate text-base font-semibold">
                  {column.label}
                </span>
                {getSortIcon(column.key)}
                {getSortPriority(column.key) && (
                  <Badge
                    variant="secondary"
                    size="sm"
                    className="ml-1 bg-primary/10 text-primary border-primary/20"
                  >
                    {getSortPriority(column.key)}
                  </Badge>
                )}
              </button>

              {/* Resize handle */}
              {showDragDrop && (
                <div
                  className={getResizeHandleClasses(column.key)}
                  onMouseDown={(e) => handleResizeStart(e, column.key)}
                  title="Drag to resize column"
                />
              )}
            </div>
          )}
        </div>

        {/* Filter Row */}
        {showHeaderFilters &&
          column.key !== "select" &&
          column.key !== "expand" &&
          column.key !== "actions" && (
            <div className="flex items-center gap-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={`Filter ${column.label}...`}
                  value={getHeaderFilterValue(column.key)}
                  onChange={(e) =>
                    handleHeaderFilterChange(column.key, e.target.value)
                  }
                  className="w-full px-2 py-1 text-xs bg-background border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
                {getHeaderFilterValue(column.key) && (
                  <button
                    onClick={() => handleHeaderFilterChange(column.key, "")}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    title="Clear filter"
                  >
                    ×
                  </button>
                )}
              </div>
              {getHeaderFilterValue(column.key) && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </div>
          )}
      </div>
    </th>
  );
};
