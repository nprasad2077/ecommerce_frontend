import React, { useEffect, useState } from "react";
import { getImageUrl } from "../utils/media";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  const updateQty = (id, qty) => {
    const updated = cart.map((item) =>
      item.product === id ? { ...item, qty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const filtered = cart.filter((item) => item.product !== id);
    setCart(filtered);
    localStorage.setItem("cart", JSON.stringify(filtered));
  };

  const total = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.product}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">${item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) => updateQty(item.product, Number(e.target.value))}
                  className="w-16 border rounded px-2 py-1"
                />
                <button
                  className="text-red-500 hover:underline text-sm"
                  onClick={() => removeItem(item.product)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right mt-6 font-semibold text-lg">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
