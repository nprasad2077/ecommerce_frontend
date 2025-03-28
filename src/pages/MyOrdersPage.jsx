import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders/myorders/")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left text-sm">
              <th className="p-2">Order ID</th>
              <th className="p-2">Total</th>
              <th className="p-2">Paid</th>
              <th className="p-2">Delivered</th>
              <th className="p-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-t text-sm">
                <td className="p-2">{order._id}</td>
                <td className="p-2">${Number(order.totalPrice).toFixed(2)}</td>
                <td className="p-2">{order.isPaid ? "✅" : "❌"}</td>
                <td className="p-2">{order.isDelivered ? "📦" : "⏳"}</td>
                <td className="p-2">
                  <Link
                    to={`/order/${order._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
