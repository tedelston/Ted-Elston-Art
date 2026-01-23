const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  // Setup headers so Snipcart can read the response (CORS)
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // 1. Handle the "Can I talk to you?" check (OPTIONS request)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Handshake received." })
    };
  }

  try {
    // 2. Decode the Body (Fixes "Unexpected end of JSON" and "OK" errors)
    // Sometimes Netlify encodes the message in Base64. We must decode it.
    const rawBody = event.isBase64Encoded 
       ? Buffer.from(event.body, 'base64').toString('utf8') 
       : event.body;

    if (!rawBody) {
       // If data is TRULY missing, tell us why instead of just saying "OK"
       console.error("Empty Body received. Method:", event.httpMethod);
       return { 
         statusCode: 400, 
         headers, 
         body: JSON.stringify({ error: "Request body is empty", method: event.httpMethod }) 
       };
    }

    const body = JSON.parse(rawBody);
    const { invoice } = body;

    // 3. Create the Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna', 'afterpay_clearpay'],
      line_items: invoice.items.map(item => ({
        price_data: {
          currency: invoice.currency,
          product_data: {
            name: item.name,
            description: item.description || item.name
          },
          unit_amount: Math.round(item.amount * 100), 
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `https://tedelston.netlify.app/.netlify/functions/confirm-payment?sessionId={CHECKOUT_SESSION_ID}&snipcartToken=${body.publicToken}`,
      cancel_url: invoice.shippingAddress ? body.returnUrl : "https://tedelston.com",
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url })
    };

  } catch (error) {
    console.error("Stripe Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

