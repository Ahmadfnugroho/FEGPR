# 🔍 Troubleshoot: Data Masih Muncul Setelah Fresh Migrate

## ❓ Problem yang Terjadi

Data produk masih tampil di frontend padahal sudah melakukan fresh migrate database. Ini bisa terjadi karena:

1. **React Query Cache** masih menyimpan data lama
2. **Browser Cache** masih menyimpan response API
3. **LocalStorage/SessionStorage** menyimpan data
4. **Service Worker** atau PWA cache
5. **Backend seeder** otomatis menjalankan sample data

## 🛠️ Solusi yang Sudah Diimplementasikan

### ✅ **1. React Query Cache Disabled**
File `src/main.tsx` sudah diupdate dengan:
```typescript
// TEMPORARY: Disabled cache for fresh migrate testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,              // Data immediately stale
      gcTime: 0,                 // Cache immediately garbage collected
      refetchOnMount: true,      // Always refetch on mount
    },
  },
});
```

### ✅ **2. Debug Commands Ready**
Di browser console, sekarang tersedia commands:
```javascript
// Lihat semua commands
debugCache.help()

// Clear semua cache
debugCache.clear()

// Clear React Query cache saja
debugCache.clearReactQuery()

// Lihat informasi cache
debugCache.info()

// Force hard reload
debugCache.hardReload()
```

## 🚀 Steps untuk Clear Data

### **Step 1: Buka Browser Developer Tools**
1. Tekan `F12` atau `Ctrl+Shift+I`
2. Pergi ke tab **Console**

### **Step 2: Jalankan Debug Commands**
```javascript
// Clear semua cache dan reload
debugCache.clear()
```

### **Step 3: Manual Clear Browser Cache**
Jika masih belum bersih:

#### Chrome/Edge:
1. Tekan `Ctrl+Shift+Delete`
2. Pilih **"All time"** 
3. Centang:
   - ✅ Browsing history
   - ✅ Cookies and other site data  
   - ✅ Cached images and files
4. Klik **"Clear data"**

#### Atau gunakan Hard Reload:
1. Klik kanan tombol refresh
2. Pilih **"Empty Cache and Hard Reload"**

### **Step 4: Check Network Tab**
1. Buka tab **Network** di Developer Tools
2. Refresh halaman
3. Lihat apakah request API benar-benar hit server atau dari cache
4. Status cache akan terlihat di kolom **"Size"**:
   - `(memory cache)` = dari cache
   - `200` + ukuran bytes = dari server

### **Step 5: Incognito/Private Mode Test**
1. Buka browser dalam mode **Incognito/Private**
2. Akses aplikasi
3. Jika data hilang di incognito, berarti masalah di cache

## 🔍 Advanced Debugging

### **Check Backend Database**
Pastikan database benar-benar kosong:
```sql
-- Check apakah ada data
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM product_photos;

-- Jika masih ada data, cek seeder
-- Kemungkinan ada DatabaseSeeder yang auto-run
```

### **Check API Response Headers**
Di Network tab, klik request API dan cek headers:
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache  
Expires: 0
```

### **Service Worker Check**
1. Pergi ke tab **Application** di Developer Tools
2. Klik **Service Workers** di sidebar
3. Jika ada service worker aktif, klik **"Unregister"**

## 🎯 Expected Behavior After Fix

### ✅ **Seharusnya Terlihat:**
1. **Console logs**:
   ```
   🚀 [API Request] GET /api/products
   ✅ [API Response] 200 GET /api/products (response time)
   ```

2. **Empty state** jika backend benar-benar kosong:
   - No products found
   - Empty categories
   - Placeholder images

3. **Network tab** menunjukkan request hit server, bukan cache

### ❌ **Jika Masih Ada Masalah:**
1. **Data muncul tanpa loading** = masih dari cache
2. **Network tab kosong** = tidak ada request = dari cache
3. **Response instant** = kemungkinan cache

## 🔧 Permanent Fix

Setelah testing selesai, kembalikan cache settings normal di `src/main.tsx`:

```typescript
// Restore normal cache settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,    // 2 minutes
      gcTime: 5 * 60 * 1000,       // 5 minutes
      refetchOnMount: 'always',
    },
  },
});
```

## 🧪 Test Verification

### **1. Test Empty State**
- ✅ Database kosong → Frontend empty
- ✅ Loading indicators muncul
- ✅ API requests hit server

### **2. Test Cache Behavior**
- ✅ Hard refresh → data fresh
- ✅ Incognito → data fresh  
- ✅ Different browser → data fresh

### **3. Test Debug Commands**
- ✅ `debugCache.clear()` works
- ✅ `debugCache.info()` shows empty cache
- ✅ Page reload after clear

## 💡 Prevention Tips

1. **Selalu test di Incognito** saat development
2. **Disable cache** di Network tab saat debugging
3. **Use versioning** untuk API endpoints jika perlu
4. **Monitor Network tab** untuk memastikan requests hit server
5. **Clear cache** setelah major backend changes

## 🚨 Emergency Reset

Jika semua cara di atas tidak berhasil:

```javascript
// Nuclear option - reset everything
localStorage.clear();
sessionStorage.clear(); 
indexedDB.deleteDatabase('keyval-store'); // If using any IndexedDB
location.href = location.href.split('?')[0] + '?v=' + Date.now();
```

Dengan implementasi ini, data lama seharusnya sudah tidak muncul lagi setelah fresh migrate! 🎉
