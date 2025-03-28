import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/orders/${id}/`)
      .then((res) => setOrder(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!order) return <p className="p-8">Loading order...</p>;

  const handleMarkPaid = async () => {
    try {
      await API.put(`/orders/${id}/pay/`);
      alert("Payment marked as successful!");
      window.location.reload();
    } catch (err) {
      alert("Failed to mark as paid.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Thank you! 🎉</h2>
      <p className="mb-2">
        Your order ID is: <strong>{order._id}</strong>
      </p>
      <p>
        We'll send a confirmation email to <strong>{order.user.email}</strong>.
      </p>
      {!order.isPaid && (
        <button
          onClick={handleMarkPaid}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Simulate Payment Success
        </button>
      )}

      {order.isPaid && (
        <p className="mt-4 text-green-700 font-semibold">
          ✅ Paid at: {new Date(order.paidAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
