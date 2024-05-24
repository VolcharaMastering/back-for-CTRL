/**
* @module Middleware
* @file errorHandler middleware. Middleware function to handle errors.
* @exports errorHandler
*/
const errorHandler = (err, req, res, next) => {
  const { code = 500, message } = err;

  res.status(code).send({
    message: code === 500 ? 'Server error' : message,
  });

  next();
};

export default errorHandler;
