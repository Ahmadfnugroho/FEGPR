// ===== MASALAH FOOTER TUMPANG TINDIH - ROOT CAUSE =====

// ❌ MASALAH 1: Spacing di EnhancedBookingForm terlalu kecil
// Sebelum:
export function EnhancedBookingForm() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Date Picker */}
      <div className="mb-1"> {/* ❌ mb-1 terlalu kecil */}
        <DateRangePicker />
        <div className="mt-1"> {/* ❌ mt-1 terlalu kecil */}
          Durasi: 1 hari
        </div>
      </div>
      
      {/* Quantity */}
      <div className="mb-1"> {/* ❌ mb-1 terlalu kecil */}
        <QuantitySelector />
      </div>
      
      {/* Price Calculation */}
      <div className="mb-1 p-4 bg-blue-50"> {/* ❌ mb-1 terlalu kecil */}
        <div>Total: Rp 450.000</div>
      </div>
      
      {/* Status Messages */}
      <div className="mb-1 p-3 bg-red-50"> {/* ❌ mb-1 terlalu kecil */}
        <div>Hanya 0 unit tersedia untuk periode ini</div>
      </div>
      
      <button>Tambah ke Keranjang</button>
      
      {/* Additional Info - TANPA MARGIN BOTTOM */}
      <div className="mt-1 text-xs"> {/* ❌ No bottom margin */}
        <p>• Harga sudah termasuk durasi rental</p>
        <p>• Booking akan dikonfirmasi melalui WhatsApp</p>
        <p>• Pembayaran dilakukan setelah konfirmasi</p>
      </div>
    </div>
  );
}

// ❌ MASALAH 2: Mobile Bottom Action Bar menghalangi footer
// Details.tsx - Sebelum:
<div className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 md:hidden">
  {/* Mobile action bar tepat di bottom-0, menutupi footer */}
</div>

// ❌ MASALAH 3: Main content tidak cukup padding bottom
// Details.tsx - Sebelum:
<main className="pb-8 pt-20"> {/* pb-8 tidak cukup untuk mobile */}
  <EnhancedBookingForm />
</main>

// ❌ MASALAH 4: has-[#Bottom-nav]:pb-40 masih tersisa
// BundlingDetails.tsx - Sebelum:
<main className="pb-8 has-[#Bottom-nav]:pb-40"> {/* Selector tidak perlu */}

// ===== SOLUSI YANG DITERAPKAN =====

// ✅ SOLUSI 1: Perbaiki spacing di EnhancedBookingForm
export function EnhancedBookingForm() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Date Picker - Spacing diperbesar */}
      <div className="mb-4"> {/* ✅ mb-1 → mb-4 */}
        <DateRangePicker />
        <div className="mt-2"> {/* ✅ mt-1 → mt-2 */}
          Durasi: 1 hari
        </div>
      </div>
      
      {/* Quantity - Spacing diperbesar */}
      <div className="mb-4"> {/* ✅ mb-1 → mb-4 */}
        <QuantitySelector />
      </div>
      
      {/* Price Calculation - Spacing diperbesar */}
      <div className="mb-4 p-4 bg-blue-50"> {/* ✅ mb-1 → mb-4 */}
        <div>Total: Rp 450.000</div>
      </div>
      
      {/* Status Messages - Spacing diperbesar */}
      <div className="mb-4 p-3 bg-red-50"> {/* ✅ mb-1 → mb-4 */}
        <div>Hanya 0 unit tersedia untuk periode ini</div>
      </div>
      
      <button>Tambah ke Keranjang</button>
      
      {/* Additional Info - TAMBAHKAN MARGIN BOTTOM */}
      <div className="mt-4 mb-6 text-xs"> {/* ✅ mt-1 → mt-4, + mb-6 */}
        <p>• Harga sudah termasuk durasi rental</p>
        <p>• Booking akan dikonfirmasi melalui WhatsApp</p>
        <p>• Pembayaran dilakukan setelah konfirmasi</p>
      </div>
    </div>
  );
}

// ✅ SOLUSI 2: Posisi Mobile Bottom Action Bar di atas footer
// Details.tsx - Sesudah:
<div className="fixed bottom-16 left-0 right-0 bg-white border-t z-30 md:hidden">
  {/* ✅ bottom-0 → bottom-16, z-40 → z-30 */}
  {/* Sekarang ada ruang 64px (4rem) untuk footer */}
</div>

// ✅ SOLUSI 3: Main content padding bottom diperbesar untuk mobile
// Details.tsx - Sesudah:
<main className="pb-24 md:pb-8 pt-20"> 
  {/* ✅ pb-8 → pb-24 untuk mobile, md:pb-8 untuk desktop */}
  <EnhancedBookingForm />
</main>

// ✅ SOLUSI 4: Hapus selector yang tidak perlu
// BundlingDetails.tsx - Sesudah:
<main className="pb-8 pt-20"> {/* ✅ Hapus has-[#Bottom-nav]:pb-40 */}

// ===== STRUKTUR LAYOUT YANG BENAR =====

// Layout.tsx:
<div className="flex flex-col min-h-screen">
  <header className="flex-shrink-0">
    <NavCard />
  </header>
  
  <main className="flex-grow flex flex-col">
    <div className="flex-1"> {/* Content area yang bisa expand */}
      <main className="pb-24 md:pb-8"> {/* Proper bottom padding */}
        <EnhancedBookingForm /> {/* Dengan spacing yang benar */}
      </main>
    </div>
  </main>
  
  {/* HANYA SATU FOOTER */}
  <footer className="flex-shrink-0 mt-auto w-full py-6 md:py-8 px-4 bg-black/90 text-white">
    <FooterSection /> {/* Tanpa wrapper <footer> */}
  </footer>
</div>

// Mobile Bottom Action Bar (hanya di ProductDetails):
<div className="fixed bottom-16 z-30 md:hidden">
  {/* Positioned above footer, not covering it */}
</div>

// ===== HASIL PERBAIKAN =====
// ✅ Footer tidak lagi tumpang tindih dengan konten booking form
// ✅ Spacing antar elemen lebih proper (mb-4 bukan mb-1)
// ✅ Mobile bottom action bar tidak menutupi footer
// ✅ Main content punya padding bottom yang cukup
// ✅ Layout flexbox bekerja dengan benar
// ✅ Footer selalu menempel di bawah viewport
// ✅ Konten panjang tidak lagi ketimpa footer

// ===== CONTOH SPACING YANG BENAR =====
// mb-1  → mb-4  (4x lebih besar)
// mt-1  → mt-2  (2x lebih besar)  
// pb-8  → pb-24 untuk mobile (3x lebih besar)
// + mb-6 di akhir komponen untuk breathing room
