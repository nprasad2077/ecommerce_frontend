import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  ArrowRight,
  CheckCircle,
  Wallet,
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("paymentMethod", paymentMethod);
    // Ensure we're navigating to the correct place
    navigate("/placeorder");

    // Add a small delay to ensure localStorage is updated before navigation
    setTimeout(() => {
      // Double-check if navigation failed and force it if needed
      if (window.location.pathname !== "/placeorder") {
        window.location.href = "/placeorder";
      }
    }, 100);
  };

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto px-4 py-8">
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
                <CreditCard size={16} />
              </div>
              <span className="text-xs mt-1 font-medium text-blue-600">
                Payment
              </span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className="h-full w-0 bg-blue-600"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center">
                3
              </div>
              <span className="text-xs mt-1 text-gray-500">Review</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-1">
              <Wallet className="w-5 h-5 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-800">
                Payment Method
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              Select your preferred payment method
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <label className="relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">
                    PayPal
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5">
                    Pay using your PayPal account
                  </span>
                </span>
                <svg
                  className="ml-auto h-6 w-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14V6c0-1.1-.9-2-2-2H3a2 2 0 00-2 2v8c0 1.1.9 2 2 2h14a2 2 0 002-2z"></path>
                  <path d="M3 6l9 4 9-4"></path>
                </svg>
              </label>

              <label className="relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CreditCard"
                  checked={paymentMethod === "CreditCard"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3">
                  <span className="block text-sm font-medium text-gray-700">
                    Credit Card
                  </span>
                  <span className="block text-xs text-gray-500 mt-0.5">
                    Pay using Visa, Mastercard, or American Express
                  </span>
                </span>
                <CreditCard className="ml-auto h-6 w-6 text-gray-400" />
              </label>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Continue to Review
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
