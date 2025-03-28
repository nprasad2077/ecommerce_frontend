import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function PlaceOrderPage() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const shipping = JSON.parse(localStorage.getItem("shipping"));
  const paymentMethod = localStorage.getItem("paymentMethod");

  const subtotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  const taxPrice = +(subtotal * 0.15).toFixed(2);
  const shippingPrice = subtotal > 100 ? 0 : 10;
  const totalPrice = +(subtotal + taxPrice + shippingPrice).toFixed(2);

  const handlePlaceOrder = async () => {
    try {
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
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-4">
        <div className="border p-4 rounded">
          <h3 className="font-semibold">Shipping</h3>
          <p>{shipping.address}, {shipping.city}, {shipping.postalCode}, {shipping.country}</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold">Payment</h3>
          <p>{paymentMethod}</p>
        </div>

        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Items</h3>
          {cart.map((item) => (
            <div key={item.product} className="flex justify-between text-sm">
              <span>{item.qty} × {item.name}</span>
              <span>${(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border p-4 rounded font-medium">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax: ${taxPrice.toFixed(2)}</p>
          <p>Shipping: ${shippingPrice.toFixed(2)}</p>
          <p>Total: ${totalPrice.toFixed(2)}</p>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-black text-white py-2 rounded"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
