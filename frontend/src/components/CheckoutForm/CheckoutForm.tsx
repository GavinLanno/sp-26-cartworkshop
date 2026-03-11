import { useState, type FormEvent } from "react";
import { useCartContext } from "../../contexts/useCart";
import styles from "./CheckoutForm.module.css";

type FormData = {
  fullName: string;
  email: string;
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
};

type FieldName = keyof FormData;
type FormErrors = Partial<Record<FieldName, string>>;

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const INITIAL_FORM_DATA: FormData = {
  fullName: "",
  email: "",
  shippingAddress: "",
  city: "",
  state: "",
  zipCode: "",
};

function validateForm(formData: FormData): FormErrors {
  const nextErrors: FormErrors = {};

  if (formData.fullName.trim().length < 2) {
    nextErrors.fullName = "Full Name must be at least 2 characters.";
  }

  if (!formData.email.trim() || !formData.email.includes("@")) {
    nextErrors.email = "Enter a valid email address with @.";
  }

  if (formData.shippingAddress.trim().length < 5) {
    nextErrors.shippingAddress = "Shipping Address must be at least 5 characters.";
  }

  if (!formData.city.trim()) {
    nextErrors.city = "City is required.";
  }

  if (!formData.state.trim()) {
    nextErrors.state = "State is required.";
  }

  if (!/^\d{5}$/.test(formData.zipCode.trim())) {
    nextErrors.zipCode = "Zip Code must be exactly 5 digits.";
  }

  return nextErrors;
}

export default function CheckoutForm() {
  const { cartTotal, cartItemCount, dispatch } = useCartContext();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<FieldName>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const updateField = (field: FieldName, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: FieldName) => {
    setTouched((prev) => new Set(prev).add(field));

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);
  };

  const getFieldError = (field: FieldName) => {
    if (!touched.has(field)) {
      return "";
    }

    return errors[field] ?? "";
  };

  const touchAllFields = () => {
    setTouched(new Set<FieldName>(Object.keys(formData) as FieldName[]));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateForm(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      touchAllFields();
      return;
    }

    setSuccessMessage("");
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      dispatch({ type: "CLEAR_CART" });
      setFormData(INITIAL_FORM_DATA);
      setTouched(new Set());
      setErrors({});
      setSuccessMessage("Order placed successfully. Thank you for shopping Buckeye Marketplace.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isSubmitDisabled = cartItemCount === 0 || isProcessing;

  return (
    <section id="checkout-form" className={styles.checkoutSection} aria-labelledby="checkout-heading">
      <h3 id="checkout-heading" className={styles.heading}>
        Checkout
      </h3>
      <p className={styles.summary}>
        Items: {cartItemCount} | Total: ${cartTotal.toFixed(2)}
      </p>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="fullName" className={styles.label}>
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            onBlur={() => handleBlur("fullName")}
            required
            minLength={2}
            aria-invalid={Boolean(getFieldError("fullName"))}
            aria-describedby={getFieldError("fullName") ? "fullName-error" : undefined}
            className={styles.input}
          />
          {getFieldError("fullName") && (
            <p id="fullName-error" className={styles.error} role="alert">
              {getFieldError("fullName")}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            onBlur={() => handleBlur("email")}
            required
            aria-invalid={Boolean(getFieldError("email"))}
            aria-describedby={getFieldError("email") ? "email-error" : undefined}
            className={styles.input}
          />
          {getFieldError("email") && (
            <p id="email-error" className={styles.error} role="alert">
              {getFieldError("email")}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="shippingAddress" className={styles.label}>
            Shipping Address
          </label>
          <input
            id="shippingAddress"
            name="shippingAddress"
            type="text"
            value={formData.shippingAddress}
            onChange={(event) => updateField("shippingAddress", event.target.value)}
            onBlur={() => handleBlur("shippingAddress")}
            required
            minLength={5}
            aria-invalid={Boolean(getFieldError("shippingAddress"))}
            aria-describedby={getFieldError("shippingAddress") ? "shippingAddress-error" : undefined}
            className={styles.input}
          />
          {getFieldError("shippingAddress") && (
            <p id="shippingAddress-error" className={styles.error} role="alert">
              {getFieldError("shippingAddress")}
            </p>
          )}
        </div>

        <div className={styles.inlineFields}>
          <div className={styles.field}>
            <label htmlFor="city" className={styles.label}>
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={(event) => updateField("city", event.target.value)}
              onBlur={() => handleBlur("city")}
              required
              aria-invalid={Boolean(getFieldError("city"))}
              aria-describedby={getFieldError("city") ? "city-error" : undefined}
              className={styles.input}
            />
            {getFieldError("city") && (
              <p id="city-error" className={styles.error} role="alert">
                {getFieldError("city")}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="state" className={styles.label}>
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={(event) => updateField("state", event.target.value)}
              onBlur={() => handleBlur("state")}
              required
              aria-invalid={Boolean(getFieldError("state"))}
              aria-describedby={getFieldError("state") ? "state-error" : undefined}
              className={styles.input}
            >
              <option value="">Select a state</option>
              {US_STATES.map((stateCode) => (
                <option key={stateCode} value={stateCode}>
                  {stateCode}
                </option>
              ))}
            </select>
            {getFieldError("state") && (
              <p id="state-error" className={styles.error} role="alert">
                {getFieldError("state")}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="zipCode" className={styles.label}>
              Zip Code
            </label>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={formData.zipCode}
              onChange={(event) => updateField("zipCode", event.target.value)}
              onBlur={() => handleBlur("zipCode")}
              required
              pattern="\d{5}"
              aria-invalid={Boolean(getFieldError("zipCode"))}
              aria-describedby={getFieldError("zipCode") ? "zipCode-error" : undefined}
              className={styles.input}
            />
            {getFieldError("zipCode") && (
              <p id="zipCode-error" className={styles.error} role="alert">
                {getFieldError("zipCode")}
              </p>
            )}
          </div>
        </div>

        <button type="submit" className={styles.submitButton} disabled={isSubmitDisabled}>
          {isProcessing ? "Processing..." : "Place Order"}
        </button>

        {successMessage && (
          <p className={styles.successMessage} role="status" aria-live="polite">
            {successMessage}
          </p>
        )}
      </form>
    </section>
  );
}
