//? Validatoin Middleware to handle all validation errors and what data to validate

import { AppError } from './../utils/AppError.js';

const dataMethod = ["body", "query", "header", "params", "file", "files"];

export const validation = (schema, source = 'body') => {
  return (req, res, next) => {
    if (!dataMethod.includes(source)) {
      return next(new AppError(`Invalid data location: ${source}`, 400));
    }
    const data = req[source];

    const { error } = schema.validate(data, { abortEarly: false });
    
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(' ,  ');
      return next(new AppError(errorMessage, 400));
    }
    next();
  };
};