// src/components/CartSidebar.tsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useCart } from "../contexts/CartContext";
import { STORAGE_BASE_URL } from "../api/constants";
import {
  XMarkIcon,
  ShoppingBagIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    items,
    totalItems,
    totalPrice,
    updateItem,
    removeItem,
    clearCart,
    generateWhatsAppMessage,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
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
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Keranjang
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {/* Cart Items */}
                      <div className="mt-8">
                        <div className="flow-root">
                          {items.length === 0 ? (
                            <div className="text-center py-12">
                              <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                              <h3 className="mt-4 text-sm font-medium text-gray-900">
                                Keranjang kosong
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Mulai tambahkan produk atau bundling ke
                                keranjang.
                              </p>
                            </div>
                          ) : (
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {items.map((item) => (
                                <li key={item.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    {item.thumbnail ? (
                                      <img
                                        src={`${STORAGE_BASE_URL}/${item.thumbnail}`}
                                        alt={item.name}
                                        className="h-full w-full object-cover object-center"
                                      />
                                    ) : (
                                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                        <span className="text-2xl">
                                          {item.type === "bundling"
                                            ? "📦"
                                            : "📷"}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3 className="text-sm font-medium">
                                          {item.name}
                                        </h3>
                                        <button
                                          type="button"
                                          onClick={() => removeItem(item.id)}
                                          className="font-medium text-red-600 hover:text-red-500"
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                      </div>

                                      {/* Type Badge */}
                                      <div className="mt-1">
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

                                      {/* Rental Dates */}
                                      <div className="mt-2 text-xs text-gray-500">
                                        <div>
                                          {formatDate(item.startDate)} -{" "}
                                          {formatDate(item.endDate)}
                                        </div>
                                        <div>{item.duration} hari</div>
                                      </div>
                                    </div>

                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleQuantityChange(
                                              item.id,
                                              item.quantity - 1
                                            )
                                          }
                                          className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                                        >
                                          <MinusIcon className="h-3 w-3" />
                                        </button>

                                        <span className="font-medium min-w-[2rem] text-center">
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
                                          className="p-1 rounded border border-gray-300 hover:bg-gray-50"
                                        >
                                          <PlusIcon className="h-3 w-3" />
                                        </button>
                                      </div>

                                      <div className="text-right">
                                        <div className="text-sm font-medium text-gray-900">
                                          {formatPrice(
                                            item.price *
                                              item.quantity *
                                              item.duration
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {formatPrice(item.price)}/hari
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        {/* Summary */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Total Item:</span>
                            <span>{totalItems} unit</span>
                          </div>
                          <div className="flex justify-between text-lg font-semibold text-gray-900">
                            <span>Total:</span>
                            <span>{formatPrice(totalPrice)}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                          <button
                            type="button"
                            onClick={handleCheckout}
                            className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            Checkout via WhatsApp
                          </button>

                          <button
                            type="button"
                            onClick={clearCart}
                            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          >
                            Kosongkan Keranjang
                          </button>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-4 text-xs text-gray-500 space-y-1">
                          <p>• Checkout akan mengarahkan ke WhatsApp</p>
                          <p>• Konfirmasi dan pembayaran melalui admin</p>
                          <p>• Harga dapat berubah setelah konfirmasi</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
