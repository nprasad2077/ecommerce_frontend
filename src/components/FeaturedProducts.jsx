// src/components/FeaturedProducts.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { defaultMotionTransition, defaultStaggeredTransition } from "../utils/animationConfig";

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data } = await API.get("/products?limit=4");
        setFeatured(data.products);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Featured Products</h2>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={defaultMotionTransition}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
          </motion.div>
        ) : (
          <motion.div
            key="featured"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: {},
              visible: {
                transition: defaultStaggeredTransition,
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {featured.map((product) => (
              <motion.div
                key={product._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={defaultMotionTransition}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
