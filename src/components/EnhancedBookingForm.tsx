// src/components/EnhancedBookingForm.tsx
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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

  // Check availability and update parent component immediately after date selection
  const checkAvailability = async (): Promise<void> => {
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
      setIsLoading(true);
      setAvailabilityError("");

      // Construct API endpoint
      const endpoint = `/${type}/${item.slug}`;
      const params = {
        start_date: dateRange.startDate.toISOString().split("T")[0],
        end_date: dateRange.endDate.toISOString().split("T")[0],
        quantity: quantity.toString(),
      };

      // Make API call with timeout
      const response = await axiosInstance.get(endpoint, {
        params,
        timeout: 10000, // 10 second timeout
      });

      if (!response?.data?.data) {
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

      // Update booking validity
      setIsBookingValid(isAvailable);
      setLastAvailabilityCheck(new Date());
      
      if (!isAvailable) {
        const message = availableQuantity === 0
          ? `Tidak tersedia untuk periode ${dateRange.startDate.toLocaleDateString("id-ID")} - ${dateRange.endDate.toLocaleDateString("id-ID")}`
          : `Ketersediaan terbatas! Hanya ${availableQuantity} ${type === "product" ? "unit" : "paket"} tersedia, tetapi Anda meminta ${quantity}.`;
        setValidationError(message);
      } else {
        setValidationError("");
        // Show success feedback
        setSubmitSuccess(true);
        setSubmitMessage(`✅ Tersedia ${availableQuantity} ${type === 'product' ? 'unit' : 'paket'} untuk periode yang dipilih!`);
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
          setSubmitMessage("");
        }, 3000);
      }
      
      // Update parent component with new availability data
      if (onAvailabilityUpdate) {
        onAvailabilityUpdate(isAvailable, availableQuantity);
      }
      
    } catch (error: any) {
      let errorMessage = "Gagal memeriksa ketersediaan. ";

      if (error.code === "ECONNABORTED" || error.message === "Request timeout") {
        errorMessage += "Koneksi timeout. ";
      } else if (error.response?.status === 404) {
        errorMessage += "Item tidak ditemukan. ";
      } else if (error.response?.status === 500) {
        errorMessage += "Terjadi kesalahan server. ";
      } else if (!navigator.onLine) {
        errorMessage += "Tidak ada koneksi internet. ";
      } else {
        errorMessage += "Silakan coba lagi. ";
      }

      setAvailabilityError(errorMessage);
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

  // Auto-check availability when date range changes
  useEffect(() => {
    // Reset validation when dates change
    clearValidation();
    
    // Only proceed if both dates are selected
    if (!dateRange.startDate || !dateRange.endDate) return;
    
    // Check availability automatically when dates are selected
    checkAvailability();
    
  }, [dateRange.startDate, dateRange.endDate, quantity, clearValidation]);

  // Basic form validation for display only
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
  }, [
    dateRange.startDate,
    dateRange.endDate,
    quantity,
    isAvailable,
    availableQuantity,
    type,
  ]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
      // If dates are already selected, check availability with new quantity
      if (dateRange.startDate && dateRange.endDate) {
        checkAvailability();
      }
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
}
