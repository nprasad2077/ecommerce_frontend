import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/media";
import Stars from "../components/Stars";
import Toast from "../components/Toast";
import PageWrapper from "../components/PageWrapper";
import {
  ShoppingBag,
  Heart,
  Check,
  ArrowLeft,
  Edit,
  Trash2,
  Tag,
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${id}/`);
      setProduct(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load product", err);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (quantity > 0 && product) {
      addItem(product, quantity);
      setToastMessage("Added to cart!");
      setShowToast(true);
      setToastType("success");
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      const wasAdded = toggleFavorite(product);
      setToastMessage(
        wasAdded ? "Added to favorites!" : "Removed from favorites"
      );
      setToastType(wasAdded ? "success" : "info");
      setShowToast(true);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/products/${id}/reviews/`, { rating, comment });
      setReviewed(true);
      setRating(5);
      setComment("");
      setToastMessage("Review submitted successfully!");
      setShowToast(true);
      setToastType("success");
      fetchProduct(); // Refresh reviews
    } catch {
      setToastMessage("Failed to submit review.");
      setShowToast(true);
      setToastType("error");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`/products/${id}/reviews/${reviewId}/`);
      setToastMessage("Review deleted successfully!");
      setShowToast(true);
      setToastType("success");
      fetchProduct();
    } catch {
      setToastMessage("Failed to delete review.");
      setShowToast(true);
      setToastType("error");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 flex justify-center">
        <div className="animate-pulse text-gray-500">
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-600">Product not found.</p>
        </div>
      </div>
    );
  }

  const productRating =
    typeof product.rating === "number"
      ? product.rating
      : typeof product.rating === "string"
      ? parseFloat(product.rating)
      : 0;

  const isOnSale = product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = isOnSale
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const hasReviewed =
    Array.isArray(product.reviews) &&
    product.reviews.some((r) => user && r.user === user._id);

  const isProductFavorited = isFavorite(product._id);

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-blue-600">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{product.name}</span>
        </div>

        {/* Back button */}
        <Link
          to="/products"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to products
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="max-w-full max-h-80 object-contain"
              />
            </div>

            {/* Product Info */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.countInStock > 0 ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    <Check size={12} className="mr-1" />
                    In Stock
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Out of Stock
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    New Arrival
                  </span>
                )}
                {isOnSale && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
                    <Tag size={12} className="mr-1" />
                    {discountPercentage}% Off
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <Stars value={productRating} />
                <span className="text-sm text-gray-600 ml-2">
                  {productRating.toFixed(1)} ({product.numReviews || 0} reviews)
                </span>
              </div>

              <div className="text-gray-600 mb-6">
                <p className="mb-2">
                  <span className="font-medium text-gray-700">Brand:</span>{" "}
                  {product.brand}
                </p>
                {product.category && (
                  <p className="mb-2">
                    <span className="font-medium text-gray-700">Category:</span>{" "}
                    {product.category}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">{product.description}</p>
              </div>

              <div className="flex items-end mb-8">
                <span className="text-3xl font-bold text-gray-900 mr-3">
                  ${product.price}
                </span>
                {isOnSale && (
                  <>
                    <span className="text-lg text-gray-500 line-through mr-2">
                      ${product.oldPrice}
                    </span>
                    <span className="text-green-600 font-medium">
                      {discountPercentage}% off
                    </span>
                  </>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <div className="relative">
                    <label
                      htmlFor="quantity"
                      className="absolute -top-6 left-0 text-sm text-gray-700"
                    >
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      max={product.countInStock || 1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-24 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!product.countInStock}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.countInStock}
                    className={`flex items-center px-6 py-2 rounded-md ${
                      !product.countInStock
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    Add to Cart
                  </button>

                  <button
                    onClick={handleToggleFavorite}
                    className={`flex items-center px-3 py-2 rounded-md border transition-colors ${
                      isProductFavorited
                        ? "border-red-200 bg-red-50 hover:bg-red-100"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    aria-label={
                      isProductFavorited
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <Heart
                      size={18}
                      className={
                        isProductFavorited
                          ? "text-red-500 fill-current"
                          : "text-gray-700"
                      }
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>

            {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-6 relative">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-medium">
                        {review.name?.charAt(0) || "U"}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">
                          {review.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : "Unknown date"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <Stars value={review.rating || 0} />
                    </div>

                    <p className="text-gray-700">
                      {review.comment || "No comment provided"}
                    </p>

                    {user && user._id === review.user && (
                      <div className="absolute top-0 right-0 flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-700 p-1"
                          onClick={() => {
                            setRating(review.rating || 5);
                            setComment(review.comment || "");
                            setReviewed(false); // Re-enable form
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-700 p-1"
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>

          {/* Review Form */}
          <div>
            {user && !reviewed && !hasReviewed ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold mb-4">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="rating"
                      className="block text-sm text-gray-700 mb-1"
                    >
                      Rating
                    </label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} -{" "}
                          {
                            ["Poor", "Fair", "Good", "Very Good", "Excellent"][
                              n - 1
                            ]
                          }
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm text-gray-700 mb-1"
                    >
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            ) : user && (hasReviewed || reviewed) ? (
              <div className="bg-green-50 text-green-800 p-4 rounded-lg">
                <div className="flex items-center">
                  <Check size={18} className="mr-2" />
                  <p className="font-medium">
                    You've already reviewed this product
                  </p>
                </div>
                <p className="text-sm mt-1">
                  Thank you for sharing your experience with this product!
                </p>
              </div>
            ) : !user ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  Please sign in to write a review.
                </p>
                <a
                  href="/login"
                  className="inline-block text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in now
                </a>
              </div>
            ) : null}
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
    </PageWrapper>
  );
}
