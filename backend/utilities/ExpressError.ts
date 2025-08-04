class ExpressError extends Error {
statusCode: number;

  constructor(message: string, statusCode: number) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    
       Object.setPrototypeOf(this, ExpressError.prototype);
  }
}

export default ExpressError;
