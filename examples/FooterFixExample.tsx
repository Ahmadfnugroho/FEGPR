// ===== MASALAH FOOTER BERTUMPUK - SEBELUM PERBAIKAN =====

// ❌ MASALAH: Dua tag <footer> bertumpuk
// Layout.tsx:
export function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header>...</header>
      <main className="flex-grow">{children}</main>
      
      {/* Footer pertama dari Layout */}
      <footer className="flex-shrink-0 mt-auto">
        <FooterSection /> {/* ← Ini akan menghasilkan <footer> lagi! */}
      </footer>
    </div>
  );
}

// FooterSection.tsx:
export default function FooterSection() {
  return (
    <footer className="w-full py-6 md:py-8 px-4 bg-black/90 text-white mt-8 md:mt-10">
      {/* Konten footer */}
      <section>...</section>
    </footer>
  );
}

// ❌ HASIL: Struktur HTML jadi seperti ini:
<div class="flex flex-col min-h-screen">
  <header>...</header>
  <main class="flex-grow">...</main>
  <footer class="flex-shrink-0 mt-auto">
    <footer class="w-full py-6 md:py-8 px-4 bg-black/90 text-white mt-8 md:mt-10">
      <!-- Footer dalam tidak mengikuti flexbox rules dari parent -->
      <section>...</section>
    </footer>
  </footer>
</div>

// ===== SOLUSI - SESUDAH PERBAIKAN =====

// ✅ SOLUSI: Hanya satu tag <footer>

// Layout.tsx - DIPERBAIKI:
export default function Layout({ children, showFooter = true }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex-shrink-0">
        <NavCard />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* Footer - HANYA SATU TAG FOOTER dengan class lengkap */}
      {showFooter && (
        <footer className="flex-shrink-0 mt-auto w-full py-6 md:py-8 px-4 bg-black/90 text-white">
          <FooterSection /> {/* ← Ini BUKAN <footer> lagi, hanya konten */}
        </footer>
      )}
    </div>
  );
}

// FooterSection.tsx - DIPERBAIKI:
export default function FooterSection() {
  return (
    // ✅ HAPUS tag <footer>, langsung return konten
    <section className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 md:gap-8">
        {/* Brand Info */}
        <div className="flex-1 min-w-[250px]">
          <h6 className="uppercase font-bold text-white md:text-lg tracking-wide">
            GLOBAL.PHOTORENTAL
          </h6>
          {/* ... rest of footer content */}
        </div>
        
        {/* Social Media & Contact */}
        <div className="flex-1 min-w-[250px]">
          {/* ... social links */}
        </div>
        
        {/* Maps & Address */}
        <div className="flex-1 min-w-[250px]">
          {/* ... map iframe */}
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-400 mt-6 md:mt-8">
        © 2024 GLOBAL.PHOTORENTAL. All rights reserved.
      </div>
    </section>
  );
}

// ✅ HASIL: Struktur HTML yang benar:
<div class="flex flex-col min-h-screen bg-gray-50">
  <header class="flex-shrink-0">
    <nav>...</nav>
  </header>
  
  <main class="flex-grow flex flex-col">
    <!-- Booking form atau konten panjang -->
    <div>...</div>
  </main>
  
  <!-- HANYA SATU FOOTER dengan aturan flexbox yang benar -->
  <footer class="flex-shrink-0 mt-auto w-full py-6 md:py-8 px-4 bg-black/90 text-white">
    <section class="max-w-7xl mx-auto">
      <!-- Konten footer -->
    </section>
  </footer>
</div>

// ===== PENERAPAN DI HALAMAN =====

// ProductDetails.tsx - SEBELUM:
export default function ProductDetails() {
  return (
    <>
      <NavCard />
      <div className="min-h-screen">
        <main>
          <EnhancedBookingForm /> {/* Form panjang */}
        </main>
      </div>
      <FooterSection /> {/* Footer tumpang tindih dengan form */}
      <BottomNavigation />
    </>
  );
}

// ProductDetails.tsx - SESUDAH:
export default function ProductDetails() {
  return (
    <MainLayout>
      <NavCard />
      <div className="flex-1">
        <main>
          <EnhancedBookingForm /> {/* Form panjang - footer tetap di bawah */}
        </main>
      </div>
    </MainLayout>
  );
}

// ===== HASIL PERBAIKAN =====
// ✅ Footer tidak lagi bertumpuk dengan konten
// ✅ Footer selalu menempel di bawah viewport
// ✅ Struktur flex flex-col min-h-screen bekerja dengan benar
// ✅ Booking form panjang tidak ketimpa footer
// ✅ Hanya satu tag <footer> dalam DOM
// ✅ Class footer: "flex-shrink-0 mt-auto w-full py-6 md:py-8 px-4 bg-black/90 text-white"
