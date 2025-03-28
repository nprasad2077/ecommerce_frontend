import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("paymentMethod", paymentMethod);
    navigate("/placeorder");
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <input
            type="radio"
            name="paymentMethod"
            value="PayPal"
            checked={paymentMethod === "PayPal"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="ml-2">PayPal</span>
        </label>

        <label className="block">
          <input
            type="radio"
            name="paymentMethod"
            value="CreditCard"
            checked={paymentMethod === "CreditCard"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span className="ml-2">Credit Card</span>
        </label>

        <button className="w-full bg-black text-white py-2 rounded">
          Continue
        </button>
      </form>
    </div>
  );
}
