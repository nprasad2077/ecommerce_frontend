import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";
import { Search, Filter, ArrowLeft, ArrowRight } from "lucide-react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    API.get(`/products/?page=${page}&search=${searchTerm}`)
      .then((res) => {
        setProducts(res.data.products);
        setPages(res.data.pages);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setIsLoading(false);
      });
  }, [page, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setPage(1);
  };

  return (
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
            <button 
              type="button" 
              className="ml-2 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center"
            >
              <Filter size={16} className="mr-1" />
              <span>Filter</span>
            </button>
          </form>
        </div>
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-gray-500">Loading products...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-600">No products found. Try a different search term.</p>
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
              page === 1 ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
            aria-label="Previous page"
          >
            <ArrowLeft size={18} />
          </button>
          
          {/* Page numbers */}
          {[...Array(pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-md ${
                i + 1 === page 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => setPage(Math.min(pages, page + 1))}
            disabled={page === pages}
            className={`p-2 rounded-md border ${
              page === pages ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
            aria-label="Next page"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}