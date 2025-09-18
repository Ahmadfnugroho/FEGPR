import { Link } from "react-router-dom";

import BrowseBrandWrapper from "../wrappers/BrowseBrandWrapper";
import BrowseCategoryWrapper from "../wrappers/BrowseCategoryWrapper";
import BrowseProductWrapper from "../wrappers/BrowseProductWrapper";
import ErrorBoundary from "../components/ErrorBoundary";
import NavCard from "../components/navCard";
import { MainLayout } from "../components/Layout";
import WelcomeSection from "../components/WelcomeSection";
import HeroSection from "../components/HeroSection";
import BenefitsSection from "../components/BenefitsSection";

export default function Browse() {
  return (
    <MainLayout>
      {/* Main Container - Responsive Layout */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 md:bg-gray-10 flex-1">
        {/* Navigation */}
        <NavCard />

        {/* Main Content */}
        <main className="max-w-[640px] mx-auto flex flex-col relative pb-8 pt-[60px] md:max-w-none md:pt-0">
          {/* Welcome Section - Mobile Only */}
          <WelcomeSection />

          {/* Hero Section - Web Only */}
          <HeroSection />

          {/* Brand Section - Positioned differently for mobile/web */}

          {/* Categories Section - Responsive */}
          <section
            id="Categories"
            className="flex flex-col gap-4 px-6 scroll-fade-in md:px-0 md:mt-0"
            data-delay="100"
          >
            <div className="flex items-center justify-between md:hidden">
              <h2 className="font-bold text-xl leading-6 text-gray-800">
                📂 Kategori
              </h2>
              <Link
                to="/browse-product"
                className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
              >
                Lihat Semua →
              </Link>
            </div>
            <ErrorBoundary>
              <BrowseCategoryWrapper />
            </ErrorBoundary>
          </section>
          <section
            id="ProductSection"
            className="flex flex-col gap-3 mt-2  bg-white/90 backdrop-blur-sm mx-2 rounded-2xl  shadow-md border border-gray-100 scroll-fade-in   md:bg-transparent md:shadow-none md:border-none md:backdrop-blur-none md:mx-0 md:px-0 md:rounded-none"
            data-delay="300"
          >
            <div className="md:scroll-fade-in md:mx-20" data-delay="400">
              <ErrorBoundary>
                <BrowseProductWrapper />
              </ErrorBoundary>
            </div>
          </section>

          {/* Brand Section - Mobile Only */}
          <section
            id="BrandMobile"
            className="flex flex-col gap-4 mt-3 px-6 scroll-fade-in md:hidden"
            data-delay="200"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-xl leading-6 text-gray-800">
                🏢 Brand Kami
              </h2>
            </div>
            <ErrorBoundary>
              <BrowseBrandWrapper />
            </ErrorBoundary>
          </section>

          {/* Benefits Section - Web Only */}
          <BenefitsSection />

          {/* Product Section - Responsive */}
          <section className="hidden md:block">
            <ErrorBoundary>
              <BrowseBrandWrapper />
            </ErrorBoundary>
          </section>
        </main>
      </div>
    </MainLayout>
  );
}
