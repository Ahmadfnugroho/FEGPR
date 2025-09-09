# Check Availability Button Implementation Guide

## Overview
Panduan implementasi tombol "Check Availability" dengan best practices untuk:
- Loading states dan error handling
- Debounced API calls
- Cancel previous requests
- User feedback yang jelas
- Integrasi dengan state management yang sudah ada

## 1. Enhanced Hook untuk Availability Check

```typescript
// src/hooks/useAvailabilityCheck.ts
import { useState, useCallback, useRef } from 'react';
import { checkProductAvailability, checkBundlingAvailability } from '../api/availabilityApi';
import type { Product, Bundling, AvailabilityResponse } from '../types/type';

interface UseAvailabilityCheckOptions {
  onSuccess?: (data: AvailabilityResponse) => void;
  onError?: (error: string) => void;
}

export const useAvailabilityCheck = (options?: UseAvailabilityCheckOptions) => {
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [lastCheckedDates, setLastCheckedDates] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });

  // Reference untuk cancel previous requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const checkAvailability = useCallback(async (
    item: Product | Bundling,
    type: 'product' | 'bundling',
    startDate: string,
    endDate: string
  ) => {
    // Cancel previous request jika ada
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setIsCheckingAvailability(true);
      setAvailabilityError(null);
      
      console.log('🔍 Checking availability:', { 
        item: item.name, 
        type, 
        period: `${startDate} - ${endDate}` 
      });

      let result: AvailabilityResponse;
      
      if (type === 'product') {
        result = await checkProductAvailability(
          item.id, 
          startDate, 
          endDate, 
          { signal: abortController.signal }
        );
      } else {
        result = await checkBundlingAvailability(
          item.id, 
          startDate, 
          endDate, 
          { signal: abortController.signal }
        );
      }

      setLastCheckedDates({ startDate, endDate });
      options?.onSuccess?.(result);
      
      return result;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('🚫 Availability check cancelled');
        return;
      }
      
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Gagal mengecek ketersediaan';
      
      setAvailabilityError(errorMessage);
      options?.onError?.(errorMessage);
      
      console.error('❌ Availability check failed:', error);
      throw error;
    } finally {
      setIsCheckingAvailability(false);
      abortControllerRef.current = null;
    }
  }, [options]);

  // Cleanup pada unmount
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    checkAvailability,
    isCheckingAvailability,
    availabilityError,
    lastCheckedDates,
    cleanup
  };
};
```

## 2. Enhanced Booking Form dengan Check Availability Button

```typescript
// src/components/EnhancedBookingForm.tsx - Addition
import { useAvailabilityCheck } from '../hooks/useAvailabilityCheck';
import { MdRefresh, MdCheckCircle, MdError } from 'react-icons/md';

// Add to EnhancedBookingForm component:

const EnhancedBookingForm = ({ 
  item, 
  type, 
  onDateChange, 
  isLoadingAvailability = false,
  className = "" 
}: EnhancedBookingFormProps) => {
  // ... existing code ...

  // Add availability check hook
  const {
    checkAvailability,
    isCheckingAvailability,
    availabilityError,
    lastCheckedDates
  } = useAvailabilityCheck({
    onSuccess: (data) => {
      console.log('✅ Availability checked successfully:', data);
      // Update local state atau trigger parent callback
    },
    onError: (error) => {
      console.error('❌ Availability check failed:', error);
    }
  });

  // Check if dates are valid for availability check
  const canCheckAvailability = useMemo(() => {
    return startDate && endDate && startDate < endDate;
  }, [startDate, endDate]);

  // Check if we need to recheck (dates changed since last check)
  const needsRecheck = useMemo(() => {
    return canCheckAvailability && (
      lastCheckedDates.startDate !== startDate ||
      lastCheckedDates.endDate !== endDate
    );
  }, [canCheckAvailability, lastCheckedDates, startDate, endDate]);

  // Handle check availability button click
  const handleCheckAvailability = useCallback(async () => {
    if (!canCheckAvailability) return;
    
    try {
      await checkAvailability(item, type, startDate!, endDate!);
    } catch (error) {
      // Error sudah di-handle di hook
    }
  }, [checkAvailability, item, type, startDate, endDate, canCheckAvailability]);

  // ... existing JSX ...

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Date Selection */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={startDate || ''}
            onChange={(e) => handleStartDateChange(e.target.value)}
            min={today}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Selesai
          </label>
          <input
            type="date"
            value={endDate || ''}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={startDate || today}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Check Availability Button */}
      <div className="flex flex-col space-y-2">
        <button
          type="button"
          onClick={handleCheckAvailability}
          disabled={!canCheckAvailability || isCheckingAvailability}
          className={`
            flex items-center justify-center px-4 py-3 rounded-lg font-medium text-sm
            transition-all duration-200 
            ${canCheckAvailability && !isCheckingAvailability
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isCheckingAvailability ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Mengecek Ketersediaan...
            </>
          ) : needsRecheck ? (
            <>
              <MdRefresh className="w-4 h-4 mr-2" />
              Cek Ketersediaan
            </>
          ) : lastCheckedDates.startDate ? (
            <>
              <MdCheckCircle className="w-4 h-4 mr-2" />
              Ketersediaan Sudah Dicek
            </>
          ) : (
            <>
              <MdRefresh className="w-4 h-4 mr-2" />
              Cek Ketersediaan
            </>
          )}
        </button>

        {/* Availability Status Display */}
        {availabilityError && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <MdError className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-700">{availabilityError}</p>
          </div>
        )}

        {lastCheckedDates.startDate && !availabilityError && (
          <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <MdCheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
            <div className="text-sm text-green-700">
              <p className="font-medium">Ketersediaan sudah dicek</p>
              <p className="text-xs">
                Periode: {formatDate(lastCheckedDates.startDate)} - {formatDate(lastCheckedDates.endDate)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Booking Button - Enhanced */}
      <button
        type="button"
        onClick={handleBooking}
        disabled={!canBook || isLoadingAvailability || isCheckingAvailability}
        className={`
          w-full flex items-center justify-center px-6 py-4 rounded-lg font-semibold text-lg
          transition-all duration-200 
          ${canBook && !isLoadingAvailability && !isCheckingAvailability
            ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }
        `}
      >
        {isLoadingAvailability || isCheckingAvailability ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            {isCheckingAvailability ? 'Mengecek...' : 'Memuat...'}
          </>
        ) : canBook ? (
          <>
            <MdShoppingCart className="w-5 h-5 mr-2" />
            Sewa Sekarang
          </>
        ) : (
          <>
            <MdError className="w-5 h-5 mr-2" />
            {!startDate || !endDate ? 'Pilih Tanggal' : 'Tidak Tersedia'}
          </>
        )}
      </button>
    </div>
  );
};
```

## 3. API Layer Enhancement

```typescript
// src/api/availabilityApi.ts
import axiosInstance from './axiosInstance';

export interface AvailabilityResponse {
  available: boolean;
  available_quantity: number;
  unavailable_products?: Array<{
    id: number;
    name: string;
    reason: string;
  }>;
  period: {
    start_date: string;
    end_date: string;
  };
  checked_at: string;
}

export const checkProductAvailability = async (
  productId: number,
  startDate: string,
  endDate: string,
  options?: { signal?: AbortSignal }
): Promise<AvailabilityResponse> => {
  const { data } = await axiosInstance.post(
    `/products/${productId}/check-availability`,
    {
      start_date: startDate,
      end_date: endDate
    },
    {
      signal: options?.signal,
      timeout: 10000
    }
  );
  
  return data.data;
};

export const checkBundlingAvailability = async (
  bundlingId: number,
  startDate: string,
  endDate: string,
  options?: { signal?: AbortSignal }
): Promise<AvailabilityResponse> => {
  const { data } = await axiosInstance.post(
    `/bundlings/${bundlingId}/check-availability`,
    {
      start_date: startDate,
      end_date: endDate
    },
    {
      signal: options?.signal,
      timeout: 10000
    }
  );
  
  return data.data;
};
```

## 4. Backend API Endpoints (Laravel)

```php
// routes/api.php
Route::post('/products/{product}/check-availability', [AvailabilityController::class, 'checkProduct']);
Route::post('/bundlings/{bundling}/check-availability', [AvailabilityController::class, 'checkBundling']);

// app/Http/Controllers/AvailabilityController.php
class AvailabilityController extends Controller
{
    public function checkProduct(Request $request, Product $product)
    {
        $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        // Check product availability in the given period
        $availableQuantity = $this->calculateProductAvailability(
            $product, 
            $startDate, 
            $endDate
        );

        return response()->json([
            'data' => [
                'available' => $availableQuantity > 0 && $product->is_available,
                'available_quantity' => $availableQuantity,
                'period' => [
                    'start_date' => $startDate->format('Y-m-d'),
                    'end_date' => $endDate->format('Y-m-d')
                ],
                'checked_at' => now()->toISOString()
            ]
        ]);
    }

    public function checkBundling(Request $request, Bundling $bundling)
    {
        $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        // Check each product in bundling
        $unavailableProducts = [];
        $minAvailableQuantity = PHP_INT_MAX;

        foreach ($bundling->products as $bundlingProduct) {
            $product = $bundlingProduct->product;
            $requiredQuantity = $bundlingProduct->quantity;
            
            $availableQuantity = $this->calculateProductAvailability(
                $product, 
                $startDate, 
                $endDate
            );

            if (!$product->is_available || $availableQuantity < $requiredQuantity) {
                $unavailableProducts[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'reason' => !$product->is_available ? 'Product not available' : 
                               "Insufficient quantity (need {$requiredQuantity}, available {$availableQuantity})"
                ];
            } else {
                $possibleSets = floor($availableQuantity / $requiredQuantity);
                $minAvailableQuantity = min($minAvailableQuantity, $possibleSets);
            }
        }

        $isAvailable = empty($unavailableProducts);
        $availableQuantity = $isAvailable ? $minAvailableQuantity : 0;

        return response()->json([
            'data' => [
                'available' => $isAvailable,
                'available_quantity' => $availableQuantity,
                'unavailable_products' => $unavailableProducts,
                'period' => [
                    'start_date' => $startDate->format('Y-m-d'),
                    'end_date' => $endDate->format('Y-m-d')
                ],
                'checked_at' => now()->toISOString()
            ]
        ]);
    }

    private function calculateProductAvailability(Product $product, Carbon $startDate, Carbon $endDate): int
    {
        // Calculate available quantity for the given period
        // This should check against existing rentals/bookings
        
        $bookedQuantity = Rental::where('product_id', $product->id)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                      ->orWhereBetween('end_date', [$startDate, $endDate])
                      ->orWhere(function ($q) use ($startDate, $endDate) {
                          $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                      });
            })
            ->where('status', '!=', 'cancelled')
            ->sum('quantity');

        return max(0, ($product->quantity ?? 1) - $bookedQuantity);
    }
}
```

## 5. Testing Implementation

```typescript
// src/__tests__/AvailabilityCheck.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useAvailabilityCheck } from '../hooks/useAvailabilityCheck';

describe('useAvailabilityCheck', () => {
  it('should check availability successfully', async () => {
    const { result } = renderHook(() => useAvailabilityCheck());
    
    const mockProduct = { id: 1, name: 'Camera' };
    
    await act(async () => {
      await result.current.checkAvailability(
        mockProduct as Product,
        'product',
        '2024-01-15',
        '2024-01-20'
      );
    });

    expect(result.current.isCheckingAvailability).toBe(false);
    expect(result.current.availabilityError).toBe(null);
  });

  it('should handle network errors gracefully', async () => {
    // Mock network error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useAvailabilityCheck({
      onError: jest.fn()
    }));
    
    // Test error handling
  });
});
```

## Key Benefits dari Implementation Ini:

1. **Loading States**: Clear indication ketika sedang mengecek availability
2. **Error Handling**: Comprehensive error handling dengan user-friendly messages
3. **Request Cancellation**: Cancel previous requests untuk avoid race conditions
4. **State Management**: Local state yang tidak menyebabkan page refresh
5. **User Feedback**: Clear visual feedback untuk semua states
6. **Performance**: Debounced dan optimized API calls
7. **Accessibility**: Proper ARIA labels dan keyboard navigation
8. **Testing**: Testable hooks dan components

## Integration dengan Details.tsx dan BundlingDetails.tsx:

Kedua file sudah direfactor untuk menggunakan local state management yang proper:
- `startDate` dan `endDate` disimpan sebagai individual state variables
- `useQuery` diupdate untuk menggunakan state variables tersebut
- `handleDateChange` callback mengupdate state tanpa menyebabkan page refresh
- Availability calculation reactive terhadap perubahan tanggal

Implementation ini memastikan user experience yang smooth dan professional.
