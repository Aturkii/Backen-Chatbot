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
  try {
    if (intentName === 'Get Products Intent') {
      const { data } = await axios.get(backendURL);
      const products = data;

      if (products.length !== 0) {
        return res.status(200).json({
          fulfillmentText: `Here are the available products in stock.`,
          ...products
        });
      } else {
        return res.status(404).json({
          fulfillmentText: "There are no products available in stock right now."
        });
      }
    }
  }
  catch (err) {
    return res.status(500).json({ message: "Error", err });
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