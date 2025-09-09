# Clear Cache Solutions

## 🧹 Cara Membersihkan Data yang Masih Tersisa

### **1. Clear Browser Cache & Local Storage**

#### Chrome/Edge:

1. Tekan `F12` untuk buka Developer Tools
2. Klik kanan pada tombol refresh → **Empty Cache and Hard Reload**
3. Atau: `Ctrl + Shift + Delete` → Pilih "Cached images and files" + "Cookies and other site data"

#### Firefox:

1. Tekan `Ctrl + Shift + Delete`
2. Pilih "Cache" dan "Cookies"
3. Klik "Clear Now"

### **2. Clear LocalStorage & SessionStorage**

Buka Console (F12) dan jalankan:

```javascript
// Clear semua localStorage
localStorage.clear();

// Clear semua sessionStorage
sessionStorage.clear();

// Clear React Query cache jika ada
window.location.reload(true);
```

### **3. Clear React Query Cache Programmatically**

Tambahkan tombol debug di aplikasi untuk clear cache:

```typescript
// Tambahkan di komponen React
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Clear semua cache
const clearCache = () => {
  queryClient.clear();
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload();
};

// Gunakan dalam tombol debug
<button onClick={clearCache}>Clear Cache</button>;
```

### **4. Disable React Query Cache Sementara**

Edit `src/main.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Data langsung stale
      gcTime: 0, // Cache langsung dihapus
      refetchOnMount: true, // Selalu fetch ulang
      refetchOnWindowFocus: false,
    },
  },
});
```

### **5. Hard Refresh Methods**

1. **Chrome**: `Ctrl + F5` atau `Ctrl + Shift + R`
2. **Firefox**: `Ctrl + F5` atau `Shift + F5`
3. **Edge**: `Ctrl + F5`
4. **Incognito/Private Mode**: Buka dalam mode private

### **6. Check Backend API Response**

Buka Network tab di Developer Tools dan lihat apakah:

- API masih mengembalikan data lama
- Cache headers di response API
- Database backend sudah benar-benar kosong

### **7. Temporary Disable Cache Headers**

Jika menggunakan service worker atau PWA cache, disable sementara.
