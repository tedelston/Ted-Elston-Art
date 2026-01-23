const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  const body = JSON.parse(event.body);
  const { invoice } = body;

  // Create the Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'klarna', 'afterpay_clearpay'], // Add methods here
    line_items: invoice.items.map(item => ({
      price_data: {
        currency: invoice.currency,
        product_data: {
          name: item.name,
          description: item.description
        },
        unit_amount: Math.round(item.amount * 100), // Stripe expects pence/cents
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.URL}/.netlify/functions/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&snipcartToken=${body.publicToken}`,
    cancel_url: invoice.shippingAddress ? body.returnUrl : "https://tedelston.com", // Fallback
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: session.url })
  };
};
