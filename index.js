import express from 'express'
import { connectDB } from './DB/dbConnection.js'
import routers from './src/modules/product/product.routes.js';
import cors from 'cors';
import axios from 'axios';
const app = express()
const port = process.env.PORT || 3000
const backendURL = process.env.BACKEND_URL || 'http://localhost:3000';

app.use(cors());

app.use(express.json())

connectDB()

app.use("/", routers)

app.post('/webhook', async (req, res) => {
  try {
    const intentName = req.body.queryResult.intent.displayName;
    let fulfillmentText = '';

    if (intentName === 'Get Products Intent') {
      try {
        const response = await axios.get(`${backendURL}`);
        const products = response.data;
        if (products && products.length > 0) {
          const productList = products.map(
            (product) => `"${product.name}" (Qty: ${product.quantity}, Price: ${product.price})`
          ).join(', ');

          fulfillmentText = `Here are the available products in stock: ${productList}`;
        } else {
          fulfillmentText = "There are no products available in stock right now.";
        }

      } catch (error) {
        console.error("Error fetching products:", error);
        fulfillmentText = "Sorry, I couldn't fetch the product list at the moment. Please try again later.";
      }
    } else {
      fulfillmentText = `Sorry, I can't handle the intent: "${intentName}". Please try again.`;
    }

    return res.json({
      fulfillmentText: fulfillmentText
    });

  } catch (error) {
    console.error("Error processing webhook request:", error);
    res.status(500).json({
      fulfillmentText: 'Something went wrong. Please try again later.',
      error: error.message,
    });
  }
});










app.use("*", (req, res, next) => {
  res.status(404).json({
    message: "Invalid requests"
  })
})


app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ message: err.message })
})

app.listen(port, () => console.log(`chatbot listening on port ${port}!`))