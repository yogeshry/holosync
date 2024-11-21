exports.validateDevice = (req, res, next) => {
    const { deviceId, deviceName, screenWidth, screenHeight } = req.body;
  
    if (!deviceId || !deviceName || !screenWidth || !screenHeight) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    next(); // Proceed to the next middleware/controller
  };
  