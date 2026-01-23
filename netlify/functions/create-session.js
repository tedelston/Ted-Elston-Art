const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  // --- SAFETY SHIELD START ---
  // If the request is not a POST (e.g. a browser test) or has no body, ignore it.
  if (event.httpMethod !== "POST" || !event.body) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "OK"
    };
  }
  // --- SAFETY SHIELD END ---

  try {
    const body = JSON.parse(event.body);
    const { invoice } = body;

    // Validate that we actually have an invoice to process
    if (!invoice || !invoice.items) {
        console.error("Missing invoice data in request");
        return { statusCode: 400, body: JSON.stringify({ error: "Missing invoice data" }) };
    }

    // Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna', 'afterpay_clearpay'], 
      line_items: invoice.items.map(item => ({
        price_data: {
          currency: invoice.currency,
          product_data: {
            name: item.name,
            description: item.description || item.name // Fallback if description is missing
          },
          unit_amount: Math.round(item.amount * 100), 
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.URL}/.netlify/functions/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&snipcartToken=${body.publicToken}`,
      cancel_url: invoice.shippingAddress ? body.returnUrl : "https://tedelston.com",
    });

    return {
      statusCode: 200,
      headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" // Allow Snipcart to read the response
      },
      body: JSON.stringify({ url: session.url })
    };

  } catch (error) {
    // Log the actual error so we can see it in Netlify logs
    console.error("Stripe Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
