import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import FullScreenLoader from "./components/FullScreenLoader";

const Browse = lazy(() => import("./pages/browse"));
const BrowseProduct = lazy(() => import("./pages/BrowseProduct"));
const CategoryDetails = lazy(() => import("./pages/CategoryDetails"));
const Details = lazy(() => import("./pages/Details"));
const BundlingDetails = lazy(() => import("./pages/BundlingDetails"));
const BookProduct = lazy(() => import("./pages/BookProduct"));
const SubCategoryDetails = lazy(() => import("./pages/SubCategoryDetails"));
const BrandDetails = lazy(() => import("./pages/BrandDetails"));
const SuccessBooking = lazy(() => import("./pages/SuccessBooking"));
const CheckBooking = lazy(() => import("./pages/CheckBooking"));
const CaraSewa = lazy(() => import("./pages/CaraSewa"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<FullScreenLoader />}>
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/browse-product" element={<BrowseProduct />} />
            <Route path="/product/:slug" element={<Details />} />
            <Route path="/bundling/:slug" element={<BundlingDetails />} />
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
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
