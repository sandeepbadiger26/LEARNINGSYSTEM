const env = require('./env');

const cookieOptions = {
  httpOnly: true,
  secure: env.cookie.secure,
  sameSite: env.cookie.sameSite,
  domain: env.cookie.domain,
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
};

const corsOptions = {
  origin: env.cors.origin,
  credentials: env.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = {
  cookieOptions,
  corsOptions
};
