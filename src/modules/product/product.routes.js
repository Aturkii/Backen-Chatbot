import { Router } from "express";
import * as prodcutController from "./product.controller.js";
import * as productValidation from "./product.validation.js";
import { validation } from './../../middlewares/validation.js';

const router = Router()

//^ Get all products
router.get('/',
  prodcutController.getAllProducts)

//^ Get Single Product by its Name
router.get('/product',
  prodcutController.getProductByName);

//^ Add Product
router.post('/',
  validation(productValidation.productSchema),
  prodcutController.createProduct)

//^ Update Product
router.put('/',
  validation(productValidation.productName, 'query'),
  validation(productValidation.updateProductSchema),
  prodcutController.updateProduct)

//^ Delete Product
router.delete('/',
  validation(productValidation.productName, 'query'),
  prodcutController.deleteProduct)

export default router;
