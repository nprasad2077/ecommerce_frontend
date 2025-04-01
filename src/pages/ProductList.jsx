// src/pages/ProductList.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import PageWrapper from "../components/PageWrapper";
import ProductCard from "../components/ProductCard";
import { Search, Filter, ArrowLeft, ArrowRight, X } from "lucide-react";

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/products/categories/");
        setCategories(res.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when search params change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let url = `/products/?page=${page}`;
        if (searchTerm) url += `&keyword=${searchTerm}`;
        if (selectedCategory) url += `&category=${selectedCategory}`;

        const res = await API.get(url);
        setProducts(res.data.products);
        setPages(res.data.pages);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
      setIsLoading(false);
    };

    fetchProducts();
  }, [page, searchTerm, selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    updateSearchParams();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(1);
    setSearchParams({
      ...(searchTerm && { keyword: searchTerm }),
      ...(category && { category }),
    });
  };

  const updateSearchParams = () => {
    setSearchParams({
      ...(searchTerm && { keyword: searchTerm }),
      ...(selectedCategory && { category: selectedCategory }),
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSearchParams({});
    setPage(1);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header with search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">All Products</h1>

            <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-3 text-gray-500"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Category filters */}
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Active filters */}
          {(searchTerm || selectedCategory) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="bg-blue-50 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="bg-blue-50 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center">
                  Category: {selectedCategory}
                  <button
                    onClick={() => handleCategoryChange("")}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Product grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-gray-500">
              Loading products...
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-600">
              No products found. Try different search terms or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`p-2 rounded-md border ${
                page === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
              aria-label="Previous page"
            >
              <ArrowLeft size={18} />
            </button>

            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-md ${
                  i + 1 === page
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page === pages}
              className={`p-2 rounded-md border ${
                page === pages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
              aria-label="Next page"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}