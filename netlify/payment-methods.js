exports.handler = async function(event, context) {
  // Security: Only allow requests from Snipcart (Optional but recommended)
  // For now, we return the button immediately
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify([{
      id: "stripe_checkout",
      name: "Pay with Card, Klarna, or Apple Pay",
      checkoutUrl: process.env.URL + "/.netlify/functions/create-session",
      iconUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
    }])
  };
};