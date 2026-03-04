function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const { method, url } = req;
  const userAgent = req.get('user-agent') || 'unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
  
  // Log response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}

module.exports = { requestLogger };
