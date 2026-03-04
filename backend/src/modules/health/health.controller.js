const db = require('../../config/db');

class HealthController {
  async check(req, res, next) {
    try {
      // Check database connection
      await db.raw('SELECT 1');
      
      res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
      res.status(503).json({ status: 'error', database: 'disconnected' });
    }
  }
}

module.exports = new HealthController();
