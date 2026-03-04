function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  // Handle validation errors from express-validator
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.array()
    });
  }
  
  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
  }
  
  // Handle database errors
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'Duplicate entry' });
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({ error: 'Referenced record not found' });
  }
  
  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

module.exports = { errorHandler };
