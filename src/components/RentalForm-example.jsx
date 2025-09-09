// src/components/RentalForm-example.jsx
// Contoh implementasi lengkap React Component yang menggunakan rental-duration-helper

import React, { useState, useEffect } from 'react';
import { 
  getRentalDays, 
  formatRentalDuration, 
  validateRentalDates,
  calculateRentalPrice,
  formatPrice,
  formatDateForAPI 
} from '../utils/rental-duration-helper';

const RentalFormExample = () => {
  const [startDate, setStartDate] = useState('2025-12-25');
  const [endDate, setEndDate] = useState('2025-12-27');
  const [quantity, setQuantity] = useState(1);
  const [pricePerDay] = useState(50000); // Harga contoh
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk validasi dan durasi
  const [validation, setValidation] = useState({ isValid: true, errors: [], duration: 0 });
  const [duration, setDuration] = useState(0);

  // Update durasi dan validasi saat tanggal berubah
  useEffect(() => {
    if (startDate && endDate) {
      const calculatedDuration = getRentalDays(startDate, endDate);
      setDuration(calculatedDuration);
      
      const validationResult = validateRentalDates(startDate, endDate);
      setValidation(validationResult);
    }
  }, [startDate, endDate]);

  // Fetch products dengan availability berdasarkan date range
  const fetchProducts = async () => {
    if (!validation.isValid || duration === 0) return;

    setIsLoading(true);
    try {
      // Format tanggal untuk API (YYYY-MM-DD)
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);
      
      // Simulate API call dengan slug-based endpoint
      // Contoh: const response = await fetch(`/api/product/canon-eos-r5?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
      // Untuk demo, kita gunakan mock response
      
      setProducts(data.data || []);
      
      console.log(`🔍 API Call: /api/product/{slug}?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
      console.log(`📅 Duration: ${duration} hari (${formatRentalDuration(duration)})`);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback dengan data dummy untuk demo
      setProducts([
        {
          id: 1,
          name: 'Canon EOS R5',
          price: 50000,
          available_quantity: 3 // Untuk periode yang dipilih
        },
        {
          id: 2,
          name: 'Sony A7 III',
          price: 45000,
          available_quantity: 2
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total price
  const totalPrice = calculateRentalPrice(pricePerDay, quantity, duration);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🎯 Rental Form Example - Konsisten dengan Backend Laravel
      </h2>

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Selesai
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Quantity */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jumlah
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Validation & Duration Display */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">📊 Informasi Rental</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Durasi (Frontend React):</span>
            <span className="font-semibold text-blue-600">
              {formatRentalDuration(duration)}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Formula:</span>
            <span className="text-sm text-gray-500 font-mono">
              end.diff(start, 'day') + 1
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Backend Laravel (sama):</span>
            <span className="text-sm text-gray-500 font-mono">
              $end->diffInDays($start) + 1
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Status Validasi:</span>
            <span className={`font-semibold ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
              {validation.isValid ? '✅ Valid' : '❌ Invalid'}
            </span>
          </div>
          
          {validation.errors.length > 0 && (
            <div className="mt-2 text-sm text-red-600">
              <strong>Errors:</strong>
              <ul className="list-disc list-inside ml-2">
                {validation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Price Calculation */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">💰 Kalkulasi Harga</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Harga per hari:</span>
            <span>{formatPrice(pricePerDay)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Jumlah:</span>
            <span>{quantity} unit</span>
          </div>
          
          <div className="flex justify-between">
            <span>Durasi:</span>
            <span>{formatRentalDuration(duration)}</span>
          </div>
          
          <hr className="border-blue-300" />
          
          <div className="flex justify-between text-lg font-bold text-blue-800">
            <span>Total:</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          
          <div className="text-sm text-gray-600 text-center">
            Formula: {formatPrice(pricePerDay)} × {quantity} × {duration} = {formatPrice(totalPrice)}
          </div>
        </div>
      </div>

      {/* Fetch Products Button */}
      <div className="mb-6">
        <button
          onClick={fetchProducts}
          disabled={!validation.isValid || isLoading}
          className={`w-full px-4 py-2 rounded-lg font-semibold transition-colors ${
            validation.isValid && !isLoading
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? '🔄 Loading...' : '🔍 Cek Ketersediaan Produk'}
        </button>
      </div>

      {/* Products List */}
      {products.length > 0 && (
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-4">
            📦 Produk Tersedia ({startDate} - {endDate})
          </h3>
          
          <div className="space-y-3">
            {products.map((product) => (
              <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                  <p className="text-sm text-gray-600">
                    {formatPrice(product.price)}/hari
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">
                    {product.available_quantity} unit tersedia
                  </div>
                  <div className="text-xs text-gray-500">
                    untuk {formatRentalDuration(duration)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">✅ Konsistensi Frontend-Backend</h3>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• Frontend React: menggunakan dayjs dengan formula end.diff(start, 'day') + 1</li>
          <li>• Backend Laravel: menggunakan Carbon dengan formula $end->diffInDays($start) + 1</li>
          <li>• Keduanya menghasilkan durasi inclusive yang sama</li>
          <li>• Format harga konsisten menggunakan Intl.NumberFormat</li>
          <li>• API call menggunakan format tanggal YYYY-MM-DD</li>
        </ul>
      </div>
    </div>
  );
};

export default RentalFormExample;
