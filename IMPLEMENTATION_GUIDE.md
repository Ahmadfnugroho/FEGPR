# Date-Based Availability Implementation Guide

## Overview
Implementasi ketersediaan berdasarkan tanggal untuk produk dan bundling telah selesai. Sistem sekarang menggunakan `available_quantity` dan `is_available` dari API response untuk perhitungan ketersediaan yang akurat.

## Perubahan yang Dibuat

### 1. Details.tsx (Product Details)
- **API Call**: Sekarang memanggil `/api/product/{slug}?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- **State Management**: Menambah `selectedDates` state untuk tracking tanggal yang dipilih
- **Availability Logic**: Menggunakan `isProductAvailable()` dan `getProductAvailabilityText()` dari availability utils
- **UI Updates**: Menampilkan status "Tersedia (X unit)" atau "Tidak Tersedia"
- **Auto Refresh**: React Query otomatis fetch ulang ketika tanggal berubah

### 2. BundlingDetails.tsx (Bundling Details)
- **API Call**: Sekarang memanggil `/api/bundling/{slug}?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`
- **State Management**: Menambah `selectedDates` state untuk tracking tanggal yang dipilih
- **Availability Logic**: Menggunakan `isBundlingAvailable()` dan `getBundlingAvailableQuantity()` untuk menghitung minimum available_quantity dari semua produk
- **UI Updates**: Menampilkan status "Tersedia (X paket)" atau "Tidak Tersedia"
- **Auto Refresh**: React Query otomatis fetch ulang ketika tanggal berubah

### 3. EnhancedBookingForm.tsx
- **New Props**: 
  - `onDateChange?: (startDate: string | null, endDate: string | null) => void`
  - `isLoadingAvailability?: boolean`
- **Date Callback**: Memanggil parent component ketika tanggal berubah
- **Loading States**: Menampilkan loading indicator ketika availability sedang di-update

### 4. Availability Utils (availabilityUtils.ts)
- **Product Rules**: `available_quantity > 0 && is_available === true`
- **Bundling Rules**: Minimum `available_quantity` dari semua produk dalam bundling
- **Helper Functions**: 
  - `isProductAvailable()`
  - `isBundlingAvailable()`
  - `getProductAvailableQuantity()`
  - `getBundlingAvailableQuantity()`
  - `getProductAvailabilityText()`
  - `getBundlingAvailabilityText()`

## Cara Kerja

### Flow untuk Product Details:
1. User membuka halaman `/product/{slug}`
2. Component fetch data dari `/api/product/{slug}` tanpa date params (initial load)
3. User memilih tanggal di booking form
4. `EnhancedBookingForm` memanggil `onDateChange` callback
5. Parent component (`Details.tsx`) update `selectedDates` state
6. React Query otomatis fetch ulang dengan params: `/api/product/{slug}?start_date=2024-01-01&end_date=2024-01-03`
7. API response berisi `available_quantity` dan `is_available` untuk periode tersebut
8. UI update menampilkan status ketersediaan real-time

### Flow untuk Bundling Details:
1. User membuka halaman `/bundling/{slug}`
2. Component fetch data dari `/api/bundling/{slug}` tanpa date params (initial load)
3. User memilih tanggal di booking form
4. `EnhancedBookingForm` memanggil `onDateChange` callback
5. Parent component (`BundlingDetails.tsx`) update `selectedDates` state
6. React Query otomatis fetch ulang dengan params: `/api/bundling/{slug}?start_date=2024-01-01&end_date=2024-01-03`
7. API response berisi setiap produk dalam bundling dengan `available_quantity` dan `is_available`
8. Frontend menghitung minimum `available_quantity` dari semua produk
9. UI update menampilkan status ketersediaan bundling real-time

## Contoh API Response

### Product API Response
```json
{
  "data": {
    "id": 1,
    "name": "Canon EOS R5",
    "price": 500000,
    "slug": "canon-eos-r5",
    "status": "available",
    "quantity": 5,
    "available_quantity": 3,
    "is_available": true,
    "category": {...},
    "brand": {...}
  }
}
```

### Bundling API Response
```json
{
  "data": {
    "id": 1,
    "name": "Wedding Photography Package",
    "price": 2000000,
    "slug": "wedding-photography-package",
    "products": [
      {
        "id": 1,
        "name": "Canon EOS R5",
        "available_quantity": 3,
        "is_available": true
      },
      {
        "id": 2,
        "name": "Canon 24-70mm f/2.8",
        "available_quantity": 2,
        "is_available": true
      }
    ]
  }
}
```

## Testing

### Manual Testing
1. Buka halaman product/bundling details
2. Pilih tanggal rental
3. Perhatikan loading state muncul
4. Verifikasi status ketersediaan berubah sesuai response API
5. Coba ganti tanggal lagi, pastikan fetch ulang berjalan

### Console Logs
Implementasi ini menambahkan console logs untuk debugging:
- `🗓️ Date changed in Details:` - ketika tanggal berubah di Details.tsx
- `🗓️ Date changed in BundlingDetails:` - ketika tanggal berubah di BundlingDetails.tsx
- `📦 Bundling availability calculated:` - hasil perhitungan availability bundling

## Backend Requirements

### Product Endpoint
```
GET /api/product/{slug}?start_date=2024-01-01&end_date=2024-01-03
```
Response harus berisi:
- `available_quantity`: jumlah tersedia untuk periode tersebut
- `is_available`: boolean status ketersediaan

### Bundling Endpoint
```
GET /api/bundling/{slug}?start_date=2024-01-01&end_date=2024-01-03
```
Response harus berisi:
- Array `products` dengan masing-masing produk memiliki `available_quantity` dan `is_available`

## Performance Optimizations

1. **React Query Caching**: Query results di-cache untuk mengurangi API calls
2. **Debounced Updates**: Date changes di-debounce untuk menghindari terlalu banyak API calls
3. **Loading States**: User feedback yang jelas ketika data sedang di-fetch
4. **Error Handling**: Graceful handling jika API error atau tidak tersedia

## Next Steps

1. **Testing**: Lakukan testing menyeluruh dengan berbagai skenario tanggal
2. **Error Handling**: Tambahkan error boundary untuk edge cases
3. **Analytics**: Track user behavior pada pemilihan tanggal
4. **Optimization**: Monitor performance dan optimize jika diperlukan
