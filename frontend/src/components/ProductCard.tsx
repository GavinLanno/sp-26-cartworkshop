import { Link, useLocation } from "react-router-dom";
import type { ProductResponse } from "../types/product";
import { AddToCartButton } from "./AddToCartButton/AddToCartButton";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ProductResponse;
}

export default function ProductCard({ product }: ProductCardProps) {
  const location = useLocation();

  return (
    <article className={styles.card}>
      <Link
        to={`/products/${product.id}`}
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
        className={styles.linkArea}
      >
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
        <AddToCartButton
          product={{
            id: product.id,
            name: product.name ?? "Unnamed Product",
            price: product.price,
            imageUrl: product.imageUrl ?? undefined,
          }}
        />
      </div>
    </article>
  );
}
