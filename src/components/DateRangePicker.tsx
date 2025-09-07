// src/components/DateRangePicker.tsx
import { useState, useEffect, useCallback } from 'react';
import { CalendarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  onDurationChange?: (duration: number) => void;
  minDate?: Date;
  maxDate?: Date;
  unavailableDates?: Date[];
  className?: string;
  disabled?: boolean;
  error?: string;
}

export default function DateRangePicker({
  value,
  onChange,
  onDurationChange,
  minDate = new Date(),
  maxDate,
  unavailableDates = [],
  className = '',
  disabled = false,
  error
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(value.startDate);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(value.endDate);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Calculate duration when dates change
  useEffect(() => {
    if (selectedStartDate && selectedEndDate) {
      const duration = Math.ceil(
        (selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1; // +1 to include both start and end date
      onDurationChange?.(duration);
    } else {
      onDurationChange?.(0);
    }
  }, [selectedStartDate, selectedEndDate, onDurationChange]);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateShort = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailable => 
      unavailable.toDateString() === date.toDateString()
    );
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < minDate || date < today) return true;
    if (maxDate && date > maxDate) return true;
    if (isDateUnavailable(date)) return true;
    
    return false;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStartDate) return false;
    
    const compareDate = hoverDate || selectedEndDate;
    if (!compareDate) return false;
    
    const start = selectedStartDate.getTime();
    const end = compareDate.getTime();
    const current = date.getTime();
    
    return current >= Math.min(start, end) && current <= Math.max(start, end);
  };

  const isDateSelected = (date: Date) => {
    if (selectedStartDate && date.toDateString() === selectedStartDate.toDateString()) return true;
    if (selectedEndDate && date.toDateString() === selectedEndDate.toDateString()) return true;
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Start new selection
      setSelectedStartDate(date);
      setSelectedEndDate(null);
      onChange({ startDate: date, endDate: null });
    } else {
      // Complete the range
      if (date < selectedStartDate) {
        // Swap if end date is before start date
        setSelectedStartDate(date);
        setSelectedEndDate(selectedStartDate);
        onChange({ startDate: date, endDate: selectedStartDate });
      } else {
        setSelectedEndDate(date);
        onChange({ startDate: selectedStartDate, endDate: date });
      }
      setIsOpen(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const clearSelection = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onChange({ startDate: null, endDate: null });
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const duration = selectedStartDate && selectedEndDate 
    ? Math.ceil((selectedEndDate.getTime() - selectedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  return (
    <div className={`relative ${className}`}>
      {/* Input Display */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
          disabled 
            ? 'bg-gray-100 cursor-not-allowed border-gray-200' 
            : error 
            ? 'border-red-300 bg-red-50 hover:border-red-400 focus-within:ring-2 focus-within:ring-red-200' 
            : 'border-gray-300 bg-white hover:border-gray-400 focus-within:ring-2 focus-within:ring-blue-200'
        }`}
      >
        <div className="flex items-center space-x-3">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <div>
            {selectedStartDate && selectedEndDate ? (
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDateShort(selectedStartDate)} - {formatDateShort(selectedEndDate)}
                </div>
                <div className="text-xs text-gray-500">
                  {duration} hari
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
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            
            <h3 className="text-lg font-semibold text-gray-900">
              {currentMonth.toLocaleDateString('id-ID', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </h3>
            
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              →
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
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
                      ? 'text-gray-300 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600 text-white font-semibold'
                      : isInRange
                      ? 'bg-blue-100 text-blue-700'
                      : isToday
                      ? 'bg-gray-100 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
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
                <div><strong>Mulai:</strong> {formatDate(selectedStartDate)}</div>
                {selectedEndDate && (
                  <>
                    <div><strong>Selesai:</strong> {formatDate(selectedEndDate)}</div>
                    <div className="mt-2 text-blue-600 font-semibold">
                      Durasi: {duration} hari
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
}
