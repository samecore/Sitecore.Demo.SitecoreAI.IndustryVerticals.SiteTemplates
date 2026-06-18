'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/shadcn/lib/utils';

export interface DatePickerProps {
  selected?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholderText?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  showIcon?: boolean;
  inputClassName?: string;
  label?: string;
  iconPosition?: 'left' | 'right';
  triggerClassName?: string;
  iconClassName?: string;
}

export function DatePicker({
  selected,
  onChange,
  placeholderText = 'Select date',
  dateFormat = 'MMM d, yyyy',
  minDate,
  maxDate,
  showIcon = true,
  inputClassName,
  label,
  iconPosition = 'left',
  triggerClassName,
  iconClassName,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | null) => {
    if (onChange) {
      onChange(date);
    }
    setOpen(false);
  };

  const displayValue = selected ? format(selected, dateFormat) : placeholderText;
  const isStacked = Boolean(label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'border-border text-foreground placeholder:text-foreground-muted hover:bg-background-muted relative w-full rounded-md border bg-transparent py-1.5 pr-3 text-left text-xs leading-normal transition-all duration-200 ease-in-out focus:outline-none',
            showIcon && iconPosition === 'left' ? 'pl-9' : 'pl-3',
            showIcon && iconPosition === 'right' && 'pr-10',
            !selected && !isStacked && 'text-foreground-muted',
            triggerClassName,
            inputClassName
          )}
        >
          {showIcon && iconPosition === 'left' && (
            <div
              className={cn(
                'text-foreground-muted pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2',
                iconClassName
              )}
            >
              <CalendarIcon size={16} />
            </div>
          )}

          {isStacked ? (
            <div className="flight-booking-field-trigger-content">
              <span className="flight-booking-field-label">{label}</span>
              <span
                className={cn(
                  'flight-booking-field-value',
                  !selected && 'flight-booking-field-value-muted'
                )}
              >
                {displayValue}
              </span>
            </div>
          ) : (
            <span
              className={cn(
                showIcon && iconPosition === 'left' ? 'pl-2' : '',
                !selected && 'text-xs font-semibold',
                selected && 'text-xs'
              )}
            >
              {displayValue}
            </span>
          )}

          {showIcon && iconPosition === 'right' && (
            <div
              className={cn(
                'flight-booking-field-trigger-icon pointer-events-none absolute top-1/2 right-4 z-10 -translate-y-1/2',
                iconClassName
              )}
            >
              <CalendarIcon size={18} />
            </div>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar selected={selected} onSelect={handleSelect} minDate={minDate} maxDate={maxDate} />
      </PopoverContent>
    </Popover>
  );
}
