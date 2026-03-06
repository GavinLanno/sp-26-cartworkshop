import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { cartReducer, initialCartState } from "../reducers/cartReducer";
import type { CartItem } from "../types/cart";

type AddToCartInput = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  addToCart: (product: AddToCartInput) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items: state.items,
      isOpen: state.isOpen,
      itemCount,
      addToCart: (product) =>
        dispatch({
          type: "ADD_TO_CART",
          payload: {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
          },
        }),
      removeFromCart: (productId) =>
        dispatch({
          type: "REMOVE_FROM_CART",
          payload: { productId },
        }),
      updateQuantity: (productId, quantity) =>
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { productId, quantity },
        }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    };
  }, [state.items, state.isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
