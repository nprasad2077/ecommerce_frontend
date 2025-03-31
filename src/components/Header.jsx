import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-gray-800">
        Vibe Store
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/cart"
          className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            {user.isAdmin && (
              <Link
                to="/admin"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Admin
              </Link>
            )}

            <Link
              to="/myorders"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              My Orders
            </Link>

            <Link
              to="/profile"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Profile
            </Link>

            <button
              onClick={logout}
              className="text-sm text-red-500 hover:text-red-600 transition-colors font-medium cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors px-4 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
          >
            <User className="w-4 h-4" />
            <span className="font-medium">Login</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </header>
  );
}
