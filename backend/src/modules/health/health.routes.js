const express = require('express');
const router = express.Router();
const healthController = require('./health.controller');

router.get('/', healthController.check);

module.exports = router;
