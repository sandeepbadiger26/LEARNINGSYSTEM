const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

function generateAccessToken(payload) {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn
  });
}

function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwt.accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret);
}

function generateRefreshTokenExpiry() {
  const days = parseInt(env.jwt.refreshExpiresIn, 10) || 30;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateRefreshTokenExpiry
};
