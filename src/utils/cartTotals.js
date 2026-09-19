// One definition of the cart's money, used both to display the cart and to
// build the gateway order. Worked in integer cents so the numbers on screen are
// exactly the numbers charged, and the gateway's rule that itemAmount + tax
// equals the total can never be broken by float rounding.

export const TAX_RATE = 0.08;

const toCents = (dollars) => Math.round(dollars * 100);
export const toDollars = (cents) => (cents / 100).toFixed(2);

export function cartTotals(items) {
  const itemCents = items.reduce((n, i) => n + toCents(i.price) * i.quantity, 0);
  const taxCents = Math.round(itemCents * TAX_RATE);
  return { itemCents, taxCents, totalCents: itemCents + taxCents };
}

// The order fields the cart owns. Merged over whatever the JSON template says,
// so the charge always matches the cart.
export function cartOrderFields(items) {
  const { itemCents, taxCents, totalCents } = cartTotals(items);
  return {
    amount: toDollars(totalCents),
    itemAmount: toDollars(itemCents),
    taxAmount: toDollars(taxCents),
    item: items.map((i) => ({
      name: i.name,
      description: i.description,
      quantity: i.quantity,
      unitPrice: toDollars(toCents(i.price)),
    })),
  };
}
