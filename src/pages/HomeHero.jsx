import React from "react";
import { ArrowRight, ShoppingBag, Truck, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import FeaturedProducts from "../components/FeaturedProducts";
import PageWrapper from "../components/PageWrapper";

export default function HomeHero() {
  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 sm:p-12">
              <div className="max-w-3xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Welcome to the Vibes Store!
                </h1>
                <p className="text-blue-100 text-lg mb-6">
                  Shop our wide selection of premium products at competitive
                  prices. From electronics to home essentials, we've got
                  everything you need.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/products"
                    className="flex items-center bg-white text-blue-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium"
                  >
                    Shop Now
                    <ShoppingBag size={18} className="ml-2" />
                  </Link>
                  <Link
                    to="/products"
                    className="flex items-center bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
                  >
                    Explore Categories
                    <ArrowRight size={18} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="hidden md:block absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500 opacity-20"></div>
            <div className="hidden md:block absolute -right-10 -bottom-20 w-60 h-60 rounded-full bg-blue-400 opacity-20"></div>
          </div>

          {/* Features Section */}
          <div className="bg-white py-6 px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Free Shipping
                  </h3>
                  <p className="text-sm text-gray-600">On orders over $100</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Secure Payment
                  </h3>
                  <p className="text-sm text-gray-600">
                    Safe & protected checkout
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Fast Delivery
                  </h3>
                  <p className="text-sm text-gray-600">2-3 business days</p>
                </div>
              </div>
            </div>
          </div>
          {/* Features Section */}
          <FeaturedProducts />
        </div>
      </div>
    </PageWrapper>
  );
}
