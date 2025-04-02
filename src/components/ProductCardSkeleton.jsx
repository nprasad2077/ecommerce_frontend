import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-full aspect-[1/1] bg-gray-200 rounded mb-4" />

      {/* Category and brand */}
      <div className="flex justify-between items-center mb-2">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-100 rounded" />
      </div>

      {/* Product name */}
      <div className="h-4 w-full bg-gray-200 rounded mb-2" />
      <div className="h-4 w-2/3 bg-gray-100 rounded mb-4" />

      {/* Stars and reviews */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-8 bg-gray-100 rounded" />
      </div>

      {/* Price and stock */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-100 rounded" />
      </div>

      {/* Add to cart button */}
      <div className="h-9 w-full bg-gray-200 rounded" />
    </div>
  );
}
