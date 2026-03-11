import { createContext, type Dispatch } from "react";
import type { CartAction, CartItem } from "../types/cart";

export type AddToCartInput = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
};

export type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  cartItemCount: number;
  cartTotal: number;
  dispatch: Dispatch<CartAction>;
  addToCart: (product: AddToCartInput) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);
