import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import {
  Package,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  ShoppingBag,
  Search,
} from "lucide-react";
import Toast from "../components/Toast";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order._id.toString().includes(searchTerm) ||
            new Date(order.createdAt).toLocaleDateString().includes(searchTerm)
        )
      );
    }
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/orders/myorders/");
      setOrders(res.data);
      setFilteredOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load your orders. Please try again later.");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const getStatusBadge = (isPaid, isDelivered) => {
    if (isDelivered) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center">
          <CheckCircle size={12} className="mr-1" />
          Delivered
        </span>
      );
    } else if (isPaid) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center">
          <Package size={12} className="mr-1" />
          Shipped
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center">
          <Clock size={12} className="mr-1" />
          Processing
        </span>
      );
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse text-gray-500">
          Loading your orders...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <ShoppingBag className="w-5 h-5 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by order ID or date"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Package size={24} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">No orders found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "No orders match your search criteria."
                : "You haven't placed any orders yet."}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Browse Products
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        #{order._id}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">
                        ${Number(order.totalPrice).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.isPaid, order.isDelivered)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
