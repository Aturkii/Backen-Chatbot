import Product from './../../../DB/models/product.model.js';
import { AppError } from './../../utils/AppError.js';
import { asyncHandler } from './../../middlewares/asyncHandler.js';


//* Get All Products
export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  if (products.length === 0) {
    return next(new AppError('No products found', 404));
  }
  res.status(200).json({
    message: "products retrived successfully!",
    products
  });
})

//* Get a single product by its Name
export const getProductByName = asyncHandler(async (req, res, next) => {
  const { productName } = req.query;
  if (!productName) {
    return next(new AppError('Product name is required to fetch the product.', 400));
  }

  const product = await Product.findOne({ productName });

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  res.status(200).json({
    message: 'Product retrieved successfully!',
    product,
  });
});

//* Add a new product
export const createProduct = asyncHandler(async (req, res, next) => {
  const { productName, quantity, price } = req.body;

  const existingProduct = await Product.findOne({ productName });
  if (existingProduct) {
    return next(new AppError('Product name already exists.', 400));
  }

  const product = await Product.create({
    productName,
    quantity,
    price,
  });

  res.status(201).json({
    message: 'Product added successfully!',
    product
  });
});

//* Update product data by the product name 
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { productName: queryProductName } = req.query;
  const { productName, quantity, price } = req.body;

  if (!queryProductName) {
    return next(new AppError('Product name is required to update the product.', 400));
  }

  const product = await Product.findOne({ productName: queryProductName });

  if (!product) {
    return next(new AppError('Product not found.', 404));
  }

  if (productName && productName !== product.productName) {
    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      return next(new AppError('Product name already exists. Please choose a different name.', 400));
    }
    product.productName = productName;
  }

  if (quantity !== undefined) product.quantity = quantity;
  if (price !== undefined) product.price = price;

  const updatedProduct = await product.save();

  res.status(200).json({
    message: 'Product updated successfully!',
    updatedProduct,
  });
});

//* Delete product by its name 
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { productName } = req.query;

  if (!productName) {
    return next(new AppError('Product name is required to delete the product.', 400));
  }

  const deletedProduct = await Product.findOneAndDelete({ productName });

  if (!deletedProduct) {
    return next(new AppError('Product not found.', 404));
  }

  res.status(200).json({
    message: `${productName} deleted successfully!`,
  });
});