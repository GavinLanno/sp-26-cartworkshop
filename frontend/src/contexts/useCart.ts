import { useContext } from "react";
import { CartContext } from "./cartContextCore";

export function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCartContext must be used within a CartProvider in the React component tree."
    );
  }

  return context;
}

export const useCart = useCartContext;
