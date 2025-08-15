/**
 * Date Cell Molecule
 * Date picker for close dates and activity dates
 *
 * @format
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateCellProps {
  value: string;
  onSelect: (date: string) => void;
}

export function DateCell({ value, onSelect }: DateCellProps) {
  const [date, setDate] = useState<Date>(new Date(value));

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onSelect(selectedDate.toISOString().split("T")[0]);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto p-2 hover:bg-muted/50 justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-3 w-3" />
          {format(new Date(value), "MMM d, yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
