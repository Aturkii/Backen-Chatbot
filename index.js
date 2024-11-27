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

  const intentName = req.body.queryResult.intent.displayName;

  if (intentName === 'Get Products Intent') {
    const response = await axios.get(backendURL);
    const products = response.data;

    if (products && products.length > 0) {
      const productsList = products.map(product =>
        `${product.name} (Qty: ${product.quantity}, Price: ${product.price})`
      ).join(', ');
      return res.json({
        fulfillmentText: `Here are the available products in stock: ${productsList}`
      });
    } else {
      return res.json({
        fulfillmentText: "There are no products available in stock right now."
      });
    }
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