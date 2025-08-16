/** @format */

import React from "react";
import MenuButton from "../atoms/menu-button";
import {
  EyeOffIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
  EditIcon,
  CopyIcon,
  TrashIcon,
} from "lucide-react"; // adjust if you’re importing from somewhere else

interface HeaderTarget {
  key: string;
  label: string;
}

interface RowTarget {
  id: string | number;
  name: string;
  company: string;
  amount: string | number;
}

type ContextMenuType =
  | { type: "header"; target: HeaderTarget }
  | { type: "row"; target: RowTarget };

interface ContextMenuProps {
  contextMenu: (ContextMenuType & { x: number; y: number }) | null;
  columns: { key: string; label: string }[];
  onClose: () => void;
  onColumnHide: (key: string) => void;
  onColumnMove: (key: string, direction: "left" | "right") => void;
  onRowEdit: (id: string | number) => void;
  onRowDuplicate: (id: string | number) => void;
  onRowDelete: (id: string | number) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  contextMenu,
  columns,
  onClose,
  onColumnHide,
  onColumnMove,
  onRowEdit,
  onRowDuplicate,
  onRowDelete,
}) => {
  if (!contextMenu) return null;

  return (
    <div
      className="fixed z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-[200px] animate-in fade-in-0 zoom-in-95 duration-100"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      role="menu"
      tabIndex={-1}
    >
      {contextMenu.type === "header" ? (
        <>
          {/* Header Context */}
          <div className="px-3 py-2 border-b border-border">
            <h4 className="text-sm font-semibold text-foreground">
              {contextMenu.target.label} Column
            </h4>
          </div>

          <MenuButton onClick={() => onColumnHide(contextMenu.target.key)}>
            <EyeOffIcon className="h-4 w-4" />
            Hide Column
          </MenuButton>

          <MenuButton
            onClick={() => onColumnMove(contextMenu.target.key, "left")}
            disabled={
              columns.findIndex((col) => col.key === contextMenu.target.key) ===
              0
            }
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Move Left
          </MenuButton>

          <MenuButton
            onClick={() => onColumnMove(contextMenu.target.key, "right")}
            disabled={
              columns.findIndex((col) => col.key === contextMenu.target.key) ===
              columns.length - 1
            }
          >
            <ChevronRightIcon className="h-4 w-4" />
            Move Right
          </MenuButton>

          <div className="border-t border-border my-1" />

          <MenuButton onClick={onClose}>
            <SettingsIcon className="h-4 w-4" />
            Column Settings
          </MenuButton>
        </>
      ) : (
        <>
          {/* Row Context */}
          <div className="px-3 py-2 border-b border-border">
            <h4 className="text-sm font-semibold text-foreground">
              {contextMenu.target.name}
            </h4>
            <p className="text-xs text-muted-foreground">
              {contextMenu.target.company} • {contextMenu.target.amount}
            </p>
          </div>

          <MenuButton onClick={() => onRowEdit(contextMenu.target.id)}>
            <EditIcon className="h-4 w-4" />
            Edit Deal
          </MenuButton>

          <MenuButton onClick={() => onRowDuplicate(contextMenu.target.id)}>
            <CopyIcon className="h-4 w-4" />
            Duplicate Deal
          </MenuButton>

          <div className="border-t border-border my-1" />

          <MenuButton
            destructive
            onClick={() => onRowDelete(contextMenu.target.id)}
          >
            <TrashIcon className="h-4 w-4" />
            Delete Deal
          </MenuButton>
        </>
      )}
    </div>
  );
};

export default ContextMenu;
