// src/components/DateRangePicker.tsx
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  useMemo,
} from "react";
import {
  CalendarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  getRentalDays,
  formatRentalDuration,
} from "../utils/rental-duration-helper";
import {
  createLocalDate,
  formatDateLocal,
  debugDate,
  isSameDate,
} from "../utils/dateUtils";

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (dateRange: DateRange) => void;
  onDurationChange?: (duration: number) => void;
  minDate?: Date;
  maxDate?: Date;
  unavailableDates?: Date[];
  className?: string;
  disabled?: boolean;
  error?: string;
  // New props for controlled local state
  defaultValue?: DateRange;
  onLocalChange?: (dateRange: DateRange) => void;
}

const DateRangePicker = memo(function DateRangePicker({
  value,
  onChange,
  onDurationChange,
  minDate, // No default - allow today
  maxDate,
  unavailableDates = [],
  className = "",
  disabled = false,
  error,
  defaultValue = { startDate: null, endDate: null },
  onLocalChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Local state for date selection - does NOT update global context immediately
  const [localDateRange, setLocalDateRange] = useState<DateRange>(defaultValue);

  // Use ref to track if we're in the middle of an internal update
  const isInternalUpdate = useRef(false);

  // Initialize from value prop if provided (for backwards compatibility)
  useEffect(() => {
    if (
      value &&
      (value.startDate !== localDateRange.startDate ||
        value.endDate !== localDateRange.endDate)
    ) {
      if (process.env.NODE_ENV === "development") {
        console.log("🔄 DateRangePicker: Syncing from value prop");
      }
      setLocalDateRange(value);
    }
  }, [value]);

  // Use local state for display
  const selectedStartDate = localDateRange.startDate;
  const selectedEndDate = localDateRange.endDate;

  // Only notify parent when both dates are selected (to prevent flickering)
  useEffect(() => {
    // Only call onLocalChange when we have a complete date range or when clearing
    if (
      (selectedStartDate && selectedEndDate) ||
      (!selectedStartDate && !selectedEndDate)
    ) {
      if (process.env.NODE_ENV === "development") {
        console.log("📅 DateRangePicker: Complete date range updated:", {
          startDate: selectedStartDate?.toLocaleDateString(),
          endDate: selectedEndDate?.toLocaleDateString(),
        });
      }
      onLocalChange?.(localDateRange);
    }
  }, [selectedStartDate, selectedEndDate, localDateRange, onLocalChange]);

  // Calculate duration when dates change using helper function
  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const duration = getRentalDays(selectedStartDate, selectedEndDate);
      onDurationChange?.(duration);
    } else {
      onDurationChange?.(0);
    }
  }, [selectedStartDate, selectedEndDate, onDurationChange]);

  const formatDate = useCallback((date: Date | null) => {
    return formatDateLocal(date, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const formatDateShort = useCallback((date: Date | null) => {
    return formatDateLocal(date, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  const isDateUnavailable = useCallback(
    (date: Date) => {
      return unavailableDates.some(
        (unavailable) => unavailable.toDateString() === date.toDateString()
      );
    },
    [unavailableDates]
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Allow today and future dates
      if (date < today) return true;
      if (minDate && date < minDate) return true;
      if (maxDate && date > maxDate) return true;
      if (isDateUnavailable(date)) return true;

      return false;
    },
    [minDate, maxDate, isDateUnavailable]
  );

  const isDateInRange = useCallback(
    (date: Date) => {
      if (!selectedStartDate) return false;

      const compareDate = hoverDate || selectedEndDate;
      if (!compareDate) return false;

      const start = selectedStartDate.getTime();
      const end = compareDate.getTime();
      const current = date.getTime();

      return current >= Math.min(start, end) && current <= Math.max(start, end);
    },
    [selectedStartDate, selectedEndDate, hoverDate]
  );

  const isDateSelected = useCallback(
    (date: Date) => {
      if (selectedStartDate && isSameDate(date, selectedStartDate)) return true;
      if (selectedEndDate && isSameDate(date, selectedEndDate)) return true;
      return false;
    },
    [selectedStartDate, selectedEndDate]
  );

  const handleDateClick = useCallback(
    (date: Date) => {
      if (isDateDisabled(date)) {
        if (process.env.NODE_ENV === "development") {
          console.log("⚠️ DateRangePicker: Date disabled");
        }
        return;
      }

      isInternalUpdate.current = true;

      if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // Start new selection
        const newRange = { startDate: date, endDate: null };
        setLocalDateRange(newRange);
      } else {
        // Check if trying to select the same date
        if (isSameDate(date, selectedStartDate)) {
          isInternalUpdate.current = false;
          return;
        }

        // Complete the range
        let newRange;
        if (date < selectedStartDate) {
          // Swap if end date is before start date
          newRange = { startDate: date, endDate: selectedStartDate };
        } else {
          newRange = { startDate: selectedStartDate, endDate: date };
        }

        setLocalDateRange(newRange);
        // Small delay before closing to ensure state is updated
        setTimeout(() => setIsOpen(false), 100);
      }

      // Small delay to reset the flag
      setTimeout(() => {
        isInternalUpdate.current = false;
      }, 50); // Reduced delay
    },
    [isDateDisabled, selectedStartDate, selectedEndDate]
  );

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Use timezone-safe date creation
    const firstDay = createLocalDate(year, month, 1);
    const lastDay = createLocalDate(year, month + 1, 0); // This gets last day of current month
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month using timezone-safe creation
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(createLocalDate(year, month, day));
    }

    return days;
  }, []);

  const navigateMonth = useCallback(
    (direction: "prev" | "next") => {
      const newMonth = new Date(currentMonth);
      if (direction === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      setCurrentMonth(newMonth);
    },
    [currentMonth]
  );

  const clearSelection = useCallback(() => {
    console.log("🗑️ DateRangePicker clearSelection called (local state):", {
      currentSelection: {
        startDate: selectedStartDate?.toISOString(),
        endDate: selectedEndDate?.toISOString(),
      },
      source: "clearSelection",
    });

    isInternalUpdate.current = true;
    setLocalDateRange({ startDate: null, endDate: null });

    setTimeout(() => {
      isInternalUpdate.current = false;
    }, 100);
  }, [selectedStartDate, selectedEndDate]);

  // Method to get current local dates (for parent to access)
  const getCurrentDates = useCallback(() => localDateRange, [localDateRange]);

  const days = useMemo(
    () => getDaysInMonth(currentMonth),
    [currentMonth, getDaysInMonth]
  );
  const weekDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  const duration = useMemo(() => {
    return selectedStartDate && selectedEndDate
      ? getRentalDays(selectedStartDate, selectedEndDate)
      : 0;
  }, [selectedStartDate, selectedEndDate]);

  return (
    <div className={`relative ${className}`}>
      {/* Input Display */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
          disabled
            ? "bg-gray-100 cursor-not-allowed border-gray-200"
            : error
            ? "border-red-300 bg-red-50 hover:border-red-400 focus-within:ring-2 focus-within:ring-red-200"
            : "border-gray-300 bg-white hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-200"
        }`}
      >
        <div className="flex items-center space-x-3">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <div>
            {selectedStartDate && selectedEndDate ? (
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDateShort(selectedStartDate)} -{" "}
                  {formatDateShort(selectedEndDate)}
                </div>
                <div className="text-xs text-gray-500">
                  {formatRentalDuration(duration)}
                </div>
              </div>
            ) : selectedStartDate ? (
              <div className="text-sm text-gray-700">
                {formatDateShort(selectedStartDate)} - Pilih tanggal akhir
              </div>
            ) : (
              <div className="text-sm text-gray-500">Pilih tanggal rental</div>
            )}
          </div>
        </div>

        {(selectedStartDate || selectedEndDate) && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {/* Calendar Popup */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[320px]">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>

            <h3 className="text-xs font-extralight text-gray-900">
              {currentMonth.toLocaleDateString("id-ID", {
                month: "long",
                year: "numeric",
              })}
            </h3>

            <button
              type="button"
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2"></div>;
              }

              const isDisabled = isDateDisabled(date);
              const isSelected = isDateSelected(date);
              const isInRange = isDateInRange(date);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => handleDateClick(date)}
                  onMouseEnter={() => setHoverDate(date)}
                  onMouseLeave={() => setHoverDate(null)}
                  disabled={isDisabled}
                  className={`p-2 text-sm rounded-lg transition-all duration-200 ${
                    isDisabled
                      ? "text-gray-300 cursor-not-allowed"
                      : isSelected
                      ? "bg-blue-600 text-white font-semibold"
                      : isInRange
                      ? "bg-blue-100 text-blue-700"
                      : isToday
                      ? "bg-gray-100 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Selection Info */}
          {selectedStartDate && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <div>
                  <strong>Mulai:</strong> {formatDate(selectedStartDate)}
                </div>
                {selectedEndDate && (
                  <>
                    <div>
                      <strong>Selesai:</strong> {formatDate(selectedEndDate)}
                    </div>
                    <div className="mt-2 text-blue-600 font-semibold">
                      Durasi: {formatRentalDuration(duration)}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            {selectedStartDate && selectedEndDate && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Pilih
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default DateRangePicker;
