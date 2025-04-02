import React from "react";
import { getImageUrl } from "../utils/media";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingBag, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import PageWrapper from "../components/PageWrapper";

export default function CartPage() {
  const { cart, updateCart } = useCart();
  const navigate = useNavigate();

  const updateQty = (id, qty) => {
    const updated = cart.map((item) =>
      item.product === id ? { ...item, qty } : item
    );
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.product !== id);
    updateCart(updated);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Cart items */}
                <div className="divide-y">
                  {cart.map((item) => (
                    <div key={item.product} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="flex-shrink-0 w-full sm:w-auto mb-4 sm:mb-0">
                          <img
                            src={getImageUrl(item.image)}
                            alt={item.name}
                            className="w-full sm:w-16 h-16 object-cover rounded"
                          />
                        </div>

                        <div className="sm:ml-4 flex-grow">
                          <h3 className="font-medium text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            ${item.price}
                          </p>
                        </div>

                        <div className="flex items-center mt-4 sm:mt-0">
                          <div className="flex items-center border rounded-md mr-4">
                            <button
                              onClick={() =>
                                updateQty(
                                  item.product,
                                  Math.max(1, item.qty - 1)
                                )
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              disabled={item.qty <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 border-x">
                              {item.qty}
                            </span>
                            <button
                              onClick={() =>
                                updateQty(item.product, item.qty + 1)
                              }
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue shopping button */}
                <div className="bg-gray-50 px-6 py-4">
                  <button
                    onClick={() => navigate("/products")}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/shipping")}
                  className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 flex items-center justify-center font-medium"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} className="ml-1" />
                </button>

                {/* Shipping notice */}
                {subtotal > 100 ? (
                  <div className="mt-4 bg-green-50 text-green-800 text-sm px-3 py-2 rounded-md">
                    You qualify for free shipping!
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-600">
                    Add ${(100 - subtotal).toFixed(2)} more to qualify for free
                    shipping.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
