import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const updateCart = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const addItem = (product, qty = 1) => {
    const exists = cart.find((item) => item.product === product._id);
    let updated;

    if (exists) {
      updated = cart.map((item) =>
        item.product === product._id
          ? { ...item, qty: item.qty + qty }
          : item
      );
    } else {
      updated = [...cart, {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
      }];
    }

    updateCart(updated);
  };

  const value = { cart, updateCart, addItem };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
