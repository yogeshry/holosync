const express = require('express');
const { getPenguinData } = require('../controllers/data.controller');
const { getPopulationData } = require('../controllers/data.controller');
const { getFlightData } = require('../services/data.service');

const router = express.Router();


router.get('/penguin', getPenguinData);
router.get('/flight', getFlightData);
router.get('/population', getPopulationData);
router.get('/scatterplot', (req, res) => {
    const { deviceId } = req.query;
    // Example scatterplot data
    const data = Array.from({ length: 50 }, () => ({
      x: Math.random() * 300,
      y: Math.random() * 300,
    }));
    res.json(data);
  });
  
module.exports = router;
