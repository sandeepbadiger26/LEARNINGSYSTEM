const { validationResult } = require('express-validator');
const authService = require('./auth.service');
const { cookieOptions } = require('../../config/security');

class AuthController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation error', details: errors.array() });
      }

      const { email, password, name } = req.body;
      const result = await authService.register(email, password, name);

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, cookieOptions);

      res.status(201).json({
        user: result.user,
        accessToken: result.accessToken
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation error', details: errors.array() });
      }

      const { email, password } = req.body;
      const result = await authService.login(email, password);

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, cookieOptions);

      res.json({
        user: result.user,
        accessToken: result.accessToken
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const result = await authService.refresh(refreshToken);

      // Set new refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, cookieOptions);

      res.json({
        user: result.user,
        accessToken: result.accessToken
      });
    } catch (error) {
      // Clear cookie on refresh failure
      res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      await authService.logout(refreshToken);

      // Clear refresh token cookie
      res.clearCookie('refreshToken', { ...cookieOptions, maxAge: 0 });

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
