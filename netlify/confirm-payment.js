const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event, context) {
  const { sessionId, snipcartToken } = event.queryStringParameters;

  // 1. Verify with Stripe that they actually paid
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== 'paid') {
    return { statusCode: 400, body: "Payment not verified" };
  }

  // 2. Tell Snipcart the payment is done
  await axios.post('https://payment.snipcart.com/api/private/custom-payment-gateway/payment', {
    paymentSessionId: snipcartToken,
    state: 'processed',
    transactionId: session.payment_intent,
  }, {
    headers: { Authorization: `Bearer ${process.env.SNIPCART_SECRET_API_KEY}` }
  });

  // 3. Redirect user to the "Thank You" page
  return {
    statusCode: 302,
    headers: { Location: "https://tedelston.com/gallery.html?payment=success" }
  };
};