import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/media";
import Toast from "./Toast";
import { useCart } from "../context/CartContext";
import Stars from "./Stars";
import { ShoppingBag, Heart, Eye, Tag } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product);
    setShowToast(true);
  };
  
  // Calculate if product is on sale (assuming product.oldPrice exists for items on sale)
  const isOnSale = product.oldPrice && product.oldPrice > product.price;
  const discountPercentage = isOnSale 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  return (
    <div 
      className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer bg-white"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-48 object-cover bg-gray-100 transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.countInStock === 0 && (
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
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
              <Tag size={12} className="mr-1" />
              {discountPercentage}% Off
            </span>
          )}
        </div>
        
        {/* Quick action buttons - only show on hover */}
        <div 
          className={`absolute right-3 top-3 flex flex-col gap-2 transition-opacity duration-300 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button 
            className="bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Add wishlist functionality here
            }}
            aria-label="Add to wishlist"
          >
            <Heart size={16} className="text-gray-700" />
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
      
      <div className="p-4">
        {/* Category - if available */}
        {product.category && (
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
        )}
        
        {/* Product name */}
        <h3 className="text-sm font-medium mb-1 line-clamp-2 h-10">{product.name}</h3>
        
        {/* Ratings */}
        <div className="flex items-center mb-2">
          <Stars value={product.rating} />
          <span className="text-xs text-gray-600 ml-1">
            ({product.numReviews})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center mt-2">
          <span className="font-bold text-sm mr-2">${product.price}</span>
          {isOnSale && (
            <span className="text-gray-500 text-xs line-through">
              ${product.oldPrice}
            </span>
          )}
        </div>
        
        {/* Add to cart button - full width on desktop */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 text-sm flex items-center justify-center transition-colors"
          disabled={product.countInStock === 0}
        >
          <ShoppingBag size={14} className="mr-1" />
          Add to Cart
        </button>
      </div>
      
      {showToast && (
        <Toast
          message="Added to cart!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}