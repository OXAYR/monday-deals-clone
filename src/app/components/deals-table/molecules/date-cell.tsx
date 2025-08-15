/**
 * Date Cell Molecule
 * Date picker for close dates and activity dates
 * Pure Tailwind CSS implementation without shadcn dependencies
 *
 * @format
 */

"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../../lib/utils";

interface DateCellProps {
  value: string;
  onSelect: (date: string) => void;
}

export function DateCell({ value, onSelect }: DateCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(value));

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onSelect(date.toISOString().split("T")[0]);
    setIsOpen(false);
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + (direction === "next" ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-2 py-1 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
      >
        <CalendarIcon className="h-3 w-3 text-gray-500" />
        <span>{format(new Date(value), "MMM d, yyyy")}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                ←
              </button>
              <span className="font-medium">
                {format(selectedDate, "MMMM yyyy")}
              </span>
              <button
                onClick={() => navigateMonth("next")}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                →
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="p-1 text-center font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
              {generateCalendarDays().map((date, index) => {
                const isCurrentMonth =
                  date.getMonth() === selectedDate.getMonth();
                const isSelected =
                  date.toDateString() === new Date(value).toDateString();
                const isToday =
                  date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={cn(
                      "p-1 text-center rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                      !isCurrentMonth && "text-gray-400",
                      isSelected && "bg-blue-500 text-white hover:bg-blue-600",
                      isToday && !isSelected && "bg-gray-100 dark:bg-gray-700"
                    )}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
