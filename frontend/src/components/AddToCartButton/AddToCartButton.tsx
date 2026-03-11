import { useEffect, useRef, useState } from "react";
import { useCartContext } from "../../contexts/useCart";
import styles from "./AddToCartButton.module.css";

type AddToCartButtonProduct = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
};

type AddToCartButtonProps = {
  product: AddToCartButtonProduct;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { dispatch } = useCartContext();
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
    });

    setAdded(true);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setAdded(false);
      timeoutRef.current = null;
    }, 1500);
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${added ? styles.buttonAdded : ""}`.trim()}
      aria-label={`Add ${product.name} to cart`}
      onClick={handleClick}
    >
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}
