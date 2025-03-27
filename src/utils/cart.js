export const addToCart = (product, qty = 1) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    const exists = cart.find((item) => item.product === product._id);
  
    let updatedCart;
    if (exists) {
      updatedCart = cart.map((item) =>
        item.product === product._id ? { ...item, qty: item.qty + qty } : item
      );
    } else {
      updatedCart = [...cart, {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty
      }];
    }
  
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };
  