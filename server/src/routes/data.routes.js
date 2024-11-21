const express = require('express');
const { getPenguinData } = require('../controllers/data.controller');
const { getFlightData } = require('../services/data.service');

const router = express.Router();


router.get('/penguin', getPenguinData);
router.get('/flight', getFlightData);


module.exports = router;
