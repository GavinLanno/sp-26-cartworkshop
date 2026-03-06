import { Link, Outlet } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import styles from "./Layout.module.css";

export default function Layout() {
  const { items, isOpen, itemCount, removeFromCart, updateQuantity, clearCart, toggleCart } =
    useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>BM</span>
            <h1 className={styles.title}>Buckeye Marketplace</h1>
          </Link>

          <button type="button" className={styles.cartButton} onClick={toggleCart}>
            Cart ({itemCount})
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>

      <aside className={`${styles.cartSidebar} ${isOpen ? styles.cartSidebarOpen : ""}`}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>Your Cart</h2>
          <button type="button" className={styles.textButton} onClick={toggleCart}>
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <p className={styles.emptyState}>Your cart is empty.</p>
        ) : (
          <>
            <ul className={styles.cartList}>
              {items.map((item) => (
                <li key={item.productId} className={styles.cartItem}>
                  <div>
                    <p className={styles.cartItemName}>{item.productName}</p>
                    <p className={styles.cartItemPrice}>${item.price.toFixed(2)}</p>
                  </div>

                  <div className={styles.cartControls}>
                    <button
                      type="button"
                      className={styles.qtyButton}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button
                      type="button"
                      className={styles.qtyButton}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className={styles.textButton}
                      onClick={() => removeFromCart(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.cartFooter}>
              <p className={styles.total}>Total: ${total.toFixed(2)}</p>
              <button type="button" className={styles.clearButton} onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

