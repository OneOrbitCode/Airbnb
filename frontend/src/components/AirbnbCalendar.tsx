"use client";

import React, { useState } from "react";

interface AirbnbCalendarProps {
  checkIn: string; // "YYYY-MM-DD"
  checkOut: string; // "YYYY-MM-DD"
  onChange: (checkIn: string, checkOut: string) => void;
  numberOfMonths?: 1 | 2;
  minDate?: string;
  onClose?: () => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function AirbnbCalendar({
  checkIn,
  checkOut,
  onChange,
  numberOfMonths = 1,
  minDate,
  onClose,
}: AirbnbCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const initialMonth = checkIn ? parseDate(checkIn) || today : today;
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(
    new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1)
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const effectiveMinDate = minDate ? parseDate(minDate) || today : today;

  const checkInDate = parseDate(checkIn);
  const checkOutDate = parseDate(checkOut);

  const nextMonth = () => {
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    const prev = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1);
    // Don't allow navigating past today's month
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prev >= thisMonth) {
      setCurrentMonthDate(prev);
    }
  };

  const handleDateClick = (dayDate: Date) => {
    if (dayDate < effectiveMinDate) return;

    const dateStr = formatDate(dayDate);

    // Case 1: No dates selected, or both already selected -> set Check-in
    if (!checkInDate || (checkInDate && checkOutDate)) {
      onChange(dateStr, "");
      return;
    }

    // Case 2: Only Check-in selected
    if (checkInDate && !checkOutDate) {
      if (dayDate < checkInDate) {
        // User clicked an earlier date -> reset Check-in
        onChange(dateStr, "");
      } else if (dayDate.getTime() === checkInDate.getTime()) {
        // User clicked the same day -> reset
        onChange("", "");
      } else {
        // Valid Check-out selected
        onChange(checkIn, dateStr);
      }
    }
  };

  const renderMonth = (monthOffset: number) => {
    const monthDate = new Date(
      currentMonthDate.getFullYear(),
      currentMonthDate.getMonth() + monthOffset,
      1
    );
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Empty lead cells
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Day numbers
    for (let d = 1; d <= totalDays; d++) {
      const dayDate = new Date(year, month, d);
      dayDate.setHours(0, 0, 0, 0);

      const isPast = dayDate < effectiveMinDate;
      const isCheckIn = checkInDate && dayDate.getTime() === checkInDate.getTime();
      const isCheckOut = checkOutDate && dayDate.getTime() === checkOutDate.getTime();
      
      const isInRange =
        checkInDate &&
        checkOutDate &&
        dayDate > checkInDate &&
        dayDate < checkOutDate;

      const isHoverRange =
        checkInDate &&
        !checkOutDate &&
        hoverDate &&
        hoverDate > checkInDate &&
        dayDate > checkInDate &&
        dayDate <= hoverDate;

      days.push(
        <div
          key={`day-${d}`}
          className={`relative h-9 w-9 flex items-center justify-center ${
            isInRange || isHoverRange
              ? "bg-[#FF385C]/10 dark:bg-[#FF385C]/20"
              : ""
          } ${isCheckIn && (checkOutDate || hoverDate) ? "rounded-l-full" : ""} ${
            isCheckOut ? "rounded-r-full" : ""
          }`}
          onMouseEnter={() => !isPast && setHoverDate(dayDate)}
          onMouseLeave={() => setHoverDate(null)}
        >
          <button
            type="button"
            disabled={isPast}
            onClick={() => handleDateClick(dayDate)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
              isCheckIn || isCheckOut
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md font-bold scale-105"
                : isPast
                ? "text-neutral-300 dark:text-neutral-600 cursor-not-allowed line-through"
                : "text-neutral-800 dark:text-neutral-200 hover:border hover:border-black dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`}
          >
            {d}
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 min-w-[260px]">
        <div className="text-center font-bold text-xs sm:text-sm text-neutral-900 dark:text-white">
          {MONTH_NAMES[month]} {year}
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0.5 text-center">
          {WEEK_DAYS.map((wd) => (
            <div
              key={wd}
              className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 h-6 flex items-center justify-center"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-0.5">{days}</div>
      </div>
    );
  };

  const isPrevDisabled =
    currentMonthDate.getFullYear() === today.getFullYear() &&
    currentMonthDate.getMonth() === today.getMonth();

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-4 sm:p-5 shadow-2xl border border-gray-200 dark:border-neutral-700 flex flex-col gap-4 text-neutral-900 dark:text-white animate-in fade-in zoom-in-95 duration-150 select-none">
      
      {/* Top Header Controls: Check-in / Checkout indicator & Nav arrows */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
        <div className="flex flex-col">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {!checkIn
              ? "Select check-in date"
              : !checkOut
              ? "Select checkout date"
              : `${checkIn} → ${checkOut}`}
          </div>
          <div className="text-[11px] text-neutral-400">
            {checkIn && checkOut
              ? `${Math.ceil(
                  (parseDate(checkOut)!.getTime() - parseDate(checkIn)!.getTime()) /
                    (1000 * 60 * 60 * 24)
                )} nights selected`
              : "Prices adjust by stay duration"}
          </div>
        </div>

        {/* Month Navigation Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={isPrevDisabled}
            onClick={prevMonth}
            className="w-7 h-7 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 cursor-pointer text-xs"
            aria-label="Previous month"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="w-7 h-7 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-xs"
            aria-label="Next month"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className={`flex flex-col ${numberOfMonths === 2 ? "sm:flex-row" : ""} gap-6 justify-center`}>
        {renderMonth(0)}
        {numberOfMonths === 2 && renderMonth(1)}
      </div>

      {/* Footer Controls: Clear & Close */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => onChange("", "")}
          className="text-xs font-bold underline text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
        >
          Clear dates
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs px-4 py-2 rounded-xl shadow-xs hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            Apply
          </button>
        )}
      </div>

    </div>
  );
}
