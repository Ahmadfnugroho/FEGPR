import { BrowserRouter, Route, Routes } from "react-router-dom";
import Browse from "./pages/browse";
import CategoryDetails from "./pages/CategoryDetails";
import Details from "./pages/Details";
import BookProduct from "./pages/BookProduct";
import SubCategoryDetails from "./pages/SubCategoryDetails";
import BrandDetails from "./pages/BrandDetails";
import SuccessBooking from "./pages/SuccessBooking";
import CheckBooking from "./pages/CheckBooking";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/product/:slug" element={<Details />} />
          <Route path="/product/:slug/book" element={<BookProduct />} />
          <Route path="/category/:slug" element={<CategoryDetails />} />
          <Route path="/sub-category/:slug" element={<SubCategoryDetails />} />
          <Route path="/brand/:slug" element={<BrandDetails />} />
          <Route path="/success-booking" element={<SuccessBooking />} />
          <Route path="/check-booking" element={<CheckBooking />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
