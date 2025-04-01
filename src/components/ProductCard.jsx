import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/media";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useToast } from "../context/ToastContext";
import Stars from "./Stars";
import { ShoppingBag, Heart, Eye, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();
  const isProductFavorited = isFavorite(product._id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    showToast("Added to cart!");
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    const wasAdded = toggleFavorite(product);
    showToast(
      wasAdded ? "Added to favorites!" : "Removed from favorites",
      wasAdded ? "success" : "info"
    );
  };

  // Calculate if product is on sale
  const isOnSale = product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = isOnSale
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 cursor-pointer relative transform hover:scale-[1.02] hover:shadow-md group-hover:ring-2 group-hover:ring-blue-100 focus-within:ring-2 focus-within:ring-blue-200"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => navigate(`/product/${product._id}`)}
      style={{
        boxShadow: isHovering
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 10px -5px rgba(0, 0, 0, 0.04)"
          : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        border: isHovering
          ? "1px solid rgba(219, 234, 254, 1)"
          : "1px solid rgba(229, 231, 235, 1)",
      }}
    >
      <div className="relative overflow-hidden">
        <div className="relative w-full aspect-[1/1] bg-gray-100 overflow-hidden">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/300x300?text=Product+Image";
            }}
          />
        </div>

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.countInStock === 0 && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Out of Stock
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              New Arrival
            </span>
          )}
          {isOnSale && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
              <Tag size={12} className="mr-1" />
              {discountPercentage}% Off
            </span>
          )}
        </div>

        {/* Quick action buttons */}
        <div
          className={`absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovering
              ? "opacity-100 transform translate-x-0"
              : "opacity-0 transform translate-x-3"
          }`}
        >
          <button
            className={`p-2 rounded-full shadow-md transition-colors ${
              isProductFavorited
                ? "bg-red-50 hover:bg-red-100"
                : "bg-white hover:bg-gray-100"
            }`}
            onClick={handleToggleFavorite}
            aria-label={
              isProductFavorited ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              size={16}
              className={
                isProductFavorited
                  ? "text-red-500 fill-current"
                  : "text-gray-700"
              }
            />
          </button>
          <button
            className="bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product._id}`);
            }}
            aria-label="Quick view"
          >
            <Eye size={16} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Product details */}
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center mb-1">
          {product.category && (
            <p className="text-xs text-blue-600 font-medium transition-colors group-hover:text-blue-700">
              {product.category}
            </p>
          )}
          {product.brand && (
            <p className="text-xs text-gray-600">{product.brand}</p>
          )}
        </div>

        <h3 className="text-sm font-medium mb-1 line-clamp-2 h-10 text-gray-800 group-hover:text-gray-900">
          {product.name}
        </h3>

        <div className="flex items-center mb-2">
          <Stars value={product.rating} />
          <span className="text-xs text-gray-600 ml-1">
            ({product.numReviews})
          </span>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="flex items-center">
            <span className="font-bold text-sm mr-2">${product.price}</span>
            {isOnSale && (
              <span className="text-gray-500 text-xs line-through">
                ${product.oldPrice}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-600">
            {product.countInStock > 0
              ? `${product.countInStock} in stock`
              : "Out of stock"}
          </span>
        </div>

        <div className="mt-4">
          <button
            onClick={handleAddToCart}
            className={`w-full bg-transparent border border-blue-600 text-blue-600 py-2 px-3 rounded-md hover:bg-blue-600 hover:text-white text-sm flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${
              isHovering ? "opacity-100" : "opacity-70"
            }`}
            disabled={product.countInStock === 0}
          >
            <ShoppingBag size={14} className="mr-1" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
