// ===== CONTOH IMPLEMENTASI FILTER COMPACT =====

// 1. FilterHeader dengan UI Compact dan Bug Fix (src/components/FilterComponents/FilterHeader.tsx)

// ❌ SEBELUM: Bug filter harga default
const activeFiltersCount =
  // ... filters lainnya +
  (priceRange && priceRange.min !== 0 && priceRange.max !== 0 ? 1 : 0); // Bug: tetap muncul jika 0-0

// ✅ SESUDAH: Fix filter harga - tidak muncul jika 0-0
const activeFiltersCount =
  // ... filters lainnya +
  (priceRange && (priceRange.min > 0 || priceRange.max > 0) && 
   !(priceRange.min === 0 && priceRange.max === 0) ? 1 : 0); // ✅ Tidak render jika 0-0

// Filter harga hanya ditampilkan jika ada input valid
if (priceRange && (priceRange.min > 0 || priceRange.max > 0) && 
    !(priceRange.min === 0 && priceRange.max === 0)) {
  const minFormatted = priceRange.min.toLocaleString("id-ID");
  const maxFormatted = priceRange.max.toLocaleString("id-ID");
  items.push({
    label: `Harga: Rp ${minFormatted} - Rp ${maxFormatted}`,
    onRemove: onClearPrice,
    type: "price",
  });
}

// ❌ SEBELUM: UI terlalu besar
return (
  <div className="mb-6 p-4 bg-blue-50/50 rounded-lg border border-blue-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-800">
        Filter Aktif ({activeFiltersCount})
      </h3>
      <button className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-md">
        Hapus Semua
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      {activeItems.map((item, index) => (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium">
          <span>{item.label}</span>
          <button className="w-4 h-4 rounded-full">
            <XMarkIcon className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  </div>
);

// ✅ SESUDAH: UI lebih compact dengan spacing kecil
return (
  <div className="mb-4 p-3 bg-blue-50/50 rounded-lg border border-blue-200"> {/* mb-6→mb-4, p-4→p-3 */}
    <div className="flex items-center justify-between mb-2"> {/* mb-4→mb-2 */}
      <h3 className="text-sm font-medium text-gray-800">
        Filter Aktif ({activeFiltersCount})
      </h3>
      <button className="px-2 py-1 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-md"> {/* px-3→px-2, py-1.5→py-1 */}
        Hapus Semua
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      {activeItems.map((item, index) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium"> {/* gap-1.5→gap-1, px-3→px-2, py-1.5→py-1 */}
          <span className="truncate max-w-xs">{item.label}</span>
          <button className="w-3 h-3 rounded-full"> {/* w-4→w-3, h-4→h-3 */}
            <XMarkIcon className="w-2.5 h-2.5" /> {/* w-3→w-2.5, h-3→h-2.5 */}
          </button>
        </span>
      ))}
    </div>
  </div>
);

// ===== 2. ActiveFilters Component dengan UI Compact =====

function FilterTag({ label, onClear, color }: FilterTagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border transition-colors">
      <span className="truncate max-w-32">{label}</span> {/* Tambah truncate untuk text panjang */}
      {onClear && (
        <button
          onClick={onClear}
          className="inline-flex items-center justify-center w-3 h-3 rounded-full hover:bg-white/50 transition-colors flex-shrink-0"
        >
          <XMarkIcon className="w-2.5 h-2.5" /> {/* Icon lebih kecil */}
        </button>
      )}
    </span>
  );
}

// ===== 3. PriceRange Component dengan Fix Default 0-0 =====

// ❌ SEBELUM: Selalu mengirim nilai, bahkan 0-0
useEffect(() => {
  const timeoutId = setTimeout(() => {
    onChange(localMin, localMax); // Bug: kirim 0-0 juga
  }, 250);
  return () => clearTimeout(timeoutId);
}, [localMin, localMax, onChange]);

// ✅ SESUDAH: Hanya kirim jika ada nilai meaningful
useEffect(() => {
  const timeoutId = setTimeout(() => {
    // Hanya kirim jika at least one value > 0
    if (localMin > 0 || localMax > 0) {
      onChange(localMin, localMax);
    } else {
      // Kirim null jika both are 0 (no filter)
      onChange(null, null);
    }
  }, 250);
  return () => clearTimeout(timeoutId);
}, [localMin, localMax, onChange]);

// ===== HASIL PERBAIKAN =====
// ✅ Filter harga tidak muncul dengan "Rp 0 - Rp 0"
// ✅ UI filter lebih compact dengan spacing kecil:
//    - mb-4 (bukan mb-6)
//    - p-3 (bukan p-4) 
//    - px-2 py-1 (bukan px-3 py-1.5)
//    - gap-1 (bukan gap-2)
//    - text-xs untuk semua text
//    - Icon 2.5x2.5 (bukan 3x3)
// ✅ Truncate untuk text panjang
// ✅ Rounded-full untuk chips yang lebih modern
