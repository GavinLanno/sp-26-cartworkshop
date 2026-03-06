import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import type { ProductResponse } from "../types/product";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name ?? "Unnamed Product",
      price: product.price,
      imageUrl: product.imageUrl ?? undefined,
    });
    toggleCart();
  };

  return (
    <article className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.linkArea}>
        <div className={styles.imageWrapper}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name ?? "Product"}
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholder}>
              <span>BOX</span>
            </div>
          )}
        </div>
        <div className={styles.body}>
          <span className={styles.category}>{product.categoryName}</span>
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.price}>${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <div className={styles.actions}>
        <button type="button" className={styles.addButton} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </article>
  );
}

