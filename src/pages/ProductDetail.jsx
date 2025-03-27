import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { addToCart } from "../utils/cart";
import { getImageUrl } from "../utils/media";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`/products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p className="p-8">Loading product...</p>;
  
  
  return (
    <div className="p-8 max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
      <img src={getImageUrl(product.image)} alt={product.name} className="w-full rounded-lg" />

      <div>
        <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-500 mb-2">Brand: {product.brand}</p>
        <p className="text-lg font-medium text-black mb-4">${product.price}</p>
        <p className="text-sm text-gray-600 mb-6">{product.description}</p>

        <button
          onClick={() => addToCart(product)}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
