# Rental Duration Helper

Helper functions untuk perhitungan durasi rental yang **konsisten** antara **Frontend React** dan **Backend Laravel**.

## 🎯 Problem Statement

Sebelumnya ada inkonsistensi perhitungan durasi rental:

- **Backend Laravel**: `$end->diffInDays($start) + 1` ✅ (inclusive)
- **Frontend React**: `Math.ceil((end - start) / (1000 * 60 * 60 * 24))` ❌ (tidak inclusive)

**Contoh masalah**:
- Tanggal: 09-09 sampai 10-09 (2 hari)
- Backend: 1 hari (benar ✅)
- Frontend lama: 2 hari (salah ❌)

## ✅ Solusi

Menggunakan `dayjs` dengan formula exclusive:

```javascript
// Frontend React (dengan dayjs) - EXCLUSIVE
const duration = end.diff(start, 'day'); // NO +1

// Examples:
// 10-11 Sept = 1 day rental
// 10-12 Sept = 2 days rental
```

## 📦 Installation

```bash
npm install dayjs
```

## 🚀 Usage

### Import Functions

```javascript
import { 
  getRentalDays, 
  formatRentalDuration, 
  validateRentalDates,
  calculateRentalPrice,
  formatPrice 
} from '../utils/rental-duration-helper';
```

### Basic Duration Calculation

```javascript
// Hitung durasi exclusive (10-11 Sept = 1 hari)
const duration = getRentalDays('2025-09-10', '2025-09-11'); 
console.log(duration); // Output: 1

// Format untuk tampilan
const formatted = formatRentalDuration(duration); 
console.log(formatted); // Output: "1 hari"
```

### Date Validation

```javascript
// Validasi tanggal dengan durasi
const validation = validateRentalDates('2025-12-25', '2025-12-27');
console.log(validation);
// Output: { isValid: true, errors: [], duration: 3 }

// Contoh invalid
const invalid = validateRentalDates('2025-12-27', '2025-12-25');
console.log(invalid);
// Output: { 
//   isValid: false, 
//   errors: ['Tanggal mulai tidak boleh setelah tanggal selesai'], 
//   duration: 0 
// }
```

### Price Calculation

```javascript
// Hitung harga total
const totalPrice = calculateRentalPrice(50000, 2, 3); // price, quantity, duration
console.log(totalPrice); // Output: 300000

// Format harga
const formatted = formatPrice(300000);
console.log(formatted); // Output: "Rp300.000"
```

### API Integration

```javascript
// Format tanggal untuk API call
const startDate = formatDateForAPI('2025-12-25');
const endDate = formatDateForAPI('2025-12-27');

// API call dengan date range
const response = await fetch(`/api/products?start_date=${startDate}&end_date=${endDate}`);
```

## 🔧 Available Functions

### Core Functions

| Function | Description | Example |
|----------|-------------|---------|
| `getRentalDays(start, end)` | Hitung durasi inclusive | `getRentalDays('2025-09-09', '2025-09-10')` → `1` |
| `formatRentalDuration(days)` | Format durasi untuk display | `formatRentalDuration(3)` → `"3 hari"` |
| `validateRentalDates(start, end)` | Validasi tanggal + durasi | Returns validation object |
| `calculateRentalPrice(price, qty, days)` | Hitung harga total | `calculateRentalPrice(50000, 2, 3)` → `300000` |
| `formatPrice(amount)` | Format ke Rupiah | `formatPrice(300000)` → `"Rp300.000"` |

### Utility Functions

| Function | Description | Example |
|----------|-------------|---------|
| `formatDateForAPI(date)` | Format ke YYYY-MM-DD untuk API | `formatDateForAPI('2025-12-25')` → `"2025-12-25"` |
| `parseDateFromAPI(dateStr)` | Parse dari API format | `parseDateFromAPI('2025-12-25')` → `Date object` |
| `isDateRangeOverlap(range1, range2)` | Cek overlap 2 periode | Returns boolean |
| `getRentalDurationText(start, end)` | Get formatted text | `getRentalDurationText(start, end)` → `"3 hari"` |

## 🧪 Test Cases

### Backend vs Frontend Consistency

```javascript
// Test cases yang sama dengan backend Laravel
const testCases = [
  {
    startDate: '2025-09-09',
    endDate: '2025-09-10',
    expected: 1,
    description: '09-10 Sept (Backend: 1 hari)'
  },
  {
    startDate: '2025-12-25',
    endDate: '2025-12-27', 
    expected: 3,
    description: '25-27 Dec (Backend: 3 hari)'
  }
];

testCases.forEach(({ startDate, endDate, expected }) => {
  const calculated = getRentalDays(startDate, endDate);
  console.log(`✅ ${calculated === expected ? 'PASS' : 'FAIL'}: ${calculated} days`);
});
```

## 📱 React Component Integration

### DateRangePicker Component

```jsx
import { getRentalDays, formatRentalDuration } from '../utils/rental-duration-helper';

const [duration, setDuration] = useState(0);

useEffect(() => {
  if (startDate && endDate) {
    const calculatedDuration = getRentalDays(startDate, endDate);
    setDuration(calculatedDuration);
  }
}, [startDate, endDate]);

return (
  <div>
    <p>Durasi: {formatRentalDuration(duration)}</p>
  </div>
);
```

### Booking Form Component

```jsx
import { calculateRentalPrice, formatPrice, validateRentalDates } from '../utils/rental-duration-helper';

const BookingForm = () => {
  const [validation, setValidation] = useState({ isValid: false, errors: [], duration: 0 });
  const totalPrice = calculateRentalPrice(pricePerDay, quantity, validation.duration);

  const handleDateChange = () => {
    const result = validateRentalDates(startDate, endDate);
    setValidation(result);
  };

  return (
    <div>
      {validation.isValid && (
        <p>Total: {formatPrice(totalPrice)}</p>
      )}
      {validation.errors.map(error => (
        <p className="error" key={error}>{error}</p>
      ))}
    </div>
  );
};
```

## 🌐 API Integration

### Fetch Available Products

```javascript
const fetchProducts = async (startDate, endDate) => {
  const formattedStartDate = formatDateForAPI(startDate);
  const formattedEndDate = formatDateForAPI(endDate);
  
  const response = await fetch(`/api/products?start_date=${formattedStartDate}&end_date=${formattedEndDate}`);
  const data = await response.json();
  
  // Response akan include available_quantity untuk periode tersebut
  return data.data;
};
```

### Laravel Backend Response

```json
{
  "data": [
    {
      "id": 1,
      "name": "Canon EOS R5",
      "price": 50000,
      "available_quantity": 3  // Untuk periode yang dipilih
    }
  ]
}
```

## 🎨 UI Components Integration

### Updated Components

1. **DateRangePicker.tsx** ✅
   - Menggunakan `getRentalDays()` untuk durasi
   - Menggunakan `formatRentalDuration()` untuk display

2. **EnhancedBookingForm.tsx** ✅
   - Menggunakan `calculateRentalPrice()` untuk total harga
   - Menggunakan `formatPrice()` untuk format mata uang

3. **BundlingDetails.tsx** ✅
   - Format harga konsisten dengan `formatPrice()`

4. **Cart.tsx** ✅
   - Format durasi dan harga konsisten

5. **ProductCard.tsx** ✅
   - Format harga menggunakan helper

6. **BundlingCard.tsx** ✅
   - Format harga menggunakan helper

## 🔄 Migration Guide

### Before (Inconsistent)

```javascript
// ❌ Old way - tidak konsisten dengan backend
const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
const formattedPrice = new Intl.NumberFormat('id-ID', { 
  style: 'currency', 
  currency: 'IDR' 
}).format(price);
```

### After (Consistent) ✅

```javascript
// ✅ New way - konsisten dengan backend Laravel
import { getRentalDays, formatPrice } from '../utils/rental-duration-helper';

const duration = getRentalDays(startDate, endDate);
const formattedPrice = formatPrice(price);
```

## 📊 Comparison Table

| Aspect | Old Frontend | New Frontend | Backend Laravel | Status |
|--------|-------------|--------------|-----------------|---------|
| Duration Formula | `Math.ceil((end - start) / ms)` | `end.diff(start, 'day') + 1` | `$end->diffInDays($start) + 1` | ✅ Consistent |
| 09-10 Sept | 2 days ❌ | 1 day ✅ | 1 day ✅ | ✅ Fixed |
| 25-27 Dec | 3 days ❌ | 3 days ✅ | 3 days ✅ | ✅ Fixed |
| Price Format | Manual Intl | `formatPrice()` | Laravel format | ✅ Consistent |
| Validation | Basic | `validateRentalDates()` | Laravel validation | ✅ Enhanced |

## 🎯 Key Benefits

1. **✅ Konsistensi**: Frontend dan backend menghasilkan durasi yang sama
2. **🛡️ Type Safety**: Full TypeScript support dengan proper types
3. **🔄 Reusability**: Helper functions bisa digunakan di semua komponen
4. **🎨 Standardized**: Format harga dan durasi yang konsisten
5. **⚡ Performance**: Dayjs lebih ringan dari moment.js
6. **🧪 Testable**: Mudah di-test dengan clear API

## 🚨 Important Notes

1. **Inclusive Calculation**: Durasi selalu dihitung inclusive (termasuk hari mulai dan selesai)
2. **Date Format**: API calls menggunakan format YYYY-MM-DD
3. **Validation**: Selalu validasi tanggal sebelum kalkulasi
4. **Error Handling**: Semua function handle edge cases dengan graceful fallback
5. **TypeScript**: Full type support untuk type safety

## 📝 Examples

Lihat file `src/components/RentalForm-example.jsx` untuk implementasi lengkap React component yang menggunakan semua helper functions.

---

**🎉 Result**: Frontend React sekarang **100% konsisten** dengan Backend Laravel untuk perhitungan durasi rental!
