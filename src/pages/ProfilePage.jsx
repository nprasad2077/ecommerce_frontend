import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  ShoppingBag,
  Calendar,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchRecentOrders();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await API.get("/users/profile/");
      setForm({
        name: res.data.name,
        email: res.data.email,
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setToastMessage("Failed to load your profile. Please try again.");
      setToastType("error");
      setShowToast(true);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await API.get("/orders/myorders/");
      // Get the 3 most recent orders
      setRecentOrders(res.data.slice(0, 3));
      setLoadingOrders(false);
    } catch (err) {
      console.error("Failed to fetch recent orders:", err);
      setLoadingOrders(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.password && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Only send password if it's been changed
      const updateData = {
        name: form.name,
        ...(form.password ? { password: form.password } : {}),
      };

      const { data } = await API.put("/users/profile/update/", updateData);
      login(data); // Update context/localStorage

      setToastMessage("Profile updated successfully!");
      setToastType("success");
      setShowToast(true);

      // Clear password fields after successful update
      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error("Failed to update profile:", err);
      setToastMessage("Failed to update profile. Please try again.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
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
          <ShoppingBag size={12} className="mr-1" />
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-1">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
              </div>
              <p className="text-gray-600 text-sm">
                Update your personal information
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`w-full pl-10 px-3 py-2 border ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      value={form.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                      value={form.email}
                      readOnly
                      disabled
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Email address cannot be changed
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Change Password
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          className={`w-full pl-10 px-3 py-2 border ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Leave blank to keep current password"
                          value={form.password}
                          onChange={handleChange}
                        />
                        {errors.password && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          className={`w-full pl-10 px-3 py-2 border ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Confirm your new password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Updating...
                      </>
                    ) : (
                      <>Update Profile</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-800">
                    Recent Orders
                  </h2>
                </div>
                <Link
                  to="/myorders"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                </Link>
              </div>
            </div>

            <div className="p-6">
              {loadingOrders ? (
                <div className="animate-pulse text-gray-500 text-center py-8">
                  Loading recent orders...
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <ShoppingBag size={20} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    You haven't placed any orders yet.
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Browse Products
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between mb-2">
                        <div className="font-medium text-gray-900">
                          Order #{order._id}
                        </div>
                        {getStatusBadge(order.isPaid, order.isDelivered)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="flex justify-between">
                        <div className="text-gray-700 font-medium">
                          $
                          {order.totalPrice
                            ? Number(order.totalPrice).toFixed(2)
                            : "0.00"}
                        </div>
                        <Link
                          to={`/order/${order._id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Account Security */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-1">
                <Lock className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-800">
                  Account Security
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Password</span>
                  <span className="text-green-600 flex items-center">
                    <CheckCircle size={14} className="mr-1" />
                    Set
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">
                    Two-Factor Authentication
                  </span>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    Enable
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Account Activity</span>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    View
                  </button>
                </div>
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
