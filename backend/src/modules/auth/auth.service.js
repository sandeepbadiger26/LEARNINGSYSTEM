const crypto = require('crypto');
const db = require('../../config/db');
const { hashPassword, comparePassword } = require('../../utils/password');
const { generateAccessToken, generateRefreshToken, generateRefreshTokenExpiry } = require('../../utils/jwt');

class AuthService {
  async register(email, password, name) {
    // Check if user already exists
    const existingUser = await db('users').where('email', email).first();
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const [userId] = await db('users').insert({
      email,
      password_hash: passwordHash,
      name
    });

    // Generate tokens
    const tokens = await this.generateTokens(userId, email, name);

    return {
      user: {
        id: userId,
        email,
        name
      },
      ...tokens
    };
  }

  async login(email, password) {
    // Find user
    const user = await db('users').where('email', email).first();
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password_hash);
    if (!isValidPassword) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.name);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      ...tokens
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      const error = new Error('Refresh token required');
      error.statusCode = 401;
      throw error;
    }

    // Hash the token for lookup
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Find valid refresh token in database
    const tokenRecord = await db('refresh_tokens')
      .where({
        token_hash: tokenHash,
        revoked_at: null
      })
      .where('expires_at', '>', new Date())
      .first();

    if (!tokenRecord) {
      const error = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }

    // Get user
    const user = await db('users').where('id', tokenRecord.user_id).first();
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    // Revoke old refresh token
    await db('refresh_tokens')
      .where('id', tokenRecord.id)
      .update({ revoked_at: new Date() });

    // Generate new tokens
    const tokens = await this.generateTokens(user.id, user.email, user.name);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      ...tokens
    };
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }

    // Hash the token for lookup
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Revoke the token
    await db('refresh_tokens')
      .where({ token_hash: tokenHash })
      .update({ revoked_at: new Date() });
  }

  async generateTokens(userId, email, name) {
    // Generate access token
    const accessToken = generateAccessToken({
      userId,
      email,
      name
    });

    // Generate refresh token
    const refreshToken = generateRefreshToken();
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Store refresh token in database
    await db('refresh_tokens').insert({
      user_id: userId,
      token_hash: tokenHash,
      expires_at: generateRefreshTokenExpiry()
    });

    return {
      accessToken,
      refreshToken
    };
  }
}

module.exports = new AuthService();
