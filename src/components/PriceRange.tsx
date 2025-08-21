// src/components/PriceRange.tsx
import React, { useEffect, useState } from "react";

type Props = {
  min: number; // batas global terendah
  max: number; // batas global tertinggi
  valueMin: number | null | undefined; // bisa null/undefined = non-aktif
  valueMax: number | null | undefined; // bisa null/undefined = non-aktif
  onChange: (min: number | null, max: number | null) => void; // kirim null jika tidak diisi
};

export default function PriceRange({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: Props) {
  // Gunakan null sebagai default → artinya "tidak diisi"
  const [localMin, setLocalMin] = useState<number>(valueMin ?? 0);
  const [localMax, setLocalMax] = useState<number>(valueMax ?? 0);

  // Sinkronisasi dari luar (misal: reset filter)
  useEffect(() => {
    setLocalMin(valueMin ?? 0);
    setLocalMax(valueMax ?? 0);
  }, [valueMin, valueMax]);

  // Helper: pastikan min ≤ max
  const handleMinChange = (val: number | null) => {
    if (val === null) {
      setLocalMin(0);
      return;
    }
    // Jika max belum diisi, tetap izinkan
    if (localMax !== 0 && val > localMax) {
      setLocalMin(localMax);
      setLocalMax(val); // swap jika perlu
    } else {
      setLocalMin(val);
    }
  };

  const handleMaxChange = (val: number | null) => {
    if (val === null) {
      setLocalMax(0);
      return;
    }
    if (localMin !== 0 && val < localMin) {
      setLocalMax(localMin);
      setLocalMin(val); // swap jika perlu
    } else {
      setLocalMax(val);
    }
  };

  // Debounce onChange
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(localMin, localMax);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [localMin, localMax, onChange]);

  // Format angka ke Rupiah
  const format = (num: number | null | undefined) =>
    num && num !== 0
      ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      : "";

  return (
    <div className="space-y-2">
      <label className="block text-xs md:text-sm font-medium text-muted dark:text-muted-dark">
        Rentang Harga
      </label>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        {/* Input Harga Minimum */}
        <div className="flex-1">
          <input
            type="text"
            placeholder={min.toLocaleString("id-ID")}
            className="w-full sm:w-20 md:w-24 px-2 md:px-3 py-1.5 rounded-lg border border-muted dark:border-muted-dark 
                       bg-light dark:bg-dark text-dark dark:text-light text-xs md:text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            value={format(localMin)}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              handleMinChange(raw ? Number(raw) : null);
            }}
            aria-label="Harga minimum"
          />
        </div>

        <div className="text-muted dark:text-muted-dark font-semibold text-center sm:mx-2 hidden sm:block">—</div>
        <div className="text-muted dark:text-muted-dark font-semibold text-center text-xs sm:hidden">sampai</div>

        {/* Input Harga Maksimum */}
        <div className="flex-1">
          <input
            type="text"
            placeholder={max.toLocaleString("id-ID")}
            className="w-full sm:w-20 md:w-24 px-2 md:px-3 py-1.5 rounded-lg border border-muted dark:border-muted-dark 
                       bg-light dark:bg-dark text-dark dark:text-light text-xs md:text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
            value={format(localMax)}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              handleMaxChange(raw ? Number(raw) : null);
            }}
            aria-label="Harga maksimum"
          />
        </div>
      </div>
    </div>
  );
}
