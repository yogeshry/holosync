const express = require('express');
const deviceRoutes = require('./device.routes');

const router = express.Router();

// Add route modules
router.use(deviceRoutes);

module.exports = router;
