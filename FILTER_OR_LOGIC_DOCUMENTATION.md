# OR Logic Filter Implementation

## Overview
Implementasi logika OR untuk filter lintas kategori di BrowseProduct. Memungkinkan user memilih kategori, subcategory, dan brand secara bersamaan dengan hasil yang menampilkan semua produk yang cocok dengan salah satu kriteria.

## How It Works

### 1. Filter Logic Detection
Sistem mendeteksi apakah user menggunakan multiple jenis filter:
```typescript
const hasMultipleFilterTypes = [
  currentFilter.category?.length > 0,
  currentFilter.brand?.length > 0,
  currentFilter.subcategory?.length > 0,
].filter(Boolean).length > 1;
```

### 2. Parameter Sent to Backend
- `filter_logic=or` - Ketika multiple filter types digunakan
- `filter_logic=and` - Ketika hanya satu jenis filter digunakan
- Multiple values dikirim dengan `ps.append()` untuk setiap kategori

### 3. Example API Calls

**Scenario 1: OR Logic (Camera + Adapter + Canon)**
```
/api/products?category=camera&subcategory=adapter&brand=canon&filter_logic=or
```
Result: Produk yang kategorinya Camera OR subcategory Adapter OR brand Canon

**Scenario 2: AND Logic (Hanya Camera)**
```
/api/products?category=camera&filter_logic=and
```
Result: Produk yang kategorinya Camera

### 4. UI Components Updated

#### Added Brand Filter to:
- `DesktopFilterSidebar.tsx` - Brand checkbox group
- `MobileFilterDialog.tsx` - Brand checkbox group  
- `FilterHeader.tsx` - Brand filter chips with remove functionality

#### Enhanced Logging:
- Filter parameters being sent to API
- Logic type being used (OR vs AND)
- Debug information for troubleshooting

## Testing Scenarios

### Test Case 1: Single Filter Type
1. Pilih hanya kategori "Camera"
2. Expect: `filter_logic=and`
3. Result: Hanya produk kategori Camera

### Test Case 2: Multiple Filter Types (OR Logic)
1. Pilih kategori "Camera"
2. Pilih subcategory "Adapter" 
3. Pilih brand "Canon"
4. Expect: `filter_logic=or`
5. Result: Produk Camera OR Adapter OR Canon

### Test Case 3: Multiple Values Same Type
1. Pilih kategori "Camera" dan "Drone"
2. Expect: `filter_logic=and`
3. Result: Produk kategori Camera OR Drone (OR dalam kategori yang sama)

## Backend Requirements

Backend API perlu menangani parameter `filter_logic`:

```php
// Pseudo-code untuk Laravel
if ($request->get('filter_logic') === 'or') {
    // Use OR logic between different filter types
    $query->where(function($q) use ($categories, $brands, $subcategories) {
        if (!empty($categories)) {
            $q->orWhereIn('category_slug', $categories);
        }
        if (!empty($brands)) {
            $q->orWhereIn('brand_slug', $brands);
        }
        if (!empty($subcategories)) {
            $q->orWhereIn('subcategory_slug', $subcategories);
        }
    });
} else {
    // Use AND logic (default)
    if (!empty($categories)) {
        $query->whereIn('category_slug', $categories);
    }
    if (!empty($brands)) {
        $query->whereIn('brand_slug', $brands);
    }
    if (!empty($subcategories)) {
        $query->whereIn('subcategory_slug', $subcategories);
    }
}
```

## Debug Console Messages

Saat testing, perhatikan console messages:
- `🔄 Using OR logic for cross-category filtering`
- `🔄 Using AND logic for single filter type`
- `🔍 Filter params being sent:` dengan detail parameter

## File Changes Made

1. **BrowseProduct.tsx**
   - Added OR logic detection
   - Added `filter_logic` parameter
   - Enhanced logging for debugging

2. **DesktopFilterSidebar.tsx**
   - Added Brand filter checkbox group

3. **MobileFilterDialog.tsx**
   - Added Brand filter checkbox group

4. **FilterHeader.tsx**
   - Added `onClearBrand` prop and handler
   - Added brand filter chips display

## User Experience

- **Single filter type**: Tradisional AND logic (lebih presisi)
- **Multiple filter types**: OR logic (lebih inklusif)
- **Visual feedback**: Filter chips menampilkan semua active filters
- **Easy removal**: Individual filter chips dapat dihapus satu-satu

## Fallback Behavior

Jika backend belum mendukung `filter_logic` parameter:
- Parameter akan diabaikan
- Sistem akan menggunakan behavior default backend
- Frontend tetap berfungsi normal
- Logging akan tetap memberikan insight untuk debugging
