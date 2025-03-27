import React from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { getImageUrl } from "../utils/media";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="border rounded-2xl overflow-hidden shadow hover:shadow-md transition">
      <img
        src={getImageUrl(product.image)}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-500 mb-2">${product.price}</p>
        <div className="flex justify-between items-center">
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            View
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
