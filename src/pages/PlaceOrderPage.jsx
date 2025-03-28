import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, CheckCircle, ArrowRight, Truck, Home, CreditCard } from "lucide-react";
import API from "../services/api";
import { getImageUrl } from "../utils/media";
import Toast from "../components/Toast";

export default function PlaceOrderPage() {
  const navigate = useNavigate();
  const [isPlacing, setIsPlacing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [pageReady, setPageReady] = useState(false);

  // Get data from localStorage with error handling
  const [cart, setCart] = useState([]);
  const [shipping, setShipping] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  
  // Calculate order summary values
  const [subtotal, setSubtotal] = useState(0);
  const [taxPrice, setTaxPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Load data and validate on component mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      const savedShipping = localStorage.getItem("shipping");
      const savedPaymentMethod = localStorage.getItem("paymentMethod");
      
      // Validate that we have required data
      if (!savedCart || !savedShipping) {
        // If missing essential data, redirect to appropriate page
        if (!savedShipping) {
          navigate("/shipping");
          return;
        }
        if (!savedCart) {
          navigate("/cart");
          return;
        }
      }
      
      // Parse the data
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      const parsedShipping = savedShipping ? JSON.parse(savedShipping) : {};
      const parsedPaymentMethod = savedPaymentMethod || "PayPal";
      
      // Set state with parsed data
      setCart(parsedCart);
      setShipping(parsedShipping);
      setPaymentMethod(parsedPaymentMethod);
      
      // Calculate order summary
      const calculatedSubtotal = parsedCart.reduce((acc, item) => acc + item.qty * item.price, 0);
      const calculatedTaxPrice = +(calculatedSubtotal * 0.15).toFixed(2);
      const calculatedShippingPrice = calculatedSubtotal > 100 ? 0 : 10;
      const calculatedTotalPrice = +(calculatedSubtotal + calculatedTaxPrice + calculatedShippingPrice).toFixed(2);
      
      setSubtotal(calculatedSubtotal);
      setTaxPrice(calculatedTaxPrice);
      setShippingPrice(calculatedShippingPrice);
      setTotalPrice(calculatedTotalPrice);
      
      setPageReady(true);
    } catch (error) {
      console.error("Error loading order data:", error);
      setToastMessage("Error loading your order information. Please try again.");
      setToastType("error");
      setShowToast(true);
    }
  }, [navigate]);

  const handlePlaceOrder = async () => {
    try {
      setIsPlacing(true);
      
      const orderItems = cart.map((item) => ({
        product: item.product,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
      }));

      const { data } = await API.post("/orders/add/", {
        orderItems,
        shippingAddress: shipping,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      localStorage.removeItem("cart");
      navigate(`/order/${data._id}`);
    } catch (err) {
      setToastMessage("Failed to place order. Please try again.");
      setToastType("error");
      setShowToast(true);
      setIsPlacing(false);
    }
  };

  // If not ready yet, show loading
  if (!pageReady) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse text-gray-500">Loading order information...</div>
      </div>
    );
  }

  // If cart is empty, show warning and redirect button
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <ShoppingBag size={24} className="text-yellow-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">You need to add some items to your cart before placing an order.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Checkout Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <span className="text-xs mt-1 font-medium">Shipping</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className="h-full w-full bg-blue-600"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <CheckCircle size={16} />
            </div>
            <span className="text-xs mt-1 font-medium">Payment</span>
          </div>
          <div className="flex-1 h-1 mx-4 bg-gray-200">
            <div className="h-full w-full bg-blue-600"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
            <span className="text-xs mt-1 font-medium text-blue-600">Review</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-1">
                <Truck className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-800">Shipping</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start">
                <Home className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium text-gray-800">Address: </span>
                    {shipping.address}, {shipping.city}, {shipping.postalCode}, {shipping.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-1">
                <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-800">Payment</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                <span className="font-medium text-gray-800">Method: </span>
                {paymentMethod}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-1">
                <ShoppingBag className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-800">Order Items</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.product} className="py-4 first:pt-0 last:pb-0 flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm sticky top-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (15%)</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${shippingPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing || cart.length === 0}
                  className={`w-full flex justify-center items-center ${
                    isPlacing || cart.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mt-4`}
                >
                  {isPlacing ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Place Order
                      <ArrowRight size={16} className="ml-2" />
                    </span>
                  )}
                </button>

                {cart.length === 0 && (
                  <p className="text-sm text-red-600 mt-2">
                    Your cart is empty. Add some products before placing order.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}