// ===== CONTOH IMPLEMENTASI LAYOUT COMPONENT =====

// 1. Layout Component Reusable (src/components/Layout.tsx)
import React from 'react';
import NavCard from './navCard';
import FooterSection from './FooterSection';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
  showNavCard?: boolean;
  showFooter?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

export default function Layout({
  children,
  showNavCard = true,
  showFooter = true,
  showBottomNav = true,
  className = ''
}: LayoutProps) {
  return (
    // ✅ Struktur Layout Global dengan flex flex-col min-h-screen
    <div className={`flex flex-col min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      {showNavCard && (
        <header className="flex-shrink-0">
          <NavCard />
        </header>
      )}

      {/* Main Content dengan flex-grow - ini yang mendorong footer ke bawah */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="flex-shrink-0 mt-auto">
          <FooterSection />
        </footer>
      )}

      {/* Bottom Navigation (Mobile) */}
      {showBottomNav && (
        <div className="flex-shrink-0">
          <BottomNavigation />
        </div>
      )}
    </div>
  );
}

// Layout Variants untuk kemudahan penggunaan
export function MainLayout({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Layout className={className}>
      {children}
    </Layout>
  );
}

// ===== CONTOH PENERAPAN DI HALAMAN =====

// 2. Penerapan di ProductDetails (Details.tsx)
export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  // ... hooks dan state lainnya

  if (isError || !product) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Produk Tidak Ditemukan
            </h2>
            {/* Error actions */}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <NavCard />
      <div className="bg-gray-50 md:bg-white flex-1">
        <main className="max-w-[640px] md:max-w-[1130px] mx-auto px-4 sm:px-6 pb-8 pt-20 md:pt-28">
          {/* Product content - bahkan jika booking form panjang, footer tetap di bawah */}
          <ProductInfo product={product} />
          <EnhancedBookingForm item={product} type="product" />
        </main>
      </div>
    </MainLayout>
  );
}

// ===== HASIL: Footer selalu di bawah bahkan dengan konten booking panjang =====
// - Header di atas (flex-shrink-0)
// - Main content di tengah (flex-grow) 
// - Footer di bawah (flex-shrink-0 mt-auto)
// - Struktur: flex flex-col min-h-screen pada wrapper utama
