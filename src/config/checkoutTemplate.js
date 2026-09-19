// The default INITIATE_CHECKOUT request, shared by the cart page and the
// settings page. There used to be three hand-written copies that had drifted
// apart. Plain ASCII only: the hosted page mis-renders some non-ASCII
// characters (U+00B7 shows as "A-circumflex, middle dot").

// Shown by the hosted page as a merchant footer.
export const MERCHANT_CONTACT = {
  email: 'support@example.com',
  phone: '+1 555 010 0199',
  address: { line1: '100 Example Street', line2: 'Suite 400', line3: 'St Louis, MO 63102', line4: 'United States' },
};

// Sample payer data for the read-only customer, billing and shipping boxes.
export const SAMPLE_CUSTOMER = {
  firstName: 'Sample',
  lastName: 'Payer',
  email: 'sample.payer@example.com',
  mobilePhone: '+1 5557891238',
};

export const SAMPLE_ADDRESS = {
  street: '11 N 4th St',
  street2: 'Apt 2B',
  city: 'St Louis',
  stateProvince: 'MO',
  postcodeZip: '63102',
  country: 'USA',
};

// order.amount, itemAmount, taxAmount and item are overwritten from the cart at
// checkout, so the values here only matter if the template is used on its own.
// ORDER_PLACEHOLDER is replaced everywhere it appears, so the description
// carries the real order id onto the hosted page.
export const defaultJsonPayload = (backendUrl) =>
  JSON.stringify(
    {
      apiOperation: 'INITIATE_CHECKOUT',
      checkoutMode: 'WEBSITE',
      interaction: {
        operation: 'PURCHASE',
        displayControl: { billingAddress: 'READ_ONLY', customerEmail: 'READ_ONLY', shipping: 'READ_ONLY' },
        merchant: { name: 'GJ Enterprises LLC', url: 'https://www.example.com', ...MERCHANT_CONTACT },
        locale: 'en_US',
        returnUrl: `${window.location.origin}/ReceiptPage`,
      },
      order: {
        currency: 'USD',
        amount: '99.00',
        id: 'ORDER_PLACEHOLDER',
        notificationUrl: `${backendUrl}/api/webhook`,
        description: 'Order ORDER_PLACEHOLDER - Goods and Services',
      },
      customer: SAMPLE_CUSTOMER,
      billing: { address: SAMPLE_ADDRESS },
      shipping: {
        contact: { firstName: SAMPLE_CUSTOMER.firstName, lastName: SAMPLE_CUSTOMER.lastName },
        address: SAMPLE_ADDRESS,
      },
    },
    null,
    2
  );
