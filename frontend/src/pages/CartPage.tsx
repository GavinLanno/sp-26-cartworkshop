import { Link } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm/CheckoutForm";
import { useCartContext } from "../contexts/useCart";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const { items, cartTotal, dispatch } = useCartContext();

  const handleQuantityChange = (productId: number, nextQuantity: number) => {
    const clampedQuantity = Math.max(1, Math.min(99, nextQuantity));

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity: clampedQuantity },
    });
  };

  return (
    <section className={styles.page}>
      <h2 className={styles.heading}>Your Cart</h2>

      {items.length === 0 ? (
        <p className={styles.emptyMessage}>
          Your cart is empty.{" "}
          <Link to="/" className={styles.browseLink}>
            Browse products
          </Link>
          .
        </p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {items.map((item) => {
              const lineTotal = item.price * item.quantity;

              return (
                <li key={item.productId} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <h3 className={styles.productName}>{item.productName}</h3>
                    <p className={styles.price}>${item.price.toFixed(2)}</p>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.quantitySelector}>
                      <button
                        type="button"
                        className={styles.qtyButton}
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity === 1}
                        aria-label={`Decrease quantity for ${item.productName}`}
                      >
                        -
                      </button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button
                        type="button"
                        className={styles.qtyButton}
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        aria-label={`Increase quantity for ${item.productName}`}
                      >
                        +
                      </button>
                    </div>

                    <p className={styles.lineTotal}>Line total: ${lineTotal.toFixed(2)}</p>

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() =>
                        dispatch({
                          type: "REMOVE_FROM_CART",
                          payload: { productId: item.productId },
                        })
                      }
                      aria-label={`Remove ${item.productName} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={styles.footer}>
            <p className={styles.total}>Cart total: ${cartTotal.toFixed(2)}</p>
            <Link to="/" className={styles.checkoutButton} aria-label="Back to product catalog">
              Back to Catalog
            </Link>
          </div>
        </>
      )}

      <CheckoutForm />
    </section>
  );
}
