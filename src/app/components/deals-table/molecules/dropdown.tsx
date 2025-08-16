/** @format */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface DropdownProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
}

interface DropdownContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

interface DropdownCheckboxItemProps {
  children: React.ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

// Context for dropdown state
const DropdownContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}>({
  isOpen: false,
  setIsOpen: () => {},
  triggerRef: { current: null },
});

export function Dropdown({ children, open, onOpenChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(open || false);
  const triggerRef = useRef<HTMLElement>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  return (
    <DropdownContext.Provider
      value={{ isOpen, setIsOpen: handleOpenChange, triggerRef }}
    >
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownTrigger({
  children,
  asChild,
  onClick,
}: DropdownTriggerProps) {
  const { isOpen, setIsOpen, triggerRef } = React.useContext(DropdownContext);

  const handleClick = () => {
    setIsOpen(!isOpen);
    onClick?.();
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      "aria-expanded": isOpen,
      "aria-haspopup": true,
    } as any);
  }

  return (
    <button
      ref={triggerRef as any}
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-haspopup={true}
      className="inline-flex items-center justify-center"
    >
      {children}
    </button>
  );
}

export function DropdownContent({
  children,
  align = "start",
  className = "",
}: DropdownContentProps) {
  const { isOpen, setIsOpen, triggerRef } = React.useContext(DropdownContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const triggerElement = triggerRef.current;
      const triggerRect = triggerElement.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Estimate content height (you can make this more dynamic)
      const estimatedContentHeight = 200;
      const estimatedContentWidth = 192; // w-48 = 12rem = 192px

      // Determine vertical placement
      const spaceBelow = viewportHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const shouldPlaceAbove =
        spaceBelow < estimatedContentHeight &&
        spaceAbove > estimatedContentHeight;

      // Calculate vertical position
      let top: number;
      if (shouldPlaceAbove) {
        top = triggerRect.top + scrollY - estimatedContentHeight - 4;
        setPlacement("top");
      } else {
        top = triggerRect.bottom + scrollY + 4;
        setPlacement("bottom");
      }

      // Calculate horizontal position
      let left: number;
      if (align === "center") {
        left =
          triggerRect.left +
          scrollX +
          triggerRect.width / 2 -
          estimatedContentWidth / 2;
      } else if (align === "end") {
        left = triggerRect.right + scrollX - estimatedContentWidth;
      } else {
        left = triggerRect.left + scrollX;
      }

      // Ensure dropdown doesn't go outside viewport horizontally
      if (left < scrollX) {
        left = scrollX + 8; // Add some padding from viewport edge
      } else if (left + estimatedContentWidth > scrollX + viewportWidth) {
        left = scrollX + viewportWidth - estimatedContentWidth - 8;
      }

      setPosition({ top, left });
    }
  }, [isOpen, align]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleResize = () => {
      // Recalculate position on window resize
      if (isOpen && triggerRef.current) {
        const triggerElement = triggerRef.current;
        const triggerRect = triggerElement.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        const estimatedContentHeight = 200;
        const estimatedContentWidth = 192;

        const spaceBelow = viewportHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;
        const shouldPlaceAbove =
          spaceBelow < estimatedContentHeight &&
          spaceAbove > estimatedContentHeight;

        let top: number;
        if (shouldPlaceAbove) {
          top = triggerRect.top + scrollY - estimatedContentHeight - 4;
          setPlacement("top");
        } else {
          top = triggerRect.bottom + scrollY + 4;
          setPlacement("bottom");
        }

        let left: number;
        if (align === "center") {
          left =
            triggerRect.left +
            scrollX +
            triggerRect.width / 2 -
            estimatedContentWidth / 2;
        } else if (align === "end") {
          left = triggerRect.right + scrollX - estimatedContentWidth;
        } else {
          left = triggerRect.left + scrollX;
        }

        if (left < scrollX) {
          left = scrollX + 8;
        } else if (left + estimatedContentWidth > scrollX + viewportWidth) {
          left = scrollX + viewportWidth - estimatedContentWidth - 8;
        }

        setPosition({ top, left });
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleResize);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [isOpen, setIsOpen, align]);

  if (!isOpen) return null;

  const content = (
    <div
      ref={contentRef}
      className={`fixed z-50 min-w-48 max-w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg py-1 max-h-60 overflow-y-auto ${className}`}
      style={{
        top: position.top,
        left: position.left,
        transform: align === "center" ? "translateX(-50%)" : "none",
      }}
    >
      {children}
    </div>
  );

  return createPortal(content, document.body);
}

export function DropdownItem({
  children,
  onClick,
  className = "",
}: DropdownItemProps) {
  const { setIsOpen } = React.useContext(DropdownContext);

  const handleClick = () => {
    onClick?.();
    setIsOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700 focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}

export function DropdownCheckboxItem({
  children,
  checked,
  onCheckedChange,
  className = "",
}: DropdownCheckboxItemProps) {
  const handleClick = () => {
    onCheckedChange?.(!checked);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-slate-100 dark:focus:bg-slate-700 focus:outline-none flex items-center gap-2 ${className}`}
    >
      <div
        className={`w-4 h-4 border border-slate-300 dark:border-slate-600 rounded flex items-center justify-center ${
          checked ? "bg-blue-500 border-blue-500" : ""
        }`}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="h-px bg-slate-200 dark:bg-slate-700 my-1 mx-2" />;
}

// Export aliases for compatibility
export const DropdownMenu = Dropdown;
export const DropdownMenuTrigger = DropdownTrigger;
export const DropdownMenuContent = DropdownContent;
export const DropdownMenuItem = DropdownItem;
export const DropdownMenuCheckboxItem = DropdownCheckboxItem;
export const DropdownMenuSeparator = DropdownSeparator;
