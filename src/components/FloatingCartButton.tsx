// src/components/FloatingCartButton.tsx
import { useState } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCart } from "../contexts/CartContext";
import CartSidebar from "./CartSidebar";

export default function FloatingCartButton() {
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Don't show button if cart is empty
  // if (totalItems === 0) {
  //   return null;
  // }

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="  fixed right-8 md:right-4 lg:right-14  text-slate-950 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={`Keranjang - ${totalItems} item`}
      >
        <div className="relative">
          <ShoppingBagIcon className="h-[20px] md:h-8 md:w-8" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center min-w-[1.5rem]">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </div>
      </button>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
