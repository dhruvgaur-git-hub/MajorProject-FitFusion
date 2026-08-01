import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        const newQty = Math.min(existing.quantity + 1, item.availableStock ?? Infinity);
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: newQty, availableStock: item.availableStock }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (variantId) => {
    setCartItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId, delta) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId
          ? {
              ...i,
              quantity: Math.min(
                Math.max(1, i.quantity + delta),
                i.availableStock ?? Infinity
              ),
            }
          : i
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getSubtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}