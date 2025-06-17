import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

const Browse = lazy(() => import("./pages/browse"));
const CategoryDetails = lazy(() => import("./pages/CategoryDetails"));
const Details = lazy(() => import("./pages/Details"));
const BookProduct = lazy(() => import("./pages/BookProduct"));
const SubCategoryDetails = lazy(() => import("./pages/SubCategoryDetails"));
const BrandDetails = lazy(() => import("./pages/BrandDetails"));
const SuccessBooking = lazy(() => import("./pages/SuccessBooking"));
const CheckBooking = lazy(() => import("./pages/CheckBooking"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/product/:slug" element={<Details />} />
            <Route path="/product/:slug/book" element={<BookProduct />} />
            <Route path="/category/:slug" element={<CategoryDetails />} />
            <Route
              path="/sub-category/:slug"
              element={<SubCategoryDetails />}
            />
            <Route path="/brand/:slug" element={<BrandDetails />} />
            <Route path="/success-booking" element={<SuccessBooking />} />
            <Route path="/check-booking" element={<CheckBooking />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
