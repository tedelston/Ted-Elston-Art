exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // Allow Snipcart to read this
    },
    body: JSON.stringify([{
      id: "custom_stripe_checkout",
      name: "Secure Checkout (Card, Apple Pay, Klarna)",
      // IMPORTANT: We are hardcoding the full address to force a proper connection
      checkoutUrl: "https://tedelston.netlify.app/.netlify/functions/create-session",
      iconUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
    }])
  };
};
