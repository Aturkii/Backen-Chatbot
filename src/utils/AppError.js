//! Custom application Error Class with the error message and the error status code

export class AppError extends Error {
  constructor(message,statuScode){
    super(message)
    this.statusCode = statuScode;
  }
}