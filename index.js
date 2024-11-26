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

app.use("/products", routers)







app.post('/webhook', async (req, res, next) => {
  console.log("Received webhook request:", JSON.stringify(req.body, null, 2));  // Log the incoming request to debug

  try {
    const intent = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;
    let fulfillmentText = '';

    switch (intent) {
      case 'Add Product intent':
        const { productName, quantity, price } = parameters;
        try {
          const addProductResponse = await axios.post(`${backendURL}/products`, { productName, quantity, price });
          fulfillmentText = `Product ${productName} added successfully with quantity ${quantity} and price ${price}.`;
        } catch (err) {
          console.error("Error while adding product:", err);
          fulfillmentText = "Error adding product.";
        }
        break;

      case 'Get Product Intent':
        const { getProductName } = parameters;
        try {
          const productResponse = await axios.get(`${backendURL}/products/product`, { params: { productName: getProductName } });
          const product = productResponse.data;
          fulfillmentText = `Product: ${product.productName}, Quantity: ${product.quantity}, Price: ${product.price}.`;
        } catch (err) {
          console.error("Error while getting product:", err); 
          fulfillmentText = "Error fetching product.";
        }
        break;

      case 'Update Product Intent':
        const { updateProductName, updateQuantity, updatePrice } = parameters;
        try {
          await axios.put(`${backendURL}/products`, null, {
            params: { productName: updateProductName },
            data: { quantity: updateQuantity, price: updatePrice }
          });
          fulfillmentText = `Product ${updateProductName} updated successfully.`;
        } catch (err) {
          console.error("Error while updating product:", err);  
          fulfillmentText = "Error updating product.";
        }
        break;

      case 'Delete Product Intent':
        const { deleteProductName } = parameters;
        try {
          await axios.delete(`${backendURL}/products`, { params: { productName: deleteProductName } });
          fulfillmentText = `Product ${deleteProductName} deleted successfully.`;
        } catch (err) {
          console.error("Error while deleting product:", err);
          fulfillmentText = "Error deleting product.";
        }
        break;

      case 'Get All Products Intent':
        try {
          const allProductsResponse = await axios.get(`${backendURL}/products`);
          const allProducts = allProductsResponse.data.products;
          fulfillmentText = `Available products: ${allProducts.map(
            (product) => `${product.productName} (Qty: ${product.quantity}, Price: ${product.price})`
          ).join(', ')}.`;
        } catch (err) {
          console.error("Error while fetching all products:", err);  
          fulfillmentText = "Error fetching products.";
        }
        break;

      default:
        fulfillmentText = `Sorry, I can't handle the intent: ${intent}.`;
    }

    res.json({ fulfillmentText });
  } catch (error) {
    console.error('Webhook error:', error); 
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


// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({ message: err.message })
// })

app.listen(port, () => console.log(`chatbot listening on port ${port}!`))
