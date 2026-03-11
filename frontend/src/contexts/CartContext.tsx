import {
  type ReactNode,
  useMemo,
  useReducer,
} from "react";
import { cartReducer, initialCartState } from "../reducers/cartReducer";
import { CartContext, type CartContextType } from "./cartContextCore";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const value = useMemo<CartContextType>(() => {
    const cartItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      items: state.items,
      isOpen: state.isOpen,
      itemCount: cartItemCount,
      cartItemCount,
      cartTotal,
      dispatch,
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
