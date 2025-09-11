// src/pages/Cart.tsx
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { STORAGE_BASE_URL } from "../api/constants";
import {
  formatPrice,
  formatRentalDuration,
} from "../utils/rental-duration-helper";
import {
  ShoppingBagIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function Cart() {
  const {
    items,
    totalItems,
    totalPrice,
    updateItem,
    removeItem,
    clearCart,
    generateWhatsAppMessage,
  } = useCart();

  // Use formatPrice from helper function instead

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateItem(itemId, { quantity: newQuantity });
    }
  };

  const handleCheckout = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "6281212349564"; // Replace with actual WhatsApp number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Keranjang Anda Kosong
            </h2>
            <p className="mt-2 text-gray-600">
              Mulai jelajahi produk dan bundling kami untuk rental peralatan
              foto.
            </p>
            <div className="mt-8 space-x-4">
              <Link
                to="/browse-product"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Jelajahi Produk
              </Link>
              <Link
                to="/bundlings"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Lihat Bundling
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Kembali Belanja
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Keranjang</h1>
          <p className="text-gray-600 mt-2">
            {totalItems} item dalam keranjang
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-6 sm:px-6">
                <div className="flow-root">
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {items.map((item) => (
                      <li key={item.id} className="py-6 flex">
                        <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          {item.thumbnail ? (
                            <img
                              src={`${STORAGE_BASE_URL}/${item.thumbnail}`}
                              alt={item.name}
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                              <span className="text-4xl">
                                {item.type === "bundling" ? "📦" : "📷"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="ml-4 flex flex-1 flex-col justify-between">
                          <div>
                            <div className="flex justify-between">
                              <div className="pr-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  <Link
                                    to={
                                      item.type === "product"
                                        ? `/product/${item.slug}`
                                        : `/bundling/${item.slug}`
                                    }
                                    className="hover:text-blue-600 transition-colors"
                                  >
                                    {item.name}
                                  </Link>
                                </h3>

                                {/* Type Badge */}
                                <div className="mt-2">
                                  <span
                                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                      item.type === "product"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                                  >
                                    {item.type === "product"
                                      ? "Produk"
                                      : "Bundling"}
                                  </span>
                                </div>

                                {/* Category and Brand */}
                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                  {item.category && (
                                    <span>{item.category.name}</span>
                                  )}
                                  {item.category && item.brand && (
                                    <span className="mx-2">•</span>
                                  )}
                                  {item.brand && <span>{item.brand.name}</span>}
                                </div>

                                {/* Rental Period */}
                                <div className="mt-3 text-sm text-gray-700">
                                  <div className="font-medium">
                                    Periode Rental:
                                  </div>
                                  <div>{formatDate(item.startDate)}</div>
                                  <div>sampai {formatDate(item.endDate)}</div>
                                  <div className="text-blue-600 font-semibold">
                                    {formatRentalDuration(item.duration)}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  className="text-red-600 hover:text-red-500 transition-colors"
                                >
                                  <TrashIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-700">
                                  Jumlah:
                                </span>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                  >
                                    <MinusIcon className="h-4 w-4" />
                                  </button>

                                  <span className="font-medium min-w-[3rem] text-center px-3 py-2 border border-gray-300 rounded-lg">
                                    {item.quantity}
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleQuantityChange(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                                  >
                                    <PlusIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">
                                  {formatPrice(
                                    item.price * item.quantity * item.duration
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatPrice(item.price)}/hari ×{" "}
                                  {item.quantity} ×{" "}
                                  {formatRentalDuration(item.duration)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Clear Cart */}
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-6 sm:px-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Total Item:</span>
                    <span>{totalItems} unit</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Hari Rental:</span>
                    <span>
                      {items.reduce((total, item) => total + item.duration, 0)}{" "}
                      hari-unit
                    </span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Checkout via WhatsApp
                </button>

                {/* Additional Info */}
                <div className="mt-6 text-xs text-gray-500 space-y-2">
                  <div className="font-medium text-gray-700">
                    Informasi Penting:
                  </div>
                  <ul className="space-y-1">
                    <li>• Harga dapat berubah setelah konfirmasi admin</li>
                    <li>
                      • Pembayaran dilakukan setelah konfirmasi ketersediaan
                    </li>
                    <li>
                      • Barang dapat diambil atau dikirim (biaya terpisah)
                    </li>
                    <li>• Konfirmasi pemesanan melalui WhatsApp</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/browse-product"
                className="flex items-center justify-center w-full bg-white border border-gray-300 py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Lanjut Belanja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
