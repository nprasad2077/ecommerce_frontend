import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        MyStore
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/cart" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </Link>

        {user ? (
          <>
            <span className="text-sm text-gray-600">{user.name}</span>
            <Link
              to="/myorders"
              className="text-sm text-gray-700 hover:underline"
            >
              My Orders
            </Link>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/"
            className="flex items-center gap-1 text-gray-700 hover:text-black"
          >
            <User className="w-5 h-5" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
}
