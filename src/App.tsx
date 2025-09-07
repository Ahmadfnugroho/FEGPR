import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import FullScreenLoader from "./components/FullScreenLoader";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import ErrorBoundary from "./components/ErrorBoundary";
import SkipLink from "./components/SkipLink";
import FloatingCartButton from "./components/FloatingCartButton";
import { CartProvider } from "./contexts/CartContext";
import { usePWA } from "./hooks/usePWA";

const Browse = lazy(() => import("./pages/browse"));
const BrowseProduct = lazy(() => import("./pages/BrowseProduct"));
const CategoryDetails = lazy(() => import("./pages/CategoryDetails"));
const Details = lazy(() => import("./pages/Details"));
const BundlingDetails = lazy(() => import("./pages/BundlingDetails"));
const BundlingList = lazy(() => import("./pages/BundlingList"));
const BookProduct = lazy(() => import("./pages/BookProduct"));
const SubCategoryDetails = lazy(() => import("./pages/SubCategoryDetails"));
const BrandDetails = lazy(() => import("./pages/BrandDetails"));
const SuccessBooking = lazy(() => import("./pages/SuccessBooking"));
const CheckBooking = lazy(() => import("./pages/CheckBooking"));
const CaraSewa = lazy(() => import("./pages/CaraSewa"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Cart = lazy(() => import("./pages/Cart"));

function App() {
  const {
    installApp,
    updateApp,
    InstallPrompt,
    UpdatePrompt,
    OfflineIndicator
  } = usePWA();

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      console.log('App installed successfully');
    }
  };

  const handleUpdate = () => {
    updateApp();
  };

  const handleDismissInstall = () => {
    // Store in localStorage to remember user's choice
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleDismissUpdate = () => {
    // Store in localStorage to remember user's choice
    localStorage.setItem('pwa-update-dismissed', Date.now().toString());
  };

  return (
    <CartProvider>
      <ErrorBoundary>
        <SkipLink targetId="main-content">Skip to main content</SkipLink>
        <OfflineIndicator />
      
      <BrowserRouter>
        <Suspense fallback={<FullScreenLoader />}>
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/browse-product" element={<BrowseProduct />} />
            <Route path="/products" element={<BrowseProduct />} />
            <Route path="/product/:slug" element={<Details />} />
            <Route path="/bundling/:slug" element={<BundlingDetails />} />
            <Route path="/bundlings" element={<BundlingList />} />
            <Route path="/product/:slug/book" element={<BookProduct />} />
            <Route path="/category/:slug" element={<CategoryDetails />} />
            <Route
              path="/sub-category/:slug"
              element={<SubCategoryDetails />}
            />
            <Route path="/brand/:slug" element={<BrandDetails />} />
            <Route path="/success-booking" element={<SuccessBooking />} />
            <Route path="/check-booking" element={<CheckBooking />} />
            <Route path="/cara-sewa" element={<CaraSewa />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Suspense>
        <FloatingWhatsAppButton />
        <FloatingCartButton />
      </BrowserRouter>
      
      {/* PWA Install Prompt */}
      <InstallPrompt 
        onInstall={handleInstall}
        onDismiss={handleDismissInstall}
      />
      
      {/* PWA Update Prompt */}
      <UpdatePrompt 
        onUpdate={handleUpdate}
        onDismiss={handleDismissUpdate}
      />
      </ErrorBoundary>
    </CartProvider>
  );
}

export default App;
