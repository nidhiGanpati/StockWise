const dotenv = require("dotenv");
dotenv.config();

const Stripe = require("stripe");
const Portfolio = require("../models/portfolioModel");

// ✅ read key AFTER dotenv.config()
const stripeKey = process.env.STRIPE_SECRET_KEY;

// ✅ only initialize stripe if key exists
const stripe = stripeKey ? Stripe(stripeKey) : null;

if (!stripe) {
  console.warn("⚠️ STRIPE_SECRET_KEY missing. Payments are disabled.");
}

exports.createPaymentIntent = async (req, res) => {
  const { userId, amount } = req.body;

  // ✅ prevent crash / return clean message
  if (!stripe) {
    return res.status(503).json({
      error: "Payments are disabled. STRIPE_SECRET_KEY is missing in backend .env",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { userId },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("[Stripe Error]", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.paymentSuccess = async (req, res) => {
  const { userId, amount } = req.body;

  try {
    const portfolio = await Portfolio.findOne({ userId });

    if (!portfolio) {
      return res.status(404).json({ error: "Portfolio not found" });
    }

    // amount expected in cents -> convert to dollars
    portfolio.wallet += amount / 100;
    await portfolio.save();

    res.send({ success: true, newBalance: portfolio.wallet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
