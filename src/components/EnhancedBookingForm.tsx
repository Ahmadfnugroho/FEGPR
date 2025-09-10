// src/components/EnhancedBookingForm.tsx
import { useState, useEffect, useCallback, useRef, useMemo, memo } from "react";
import { useCart } from "../contexts/CartContext";
import { useSlugAvailability } from "../hooks/useSlugAvailability";
import { useBookingDatesContext } from "../contexts/BookingDatesContext";
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

const EnhancedBookingForm = memo(function EnhancedBookingForm({
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

  // Single loading state for date changes and API requests
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  // Availability checking states - simplified
  const [availabilityError, setAvailabilityError] = useState<string>("");
  const [lastAvailabilityCheck, setLastAvailabilityCheck] = useState<Date | null>(null);

  const { addItem, totalItems } = useCart();
  const { checkItemAvailability, isChecking } = useSlugAvailability();

  // Maximum retry attempts for API calls
  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY_MS = 1000;

  // Simplified availability check with guaranteed YYYY-MM-DD format
  const checkAvailability = async (): Promise<void> => {
    // Validate inputs first
    if (!dateRange.startDate || !dateRange.endDate) {
      setAvailabilityError("Silakan pilih tanggal rental terlebih dahulu");
      return;
    }

    try {
      setIsLoading(true);
      setAvailabilityError("");
      setValidationError("");

      // Ensure YYYY-MM-DD format for API call
      const formatDateForAPI = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const startDateStr = formatDateForAPI(dateRange.startDate);
      const endDateStr = formatDateForAPI(dateRange.endDate);
      
      console.log(`🔍 Checking availability for ${type} ${item.slug}:`, {
        startDate: startDateStr,
        endDate: endDateStr,
        quantity
      });

      // Make API call
      const response = await axiosInstance.get(`/${type}/${item.slug}`, {
        params: {
          start_date: startDateStr,
          end_date: endDateStr,
        },
        timeout: 8000
      });

      const itemData = response.data?.data;
      if (!itemData) {
        throw new Error("No data received from server");
      }

      let availableQuantity = 0;
      let isItemAvailable = false;

      if (type === "product") {
        // Simple product availability
        availableQuantity = itemData.available_quantity || 0;
        isItemAvailable = availableQuantity >= quantity;
      } else {
        // Bundling availability - minimum available quantity from all products
        if (itemData.products && itemData.products.length > 0) {
          const productQuantities = itemData.products.map((p: any) => p.available_quantity || 0);
          availableQuantity = Math.min(...productQuantities);
          isItemAvailable = availableQuantity >= quantity;
          
          console.log(`📦 Bundling availability:`, {
            products: itemData.products.map((p: any) => ({ 
              name: p.name, 
              available_quantity: p.available_quantity 
            })),
            minQuantity: availableQuantity,
            requestedQuantity: quantity,
            isAvailable: isItemAvailable
          });
        }
      }

      // Update states
      setIsBookingValid(isItemAvailable);
      setLastAvailabilityCheck(new Date());
      
      if (isItemAvailable) {
        setSubmitSuccess(true);
        setSubmitMessage(`✅ Tersedia ${availableQuantity} ${type === 'product' ? 'unit' : 'paket'}!`);
        setTimeout(() => {
          setSubmitSuccess(false);
          setSubmitMessage("");
        }, 2000);
      } else {
        const message = availableQuantity === 0
          ? `Tidak tersedia untuk periode ${startDateStr} sampai ${endDateStr}`
          : `Ketersediaan terbatas! Hanya tersedia ${availableQuantity} ${type === "product" ? "unit" : "paket"}`;
        setValidationError(message);
      }
      
      // Notify parent component
      if (onAvailabilityUpdate) {
        onAvailabilityUpdate(isItemAvailable, availableQuantity);
      }
      
    } catch (error: any) {
      console.error('❌ Availability check failed:', error);
      setAvailabilityError("Gagal memeriksa ketersediaan. Silakan coba lagi.");
      setIsBookingValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  // For now, we'll use empty unavailable dates array
  // In a real implementation, you might want to fetch this from another API
  const unavailableDates: Date[] = [];

  // Helper function to check if availability check is needed
  const isAvailabilityCheckNeeded = (): boolean => {
    if (!dateRange.startDate || !dateRange.endDate) return false;
    if (!lastAvailabilityCheck) return true;
    
    // Reduced refresh interval - check only if more than 2 minutes have passed
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    return lastAvailabilityCheck < twoMinutesAgo;
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

  // Clear validation when form inputs change
  const clearValidation = useCallback((): void => {
    setAvailabilityError("");
    setValidationError("");
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

  // Production logging removed - debug logs only active in development
  // useEffect(() => {
  //   if (process.env.NODE_ENV === 'development') {
  //     console.log("📅 EnhancedBookingForm: State update:", {
  //       dateRange, quantity, duration, isBookingValid, validationError,
  //     });
  //   }
  // }, [dateRange, quantity, duration, isBookingValid, validationError]);

  // Auto-check availability when date range changes - with stability check
  const stableDateRange = useMemo(() => ({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  }), [dateRange.startDate?.getTime(), dateRange.endDate?.getTime()]);

  useEffect(() => {
    // Reset validation when dates change
    clearValidation();
    
    // Only proceed if both dates are selected
    if (!stableDateRange.startDate || !stableDateRange.endDate) return;
    
    // Add small delay to prevent rapid API calls during date selection
    const timeoutId = setTimeout(() => {
      checkAvailability();
    }, 800); // Further increased delay to 800ms
    
    return () => clearTimeout(timeoutId);
    
  }, [stableDateRange.startDate, stableDateRange.endDate, quantity]);

  // Basic form validation for display only - optimized with stable dependency
  const validationDeps = useMemo(() => ({
    startDate: dateRange.startDate?.getTime(),
    endDate: dateRange.endDate?.getTime(),
    quantity,
    isAvailable,
    availableQuantity,
    type,
  }), [dateRange.startDate?.getTime(), dateRange.endDate?.getTime(), quantity, isAvailable, availableQuantity, type]);

  useEffect(() => {
    const validateForm = () => {
      // Reset validation for display
      setIsBookingValid(false);

      if (!dateRange.startDate || !dateRange.endDate) {
        return;
      }

      // Validate dates with business rules
      const validation = validateRentalDates(
        dateRange.startDate,
        dateRange.endDate
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
  }, [validationDeps]);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
      // Availability will be checked automatically via useEffect
    }
  }, []);

  const handleAddToCart = useCallback(() => {
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
  }, [type, item, quantity, dateRange.startDate, dateRange.endDate, duration, isAvailable, addItem]);

  // Memoized price calculation to prevent unnecessary recalculation
  const totalPrice = useMemo(() => 
    calculateRentalPrice(item.price, quantity, duration), 
    [item.price, quantity, duration]
  );

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

      {/* Date Range Picker - Updates Global Context */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal Rental
        </label>
        <DateRangePicker
          defaultValue={dateRange}
          onLocalChange={(newDateRange) => {
            // Update duration calculation for display
            if (newDateRange.startDate && newDateRange.endDate) {
              const newDuration = getRentalDays(
                newDateRange.startDate,
                newDateRange.endDate
              );
              setDuration(newDuration);
            } else {
              setDuration(0);
            }

            // Update global context directly
            setDateRange(newDateRange);
          }}
          unavailableDates={unavailableDates}
          disabled={isLoading}
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

      {/* Form Actions - Simplified to single Add to Cart button */}
      <div className="space-y-3">
        {/* Only Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!dateRange.startDate || !dateRange.endDate || !isAvailable || isLoading}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
            dateRange.startDate && dateRange.endDate && isAvailable && !isLoading
              ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          title={
            !dateRange.startDate || !dateRange.endDate
              ? "Pilih tanggal rental terlebih dahulu"
              : !isAvailable
                ? "Item tidak tersedia untuk tanggal yang dipilih"
                : isLoading
                  ? "Tunggu proses selesai"
                  : "Tambah ke keranjang belanja"
          }
        >
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          {isLoading ? (
            <>
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
              Memeriksa Ketersediaan...
            </>
          ) : !dateRange.startDate || !dateRange.endDate ? (
            "Pilih Tanggal Dulu"
          ) : !isAvailable ? (
            "Tidak Tersedia"
          ) : (
            "Tambah ke Keranjang"
          )}
          {totalItems > 0 && dateRange.startDate && dateRange.endDate && isAvailable && (
            <span className="ml-2 bg-white text-blue-600 px-2 py-1 rounded-full text-sm font-bold">
              {totalItems}
            </span>
          )}
        </button>
        
        {/* Status Information - Simplified */}
        <div className="text-center space-y-1">
          {submitSuccess ? (
            <p className="text-xs text-green-600 font-medium animate-pulse">
              ✨ {submitMessage}
            </p>
          ) : isLoading ? (
            <p className="text-xs text-blue-600 font-medium">
              🔄 Memeriksa ketersediaan...
            </p>
          ) : !dateRange.startDate || !dateRange.endDate ? (
            <p className="text-xs text-gray-500">
              📅 Pilih tanggal rental untuk melanjutkan
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
});

export default EnhancedBookingForm;
