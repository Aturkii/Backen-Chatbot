import Joi from 'joi';

export const productSchema = Joi.object({
  productName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Product name must be a text value.',
      'string.empty': 'Product name is required.',
      'string.min': 'Product name must be at least 3 characters long.',
      'string.max': 'Product name must not exceed 50 characters.',
      'any.required': 'Product name is required.',
    }),

  quantity: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Quantity must be a number.',
      'number.integer': 'Quantity must be an integer.',
      'number.min': 'Quantity must be at least 0.',
      'any.required': 'Quantity is required.',
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'Price must be a number.',
      'number.positive': 'Price must be a positive number.',
      'number.precision': 'Price can have up to 2 decimal places.',
      'any.required': 'Price is required.',
    }),
});

export const updateProductSchema = Joi.object({
  productName: Joi.string()
    .min(3)
    .max(30)
    .messages({
      'string.base': 'Product name must be a text value.',
      'string.min': 'Product name must be at least 3 characters long.',
      'string.max': 'Product name must not exceed 50 characters.',
    }),

  quantity: Joi.number()
    .integer()
    .min(0)
    .messages({
      'number.base': 'Quantity must be a number.',
      'number.integer': 'Quantity must be an integer.',
      'number.min': 'Quantity must be at least 0.',
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .messages({
      'number.base': 'Price must be a number.',
      'number.positive': 'Price must be a positive number.',
      'number.precision': 'Price can have up to 2 decimal places.',
    }),
});

export const productName = Joi.object({
  productName: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Product name must be a text value.',
      'string.empty': 'Product name is required.',
      'string.min': 'Product name must be at least 3 characters long.',
      'string.max': 'Product name must not exceed 50 characters.',
      'any.required': 'Product name is required.',
    })
})