import { useCartContext } from "../../contexts/useCart";
import styles from "./CartBadge.module.css";

type CartBadgeProps = {
  onClick: () => void;
};

export function CartBadge({ onClick }: CartBadgeProps) {
  const { cartItemCount } = useCartContext();

  return (
    <button
      type="button"
      className={styles.cartButton}
      aria-label={`Shopping cart with ${cartItemCount} items`}
      onClick={onClick}
    >
      <span aria-hidden="true">Cart</span>
      {cartItemCount > 0 && <span className={styles.badge}>{cartItemCount}</span>}
    </button>
  );
}
