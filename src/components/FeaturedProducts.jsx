// src/components/FeaturedProducts.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: fetch 3 or 4 newest or “featured” products
    async function fetchFeatured() {
      try {
        const { data } = await API.get("/products?limit=4");
        setFeatured(data.products); 
        // Adjust field name if your backend response differs
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  if (loading) {
    return <p className="text-center py-6 text-gray-500">Loading featured...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {featured.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
