import React from "react";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-6">
          <Search className="w-12 h-12 text-blue-600" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center bg-gray-100 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
