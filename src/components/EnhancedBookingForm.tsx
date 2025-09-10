// src/components/EnhancedBookingForm.tsx
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useCart } from "../contexts/CartContext";
import { useSlugAvailability } from "../hooks/useSlugAvailability";
import { useBookingDatesContext } from "../contexts/BookingDatesContext";
import { useQueryClient } from "@tanstack/react-query";
import DateRangePicker from "./DateRangePicker";
import {
  getRentalDays,
  formatRentalDuration,
  calculateRentalPrice,
  formatPrice,
  validateRentalDates,
} from "../utils/rental-duration-helper";
import {
  ShoppingCartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MinusIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import axiosInstance from "../api/axiosInstance";
import {
  isProductAvailable,
  isBundlingAvailable,
  getProductAvailabilityText,
  getBundlingAvailabilityText,
} from "../utils/availabilityUtils";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  category?: {
    name: string;
    slug: string;
  };
  brand?: {
    name: string;
    slug: string;
  };
  productPhotos?: Array<{
    id: number;
    photo: string;
  }>;
}

interface Bundling {
  id: number;
  name: string;
  slug: string;
  price: number;
  category?: {
    name: string;
    slug: string;
  };
  brand?: {
    name: string;
    slug: string;
  };
  bundlingPhotos?: Array<{
    id: number;
    photo: string;
  }>;
}

interface AvailabilityResult {
  isAvailable: boolean;
  availableQuantity: number;
  message: string;
  details?: {
    conflictingDates?: string[];
    nextAvailableDate?: string;
    suggestedQuantity?: number;
  };
  lastChecked: string;
}

interface EnhancedBookingFormProps {
  item: Product | Bundling;
  type: "product" | "bundling";
  className?: string;
  isLoadingAvailability?: boolean;
  isAvailable?: boolean;
  availableQuantity?: number;
  onAvailabilityUpdate?: (isAvailable: boolean, availableQuantity: number) => void;
}

export default function EnhancedBookingForm({
  item,
  type,
  className = "",
  isLoadingAvailability = false,
  isAvailable = true,
  availableQuantity = 0,
  onAvailabilityUpdate,
}: EnhancedBookingFormProps) {
  // Use global date context instead of local state
  const {
    dateRange,
    setDateRange,
    startDate,
    endDate,
    isDateRangeValid,
    areDatesSelected,
    formattedDateRange,
    updateCount,
  } = useBookingDatesContext();

  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState(0);
  const [isBookingValid, setIsBookingValid] = useState(false);
  const [validationError, setValidationError] = useState<string>("");

  // Local dates state - does NOT update global context until form submit
  const [localDates, setLocalDates] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  // Availability checking states
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] =
    useState<AvailabilityResult | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string>("");
  const [lastAvailabilityCheck, setLastAvailabilityCheck] =
    useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const { addItem, totalItems } = useCart();
  const { checkItemAvailability, isChecking } = useSlugAvailability();
  
  // React Query client for smooth cache invalidation
  const queryClient = useQueryClient();

  // Maximum retry attempts for API calls
  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY_MS = 1000;

  // Check availability with comprehensive error handling and retry logic
  const checkAvailabilityWithAPI = async (
    shouldRetry: boolean = true
  ): Promise<void> => {
    // Validate inputs first
    if (!dateRange.startDate || !dateRange.endDate) {
      setAvailabilityError("Silakan pilih tanggal rental terlebih dahulu");
      return;
    }

    if (quantity < 1 || quantity > 10) {
      setAvailabilityError("Jumlah harus antara 1-10 unit");
      return;
    }

    // Validate date range
    const validation = validateRentalDates(
      dateRange.startDate,
      dateRange.endDate
    );
    if (!validation.isValid) {
      setAvailabilityError(
        validation.errors[0] || "Rentang tanggal tidak valid"
      );
      return;
    }

    try {
      setIsCheckingAvailability(true);
      setAvailabilityError("");
      setAvailabilityResult(null);

      console.log(`🔍 Checking availability for ${type} "${item.slug}":`, {
        dateRange: {
          start: dateRange.startDate.toISOString().split("T")[0],
          end: dateRange.endDate.toISOString().split("T")[0],
        },
        quantity,
        duration: validation.duration,
        retryAttempt: retryCount + 1,
      });

      // Construct API endpoint
      const endpoint = `/${type}/${item.slug}`;
      const params = {
        start_date: dateRange.startDate.toISOString().split("T")[0],
        end_date: dateRange.endDate.toISOString().split("T")[0],
        check_availability: true,
        quantity: quantity.toString(),
      };

      // Make API call with timeout
      const response = (await Promise.race([
        axiosInstance.get(endpoint, {
          params,
          timeout: 10000, // 10 second timeout
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 10000)
        ),
      ])) as any;

      if (!response?.data) {
        throw new Error("Invalid response from server");
      }

      const itemData = response.data.data;
      let availabilityInfo;
      let availableQuantity;

      // Calculate availability based on type
      if (type === "product") {
        availabilityInfo = getProductAvailabilityText(itemData);
        availableQuantity = itemData.available_quantity || 0;
      } else {
        availabilityInfo = getBundlingAvailabilityText(itemData);
        // For bundling, calculate minimum available quantity from all products
        if (itemData.products && itemData.products.length > 0) {
          availableQuantity = Math.min(
            ...itemData.products.map((p: any) => p.available_quantity || 0)
          );
        } else {
          availableQuantity = 0;
        }
      }

      const isAvailable =
        availabilityInfo.isAvailable && availableQuantity >= quantity;

      // Prepare result
      const result: AvailabilityResult = {
        isAvailable,
        availableQuantity,
        message: isAvailable
          ? `✅ Tersedia! ${availableQuantity} ${
              type === "product" ? "unit" : "paket"
            } tersedia untuk periode yang dipilih.`
          : availableQuantity === 0
          ? `❌ Tidak tersedia untuk periode ${dateRange.startDate.toLocaleDateString(
              "id-ID"
            )} - ${dateRange.endDate.toLocaleDateString("id-ID")}`
          : `⚠️ Ketersediaan terbatas! Hanya ${availableQuantity} ${
              type === "product" ? "unit" : "paket"
            } tersedia, tetapi Anda meminta ${quantity}.`,
        details: {
          suggestedQuantity:
            !isAvailable && availableQuantity > 0
              ? availableQuantity
              : undefined,
        },
        lastChecked: new Date().toISOString(),
      };

      setAvailabilityResult(result);
      setLastAvailabilityCheck(new Date());
      setRetryCount(0);

      // Update booking validity
      setIsBookingValid(isAvailable);
      if (!isAvailable) {
        setValidationError(result.message);
      } else {
        setValidationError("");
      }

      console.log(`✅ Availability check completed:`, result);
    } catch (error: any) {
      console.error(`❌ Availability check failed:`, error);

      let errorMessage = "Gagal memeriksa ketersediaan. ";

      if (
        error.code === "ECONNABORTED" ||
        error.message === "Request timeout"
      ) {
        errorMessage += "Koneksi timeout. ";
      } else if (error.response?.status === 404) {
        errorMessage += "Item tidak ditemukan. ";
      } else if (error.response?.status === 500) {
        errorMessage += "Terjadi kesalahan server. ";
      } else if (error.response?.status >= 400) {
        errorMessage += "Terjadi kesalahan dalam permintaan. ";
      } else if (!navigator.onLine) {
        errorMessage += "Tidak ada koneksi internet. ";
      } else {
        errorMessage += "Terjadi kesalahan tidak terduga. ";
      }

      // Retry logic with exponential backoff
      if (shouldRetry && retryCount < MAX_RETRY_ATTEMPTS) {
        const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
        errorMessage += `Mencoba lagi dalam ${delay / 1000} detik...`;
        setAvailabilityError(errorMessage);
        setRetryCount((prev) => prev + 1);

        setTimeout(() => {
          checkAvailabilityWithAPI(false);
        }, delay);

        return;
      }

      errorMessage += "Silakan coba lagi nanti.";
      setAvailabilityError(errorMessage);
      setRetryCount(0);
      setIsBookingValid(false);
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // For now, we'll use empty unavailable dates array
  // In a real implementation, you might want to fetch this from another API
  const unavailableDates: Date[] = [];

  // Helper function to check if availability check is needed
  const isAvailabilityCheckNeeded = (): boolean => {
    if (!dateRange.startDate || !dateRange.endDate) return false;
    if (!lastAvailabilityCheck) return true;

    // Check if it's been more than 5 minutes since last check
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return lastAvailabilityCheck < fiveMinutesAgo;
  };

  // Helper function to format time since last check
  const getTimeSinceLastCheck = (): string => {
    if (!lastAvailabilityCheck) return "Belum pernah diperiksa";

    const now = new Date();
    const diffMs = now.getTime() - lastAvailabilityCheck.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    if (diffMinutes > 0) {
      return `${diffMinutes} menit yang lalu`;
    } else {
      return `${diffSeconds} detik yang lalu`;
    }
  };

  // Clear availability results when form inputs change
  const clearAvailabilityResults = useCallback((): void => {
    setAvailabilityResult(null);
    setAvailabilityError("");
    setIsBookingValid(false);
  }, []);

  // Memoize date strings to prevent unnecessary calls
  const dateStrings = useMemo(() => {
    const startDateStr = dateRange.startDate
      ? dateRange.startDate.toISOString().split("T")[0]
      : null;
    const endDateStr = dateRange.endDate
      ? dateRange.endDate.toISOString().split("T")[0]
      : null;
    return { startDateStr, endDateStr };
  }, [dateRange.startDate, dateRange.endDate]);

  // Use ref to track if we've already notified about current dates
  const lastNotifiedDates = useRef<{
    start: string | null;
    end: string | null;
  }>({ start: null, end: null });

  // Debug logging for EnhancedBookingForm state
  useEffect(() => {
    console.log("📅 EnhancedBookingForm: State update:", {
      contextDates: {
        startDate: startDate,
        endDate: endDate,
      },
      dateRange: {
        startDate: dateRange.startDate?.toISOString(),
        endDate: dateRange.endDate?.toISOString(),
      },
      dateStrings,
      quantity,
      duration,
      isBookingValid,
      validationError,
      itemSlug: item.slug,
      type,
      areDatesSelected,
      updateCount,
      source: "EnhancedBookingForm_state_debug",
    });
  }, [
    startDate,
    endDate,
    dateRange,
    dateStrings,
    quantity,
    duration,
    isBookingValid,
    validationError,
    item.slug,
    type,
    areDatesSelected,
    updateCount,
  ]);

  // Note: No longer notifying parent components since we use global context
  // The context automatically manages state across all components
  useEffect(() => {
    const { startDateStr, endDateStr } = dateStrings;

    console.log("🔄 EnhancedBookingForm: Date strings updated via context:", {
      currentDates: { startDateStr, endDateStr },
      contextDates: { startDate, endDate },
      source: "context_date_sync",
    });
  }, [dateStrings, startDate, endDate]);

  // Use ref to track if we should clear results
  const shouldClearResults = useRef(true);

  // Clear availability results when key inputs change
  useEffect(() => {
    if (shouldClearResults.current) {
      clearAvailabilityResults();
      shouldClearResults.current = false;
      // Reset flag after a short delay
      setTimeout(() => {
        shouldClearResults.current = true;
      }, 100);
    }
  }, [
    dateRange.startDate,
    dateRange.endDate,
    quantity,
    clearAvailabilityResults,
  ]);

  // Form submission handler - validates dates and fetches updated availability
  const handleSubmitDateSelection = async () => {
    try {
      setIsSubmitting(true);
      setValidationError("");
      
      // Validate dates
      if (!localDates.startDate || !localDates.endDate) {
        setValidationError("Pilih tanggal rental terlebih dahulu");
        return;
      }
      
      // Validate dates with business rules
      const validation = validateRentalDates(localDates.startDate, localDates.endDate);
      if (!validation.isValid) {
        setValidationError(validation.errors[0] || "Tanggal tidak valid");
        return;
      }
      
      if (quantity < 1) {
        setValidationError("Jumlah harus minimal 1");
        return;
      }
      
      console.log('🚀 Submitting date selection form:', {
        localDates,
        quantity,
        duration,
        source: 'date_form_submission'
      });
      
      // Prepare API endpoint with date parameters
      const startDateStr = localDates.startDate.toISOString().split('T')[0];
      const endDateStr = localDates.endDate.toISOString().split('T')[0];
      const endpoint = `/${type}/${item.slug}?start_date=${startDateStr}&end_date=${endDateStr}`;
      
      console.log('🔄 Fetching updated availability:', {
        endpoint,
        startDate: startDateStr,
        endDate: endDateStr,
        source: 'api_call_with_dates'
      });
      
      // Fetch updated item data with availability for selected dates
      const response = await axiosInstance.get(endpoint, {
        timeout: 10000
      });
      
      console.log('✅ Updated item data received:', response.data);
      
      // Extract availability data from response
      const itemData = response.data.data;
      let newAvailableQuantity = 0;
      let newIsAvailable = false;
      
      if (type === 'product') {
        // For product, use available_quantity directly
        newAvailableQuantity = itemData.available_quantity || 0;
        newIsAvailable = itemData.status === 'available' && newAvailableQuantity > 0;
      } else {
        // For bundling, find minimum available_quantity from products array
        if (itemData.products && itemData.products.length > 0) {
          newAvailableQuantity = Math.min(
            ...itemData.products.map((product: any) => product.available_quantity || 0)
          );
          newIsAvailable = newAvailableQuantity > 0;
        }
      }
      
      console.log('📊 Extracted availability data:', {
        type,
        newAvailableQuantity,
        newIsAvailable,
        source: 'api_response_parsing'
      });
      
      // Update global context with validated dates
      setDateRange({
        startDate: localDates.startDate,
        endDate: localDates.endDate
      });
      
      // Show success feedback with new availability info
      setValidationError("");
      setSubmitSuccess(true);
      
      const availabilityText = newIsAvailable 
        ? `Tersedia ${newAvailableQuantity} ${type === 'product' ? 'unit' : 'paket'}`
        : 'Tidak tersedia';
        
      setSubmitMessage(`✅ Tanggal berhasil disubmit! ${availabilityText} untuk periode ${localDates.startDate.toLocaleDateString('id-ID')} - ${localDates.endDate.toLocaleDateString('id-ID')}.`);
      
      // Update parent component with new availability data
      if (onAvailabilityUpdate) {
        onAvailabilityUpdate(newIsAvailable, newAvailableQuantity);
        console.log('✨ Parent component updated with new availability!');
      } else {
        console.log('✨ Availability updated (no callback provided)');
      }
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitMessage("");
      }, 3000);
      
    } catch (error: any) {
      console.error('❌ Error submitting date selection:', error);
      setValidationError(
        error.response?.data?.message || 'Gagal memproses tanggal. Silakan coba lagi.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Basic form validation for display only
  useEffect(() => {
    const validateForm = () => {
      // Reset validation for display
      setIsBookingValid(false);

      if (!localDates.startDate || !localDates.endDate) {
        return;
      }

      // Validate dates with business rules
      const validation = validateRentalDates(
        localDates.startDate,
        localDates.endDate
      );

      if (!validation.isValid) {
        return;
      }

      if (quantity < 1) {
        return;
      }

      // Check availability from parent data
      if (!isAvailable) {
        return;
      }

      if (availableQuantity > 0 && quantity > availableQuantity) {
        return;
      }

      // All validations passed
      setIsBookingValid(true);
    };

    validateForm();
  }, [
    localDates.startDate,
    localDates.endDate,
    quantity,
    isAvailable,
    availableQuantity,
    type,
  ]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
      // Results will be cleared automatically by useEffect
    }
  };

  const handleAddToCart = () => {
    // Use global context dates (should be set after form submission)
    if (!dateRange.startDate || !dateRange.endDate) {
      console.warn('Cannot add to cart - no global dates:', {
        hasGlobalStartDate: !!dateRange.startDate,
        hasGlobalEndDate: !!dateRange.endDate,
        message: 'Submit tanggal rental terlebih dahulu'
      });
      return;
    }
    
    if (!isAvailable) {
      console.warn('Cannot add to cart - item not available:', {
        isAvailable,
        message: 'Item tidak tersedia untuk tanggal yang dipilih'
      });
      return;
    }

    const cartItem = {
      type,
      [type === "product" ? "productId" : "bundlingId"]: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      thumbnail:
        type === "product"
          ? (item as Product).productPhotos?.[0]?.photo
          : (item as Bundling).bundlingPhotos?.[0]?.photo,
      quantity,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      duration,
      category: item.category,
      brand: item.brand,
    };

    addItem(cartItem);
    console.log('✅ Item added to cart:', cartItem);
  };

  // Use formatPrice from helper function instead

  const totalPrice = calculateRentalPrice(item.price, quantity, duration);

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900">
        Booking {type === "product" ? "Produk" : "Bundling"}
      </h3>

      {/* Item Info */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            {item.category && <span>{item.category.name}</span>}
            {item.category && item.brand && <span> • </span>}
            {item.brand && <span>{item.brand.name}</span>}
          </div>
          <div className="font-semibold text-blue-600">
            {formatPrice(item.price)}/hari
          </div>
        </div>
      </div>

      {/* Date Range Picker - Local State Only */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal Rental
        </label>
        <DateRangePicker
          defaultValue={{ startDate: null, endDate: null }}
          onLocalChange={(localDateRange) => {
            console.log("📅 EnhancedBookingForm: Local date change:", {
              localDateRange: {
                startDate: localDateRange.startDate?.toISOString(),
                endDate: localDateRange.endDate?.toISOString(),
              },
              source: "local_date_picker_change",
            });

            // Update duration calculation for local display
            if (localDateRange.startDate && localDateRange.endDate) {
              const newDuration = getRentalDays(
                localDateRange.startDate,
                localDateRange.endDate
              );
              setDuration(newDuration);
            } else {
              setDuration(0);
            }

            // Store local dates for form submission
            setLocalDates(localDateRange);
          }}
          unavailableDates={unavailableDates}
          disabled={false}
          error={validationError}
        />

        {duration > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            Durasi:{" "}
            <span className="font-semibold">
              {formatRentalDuration(duration)}
            </span>
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jumlah
        </label>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="p-2 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) =>
              handleQuantityChange(parseInt(e.target.value) || 1)
            }
            className="w-20 text-center border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 10}
            className="p-2 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600">unit</span>
        </div>
      </div>

      {/* Price Calculation */}
      {duration > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Harga per hari:</span>
              <span>{formatPrice(item.price)}</span>
            </div>
            <div className="flex justify-between">
              <span>Jumlah:</span>
              <span>{quantity} unit</span>
            </div>
            <div className="flex justify-between">
              <span>Durasi:</span>
              <span>{formatRentalDuration(duration)}</span>
            </div>
            <hr className="border-blue-200" />
            <div className="flex justify-between font-semibold text-lg text-blue-600">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && submitMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-pulse">
          <div className="flex items-center text-green-700">
            <CheckCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <div className="text-sm font-medium">{submitMessage}</div>
          </div>
        </div>
      )}
      
      {/* Validation Error */}
      {validationError && !submitSuccess && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center text-orange-700">
            <ExclamationTriangleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <div className="text-sm">{validationError}</div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="space-y-3">
        {/* Submit Date Selection Button */}
        <button
          type="button"
          onClick={handleSubmitDateSelection}
          disabled={isSubmitting || !localDates.startDate || !localDates.endDate || quantity < 1}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
            !isSubmitting && localDates.startDate && localDates.endDate && quantity >= 1
              ? "bg-green-600 hover:bg-green-700 hover:shadow-lg transform hover:scale-[1.02]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          title={
            !localDates.startDate || !localDates.endDate
              ? "Pilih tanggal rental terlebih dahulu"
              : quantity < 1
                ? "Pilih jumlah minimal 1"
                : isSubmitting
                  ? "Sedang memproses..."
                  : "Submit tanggal rental untuk cek ketersediaan"
          }
        >
          {isSubmitting ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              Memperbarui Data...
            </>
          ) : submitSuccess ? (
            <>
              <CheckCircleIcon className="h-5 w-5 mr-2 text-green-400" />
              Berhasil Disubmit!
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              {!localDates.startDate || !localDates.endDate
                ? "Pilih Tanggal Dulu"
                : "Submit Tanggal Rental"}
            </>
          )}
        </button>
        
        {/* Add to Cart Button - Only enabled after date submission */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!dateRange.startDate || !dateRange.endDate || !isAvailable || isSubmitting}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
            dateRange.startDate && dateRange.endDate && isAvailable && !isSubmitting
              ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          title={
            !dateRange.startDate || !dateRange.endDate
              ? "Submit tanggal rental terlebih dahulu"
              : !isAvailable
                ? "Item tidak tersedia untuk tanggal yang dipilih"
                : isSubmitting
                  ? "Tunggu proses selesai"
                  : "Tambah ke keranjang belanja"
          }
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          {!dateRange.startDate || !dateRange.endDate
            ? "Submit Tanggal Dulu"
            : !isAvailable
              ? "Tidak Tersedia"
              : "Tambah ke Keranjang"}
          {totalItems > 0 && dateRange.startDate && dateRange.endDate && isAvailable && (
            <span className="ml-2 bg-white text-blue-600 px-2 py-1 rounded-full text-sm font-bold">
              {totalItems}
            </span>
          )}
        </button>
        
        {/* Status Information */}
        <div className="text-center space-y-1">
          {submitSuccess ? (
            <p className="text-xs text-green-600 font-medium animate-pulse">
              ✨ Tanggal berhasil disubmit! Data ketersediaan diperbarui.
            </p>
          ) : isSubmitting ? (
            <p className="text-xs text-blue-600 font-medium">
              🔄 Memperbarui ketersediaan...
            </p>
          ) : !localDates.startDate || !localDates.endDate ? (
            <p className="text-xs text-gray-500">
              📅 Pilih tanggal rental untuk melanjutkan
            </p>
          ) : !dateRange.startDate || !dateRange.endDate ? (
            <p className="text-xs text-orange-600">
              📝 Submit tanggal untuk cek ketersediaan
            </p>
          ) : !isAvailable ? (
            <p className="text-xs text-red-600">
              🚫 Tidak tersedia untuk periode yang dipilih
            </p>
          ) : (
            <p className="text-xs text-green-600">
              ✨ Siap ditambahkan ke keranjang
            </p>
          )}
          
          {/* Current global dates display */}
          {dateRange.startDate && dateRange.endDate && (
            <p className="text-xs text-blue-500">
              📅 Periode: {dateRange.startDate.toLocaleDateString('id-ID')} - {dateRange.endDate.toLocaleDateString('id-ID')}
            </p>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 mb-6 text-xs text-gray-500 space-y-1">
        <p>• Harga sudah termasuk durasi rental yang dipilih</p>
        <p>• Booking akan dikonfirmasi melalui WhatsApp</p>
        <p>• Pembayaran dilakukan setelah konfirmasi</p>
      </div>
    </div>
  );
}
