const deviceService = require('../services/device.service');

exports.registerDevice = async (req, res, next) => {
  try {
    const device = await deviceService.registerDevice(req.body);
    res.status(201).json({ message: 'Device registered successfully', device });
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};

exports.getAllDevices = async (req, res, next) => {
  try {
    const devices = await deviceService.getAllDevices();
    res.status(200).json(devices);
  } catch (error) {
    next(error);
  }
};

exports.getDevice = async (req, res, next) => {
  try {
    const device = await deviceService.getDevice(req.params.deviceId);
    res.status(200).json(device);
  } catch (error) {
    next(error);
  }
}
