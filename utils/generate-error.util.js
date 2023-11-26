const createError = require('http-errors');

function generateError(error) {
  const status = error.status || error.statusCode || 500;
  
  return createError(status, error.message);
}

module.exports = generateError;
