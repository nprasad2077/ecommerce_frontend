import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/products" className="text-xl font-bold">
        MyStore
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/cart" className="flex items-center gap-1 text-gray-700 hover:text-black">
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
        </Link>

        {user ? (
          <>
            <span className="text-sm text-gray-600">{user.name}</span>
            <button
              onClick={logout}
              className="text-sm text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-black">
            <User className="w-5 h-5" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
}
