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
  console.log("Received webhook request:", JSON.stringify(req.body, null, 2));

  try {
    const intentName = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;
    let fulfillmentText = '';

    switch (intentName) {
      case 'Add Product Intent':
        const { productName, quantity, price } = parameters;
        try {
          const addProductResponse = await axios.post(`${backendURL}/`, { productName, quantity, price });
          console.log("Making request to:", url);
          fulfillmentText = `Product "${productName}" added successfully with quantity ${quantity} and price ${price}.`;
        } catch (err) {
          console.error("Error while adding product:", err);
          fulfillmentText = "Error adding product. Please try again.";
        }
        break;

      case 'Get Product Intent':
        const { getProductName } = parameters;
        try {
          const productResponse = await axios.get(`${backendURL}/product`, { params: { productName: getProductName } });
          const product = productResponse.data;
          if (product) {
            fulfillmentText = `Product: "${product.productName}", Quantity: ${product.quantity}, Price: ${product.price}.`;
          } else {
            fulfillmentText = `No product found with the name "${getProductName}".`;
          }
        } catch (err) {
          console.error("Error while fetching product:", err);
          fulfillmentText = "Error fetching product. Please try again.";
        }
        break;

      case 'Update Product Intent':
        const { updateProductName, updateQuantity, updatePrice } = parameters;
        try {
          const updateResponse = await axios.put(`${backendURL}/`, null, {
            params: { productName: updateProductName },
            data: { quantity: updateQuantity, price: updatePrice }
          });
          fulfillmentText = `Product "${updateProductName}" updated successfully with new quantity ${updateQuantity} and price ${updatePrice}.`;
        } catch (err) {
          fulfillmentText = "Error updating product. Please try again.";
        }
        break;

      case 'Delete Product Intent':
        const { deleteProductName } = parameters;
        try {
          await axios.delete(`${backendURL}/`, { params: { productName: deleteProductName } });
          fulfillmentText = `Product "${deleteProductName}" deleted successfully.`;
        } catch (err) {
          fulfillmentText = "Error deleting product. Please try again.";
        }
        break;

      case 'Get All Products Intent':
        try {
          const allProductsResponse = await axios.get(`${backendURL}/`);
          const allProducts = allProductsResponse.data.products;
          if (allProducts.length > 0) {
            fulfillmentText = `Available products: ${allProducts.map(
              (product) => `"${product.productName}" (Qty: ${product.quantity}, Price: ${product.price})`
            ).join(', ')}.`;
          } else {
            fulfillmentText = "No products available in the system.";
          }
        } catch (err) {
          fulfillmentText = "Error fetching products. Please try again.";
        }
        break;

      default:
        fulfillmentText = `Sorry, I can't handle the intent: "${intentName}". Please try again.`;
    }

    res.json({ fulfillmentText });
  } catch (error) {
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