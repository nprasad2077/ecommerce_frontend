import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { CheckCircle, CreditCard, Truck, Clock, ShoppingBag, ArrowLeft, Home } from "lucide-react";
import { getImageUrl } from "../utils/media";
import Toast from "../components/Toast";

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/orders/${id}/`);
      console.log('Order data:', res.data);
      setOrder(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError("Failed to load order details");
      setLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    try {
      await API.put(`/orders/${id}/pay/`);
      setToastMessage("Payment marked as successful!");
      setToastType("success");
      setShowToast(true);
      fetchOrder();
    } catch (err) {
      setToastMessage("Failed to mark as paid.");
      setToastType("error");
      setShowToast(true);
    }
  };

  // Safely parse numeric values
  const safeNumber = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-pulse text-gray-500">Loading order details...</div>
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

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-600">Order not found.</p>
        </div>
      </div>
    );
  }

  const items = order.orderItems || [];
  const shippingAddress = order.shippingAddress || {};
  
  // Safely get numeric values with fallbacks
  const totalPrice = safeNumber(order.totalPrice);
  const taxPrice = safeNumber(order.taxPrice);
  const shippingPrice = safeNumber(order.shippingPrice);
  const itemsPrice = safeNumber(order.itemsPrice) || (totalPrice - taxPrice - shippingPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link to="/myorders" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to My Orders
      </Link>
      
      {/* Order confirmation */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-800">Order Confirmed!</h1>
              </div>
              <p className="text-gray-600">
                Order <span className="font-medium">#{order._id}</span> was placed successfully.
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-600">
                Order Date: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Status */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              {order.isPaid ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
              )}
              <span className="text-sm">
                <span className="font-medium">Payment Status:</span>{" "}
                {order.isPaid ? (
                  <span className="text-green-600">Paid</span>
                ) : (
                  <span className="text-yellow-600">Pending</span>
                )}
              </span>
            </div>
            
            <div className="flex items-center">
              {order.isDelivered ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-600 mr-2" />
              )}
              <span className="text-sm">
                <span className="font-medium">Delivery Status:</span>{" "}
                {order.isDelivered ? (
                  <span className="text-green-600">Delivered</span>
                ) : (
                  <span className="text-yellow-600">Processing</span>
                )}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {/* Shipping Information */}
          <div>
            <div className="flex items-center mb-4">
              <Truck className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-bold text-gray-800">Shipping Info</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Name: </span>
                {order.user?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Email: </span>
                {order.user?.email || "N/A"}
              </p>
              <div className="flex items-start mt-2">
                <Home className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                <p className="text-sm text-gray-600">
                  {shippingAddress.address || "N/A"}, 
                  {shippingAddress.city || "N/A"},{" "}
                  {shippingAddress.postalCode || "N/A"}, 
                  {shippingAddress.country || "N/A"}
                </p>
              </div>
            </div>
          </div>
          
          {/* Payment Information */}
          <div>
            <div className="flex items-center mb-4">
              <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-bold text-gray-800">Payment Info</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Method: </span>
                {order.paymentMethod || "N/A"}
              </p>
              {order.isPaid ? (
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Paid At: </span>
                  {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}
                </p>
              ) : (
                <div className="mt-2">
                  <button
                    onClick={handleMarkPaid}
                    className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    Simulate Payment
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="flex items-center mb-4">
              <ShoppingBag className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">${itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">${shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">${taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
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
          {!items || items.length === 0 ? (
            <p className="text-gray-600">No items in this order.</p>
          ) : (
            <div className="divide-y">
              {items.map((item, index) => (
                <div key={item._id || index} className="py-4 first:pt-0 last:pb-0 flex items-center">
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
                      {safeNumber(item.qty || 1)} x ${safeNumber(item.price).toFixed(2)} = ${(safeNumber(item.qty || 1) * safeNumber(item.price)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
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