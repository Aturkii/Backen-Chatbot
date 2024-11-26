import express from 'express'
import { connectDB } from './DB/dbConnection.js'
import routers from './src/modules/product/product.routes.js';
import { AppError } from './src/utils/AppError.js';
import cors from 'cors';
import axios from 'axios';
const app = express()
const port = process.env.PORT || 3000
const backendURL = process.env.BACKEND_URL || 'http://localhost:3000';

app.use(cors());

app.use(express.json())

connectDB()

app.use("/products", routers)

app.post('/webhook', async (req, res, next) => {
  try {
    const intentName = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;
    let fulfillmentText = '';

    switch (intentName) {
      case 'Add Product Intent':
        const { productName, quantity, price } = parameters;

        await axios.post(`${backendURL}/`, { productName, quantity, price });

        fulfillmentText = `Product ${productName} added successfully with quantity ${quantity} and price ${price}.`;
        break;

      case 'Get Product Intent':
        const { getProductName } = parameters;

        const productResponse = await axios.get(`${backendURL}/product`, {
          params: { productName: getProductName }
        });

        const product = productResponse.data;
        fulfillmentText = `Product: ${product.productName}, Quantity: ${product.quantity}, Price: ${product.price}.`;
        break;

      case 'Update Product Intent':
        const { updateProductName, updateQuantity, updatePrice } = parameters;

        await axios.put(`${backendURL}/`, null, {
          params: { productName: updateProductName },
          data: { quantity: updateQuantity, price: updatePrice }
        });

        fulfillmentText = `Product ${updateProductName} updated successfully.`;
        break;

      case 'Delete Product Intent':
        const { deleteProductName } = parameters;

        await axios.delete(`${backendURL}/`, {
          params: { productName: deleteProductName }
        });

        fulfillmentText = `Product ${deleteProductName} deleted successfully.`;
        break;

      case 'Get All Products Intent':
        const allProductsResponse = await axios.get(`${backendURL}/`);
        const allProducts = allProductsResponse.data.products;

        fulfillmentText = `Available products: ${allProducts.map(
          (product) => `${product.productName} (Qty: ${product.quantity}, Price: ${product.price})`
        ).join(', ')}.`;
        break;

      default:
        fulfillmentText = `Sorry, I can't handle the intent: ${intentName}.`;
    }

    res.json({ fulfillmentText });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ fulfillmentText: 'Something went wrong. Please try again later.' });
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
