// src/components/EnhancedBookingForm.tsx
import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAvailability } from '../hooks/useAvailability';
import DateRangePicker from './DateRangePicker';
import { 
  ShoppingCartIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

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

interface EnhancedBookingFormProps {
  item: Product | Bundling;
  type: 'product' | 'bundling';
  className?: string;
}

export default function EnhancedBookingForm({
  item,
  type,
  className = ''
}: EnhancedBookingFormProps) {
  const [dateRange, setDateRange] = useState<{startDate: Date | null, endDate: Date | null}>({
    startDate: null,
    endDate: null
  });
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState(0);
  const [isBookingValid, setIsBookingValid] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const { addItem, totalItems } = useCart();
  const { 
    checkAvailability, 
    getUnavailableDates, 
    isChecking, 
    isLoadingTransactions 
  } = useAvailability();

  // Get unavailable dates for this item
  const unavailableDates = getUnavailableDates(type, item.id);

  // Validate booking form
  useEffect(() => {
    const validateBooking = async () => {
      setValidationError('');
      setIsBookingValid(false);

      if (!dateRange.startDate || !dateRange.endDate) {
        setValidationError('Silakan pilih tanggal rental');
        return;
      }

      if (quantity < 1) {
        setValidationError('Jumlah harus minimal 1');
        return;
      }

      if (duration < 1) {
        setValidationError('Durasi rental harus minimal 1 hari');
        return;
      }

      // Check availability
      try {
        const availabilityResult = await checkAvailability({
          type,
          id: item.id,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          quantity
        });

        if (!availabilityResult.available) {
          if (availabilityResult.availableQuantity === 0) {
            setValidationError('Item tidak tersedia pada tanggal yang dipilih');
          } else {
            setValidationError(
              `Hanya ${availabilityResult.availableQuantity} unit tersedia pada tanggal tersebut`
            );
          }
          return;
        }

        setIsBookingValid(true);
      } catch (error) {
        setValidationError('Gagal memeriksa ketersediaan. Silakan coba lagi.');
      }
    };

    // Debounce validation
    const timer = setTimeout(validateBooking, 500);
    return () => clearTimeout(timer);
  }, [dateRange, quantity, duration, checkAvailability, type, item.id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isBookingValid || !dateRange.startDate || !dateRange.endDate) {
      return;
    }

    const cartItem = {
      type,
      [type === 'product' ? 'productId' : 'bundlingId']: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      thumbnail: type === 'product' 
        ? (item as Product).productPhotos?.[0]?.photo
        : (item as Bundling).bundlingPhotos?.[0]?.photo,
      quantity,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      duration,
      category: item.category,
      brand: item.brand
    };

    addItem(cartItem);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = item.price * quantity * duration;

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Booking {type === 'product' ? 'Produk' : 'Bundling'}
      </h3>

      {/* Item Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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

      {/* Date Range Picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal Rental
        </label>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          onDurationChange={setDuration}
          unavailableDates={unavailableDates}
          disabled={isLoadingTransactions}
          error={validationError && dateRange.startDate && dateRange.endDate ? undefined : validationError}
        />
        
        {duration > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            Durasi: <span className="font-semibold">{duration} hari</span>
          </div>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="mb-6">
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
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
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
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
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
              <span>{duration} hari</span>
            </div>
            <hr className="border-blue-200" />
            <div className="flex justify-between font-semibold text-lg text-blue-600">
              <span>Total:</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Availability Status */}
      {isChecking && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center text-yellow-700">
            <div className="animate-spin h-4 w-4 border-2 border-yellow-700 border-t-transparent rounded-full mr-2"></div>
            Memeriksa ketersediaan...
          </div>
        </div>
      )}

      {isBookingValid && !isChecking && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-700">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Tersedia untuk tanggal yang dipilih
          </div>
        </div>
      )}

      {validationError && !isChecking && dateRange.startDate && dateRange.endDate && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center text-red-700">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            {validationError}
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!isBookingValid || isChecking || isLoadingTransactions}
        className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
          isBookingValid && !isChecking
            ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        <ShoppingCartIcon className="h-5 w-5 mr-2" />
        {isChecking ? 'Memeriksa...' : 'Tambah ke Keranjang'}
        {totalItems > 0 && (
          <span className="ml-2 bg-white text-blue-600 px-2 py-1 rounded-full text-sm font-bold">
            {totalItems}
          </span>
        )}
      </button>

      {/* Additional Info */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <p>• Harga sudah termasuk durasi rental yang dipilih</p>
        <p>• Booking akan dikonfirmasi melalui WhatsApp</p>
        <p>• Pembayaran dilakukan setelah konfirmasi</p>
      </div>
    </div>
  );
}
