const { verifyAccessToken } = require('../utils/jwt');
const db = require('../config/db');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const token = authHeader.substring(7);
    
    try {
      const decoded = verifyAccessToken(token);
      
      // Verify user still exists
      const user = await db('users').where('id', decoded.userId).first();
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name
      };
      
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { authMiddleware };
