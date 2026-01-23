exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", 
    },
    body: JSON.stringify([{
      id: "custom_stripe_checkout_absolute",
      name: "FINAL TEST (Absolute URL)",
      // FIX: Use the full Netlify address to ensure Snipcart trusts it
      checkoutUrl: "https://tedelston.netlify.app/.netlify/functions/create-session", 
      iconUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
    }])
  };
};
