"use client";

import * as React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Sélectionner une date",
  className,
  disabled = false,
  fromDate,
  toDate,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-11 border-black/10 text-[14px]",
            !date && "text-black/40",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" strokeWidth={2} />
          {date ? format(date, "dd MMMM yyyy", { locale: fr }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          disabled={disabled}
          fromDate={fromDate}
          toDate={toDate}
          locale={fr}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateRangePickerProps {
  from?: Date;
  to?: Date;
  onSelect?: (range: { from?: Date; to?: Date }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DateRangePicker({
  from,
  to,
  onSelect,
  placeholder = "Sélectionner une période",
  className,
  disabled = false,
}: DateRangePickerProps) {
  const [range, setRange] = React.useState<{ from?: Date; to?: Date }>({
    from,
    to,
  });

  React.useEffect(() => {
    setRange({ from, to });
  }, [from, to]);

  const handleSelect = (newRange: { from?: Date; to?: Date } | undefined) => {
    if (newRange) {
      setRange(newRange);
      onSelect?.(newRange);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-11 border-black/10 text-[14px]",
            !range.from && "text-black/40",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" strokeWidth={2} />
          {range.from ? (
            range.to ? (
              <>
                {format(range.from, "dd MMM yyyy", { locale: fr })} -{" "}
                {format(range.to, "dd MMM yyyy", { locale: fr })}
              </>
            ) : (
              format(range.from, "dd MMM yyyy", { locale: fr })
            )
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          disabled={disabled}
          locale={fr}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
