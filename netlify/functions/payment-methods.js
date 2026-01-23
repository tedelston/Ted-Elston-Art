exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", 
    },
    body: JSON.stringify([{
      id: "custom_stripe_checkout_final",
      name: "FINAL TEST (Click Me)",
      // FIX: Use a relative path to stop domain redirects
      checkoutUrl: "/.netlify/functions/create-session", 
      iconUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
    }])
  };
};
