import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const updateFavorites = (updatedFavorites) => {
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const toggleFavorite = (product) => {
    const isFavorited = favorites.some(item => item._id === product._id);
    let updated;
    
    if (isFavorited) {
      updated = favorites.filter(item => item._id !== product._id);
    } else {
      updated = [...favorites, {
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price
      }];
    }
    
    updateFavorites(updated);
    return !isFavorited; // Return whether item was added (true) or removed (false)
  };

  const isFavorite = (productId) => {
    return favorites.some(item => item._id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};