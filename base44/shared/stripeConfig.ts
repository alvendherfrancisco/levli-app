// Stripe price IDs for the Levli Premium product (PHP).
// Monthly: ₱125.00/month · Yearly: ₱509.00/year (7-day trial) · Lifetime: ₱1,010.00 one-time
export const PRICE_MAP = {
  monthly: "price_1TzbX7Q5PgCgpmBFgg8njxI7",
  yearly: "price_1TzbX7Q5PgCgpmBFNjXlnGzD",
  lifetime: "price_1TzbX7Q5PgCgpmBFbxFVgzXy",
};

export function planTypeForPrice(priceId) {
  for (const [plan, id] of Object.entries(PRICE_MAP)) {
    if (id === priceId) return plan;
  }
  return null;
}