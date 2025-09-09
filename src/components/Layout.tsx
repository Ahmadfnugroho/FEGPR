// src/components/Layout.tsx
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
    <div className={`flex flex-col min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      {showNavCard && (
        <header className="flex-shrink-0">
          <NavCard />
        </header>
      )}

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <footer className="flex-shrink-0 mt-auto w-full py-6 md:py-8 px-4 bg-black/90 text-white">
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

export function SimpleLayout({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Layout 
      showFooter={false} 
      showBottomNav={false} 
      className={className}
    >
      {children}
    </Layout>
  );
}

export function NoNavLayout({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Layout 
      showNavCard={false} 
      className={className}
    >
      {children}
    </Layout>
  );
}
