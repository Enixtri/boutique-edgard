require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

app.post('/creer-session-paiement', async (req, res) => {
  try {
    const { nom, prix } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: nom,
            },
            unit_amount: Math.round(prix * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/succes.html',
      cancel_url: 'http://localhost:3000/index.html',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Serveur lancé sur http://localhost:3000');
});