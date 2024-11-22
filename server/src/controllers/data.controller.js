const dataService = require('../services/data.service');

exports.getPenguinData = async (req, res, next) => {
    try {
      const penguins = await dataService.getPenguinData();
      res.status(200).json(penguins);
    } catch (error) {
      next(error);
    }
  }

exports.getFlightData = async (req, res, next) => {
    try {
      const flights = await dataService.getFlightData();
      res.status(200).json(flights);
    } catch (error) {
      next(error);
    }
  }

exports.getPopulationData = async (req, res, next) => {
    try {
      const flights = await dataService.getPopulationData();
      res.status(200).json(flights);
    } catch (error) {
      next(error);
    }
  }
