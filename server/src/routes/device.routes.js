const express = require('express');
const { registerDevice, getAllDevices, getDevice } = require('../controllers/device.controller');
const { validateDevice } = require('../middlewares/validation');

const router = express.Router();

// Device registration route
router.post('/register', validateDevice, registerDevice);

// Get all devices route
router.get('/', getAllDevices);

// Get device by ID route
router.get('/:deviceId', getDevice);

module.exports = router;
