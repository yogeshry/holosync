const devices = []; // In-memory storage for simplicity

exports.registerDevice = async (deviceData) => {
  const { deviceId, deviceName, deviceType, screenWidth, screenHeight } = deviceData;

  // Check for duplicates
  if (devices.find((d) => d.deviceId === deviceId)) {
    throw new Error('Device already registered');
  }

  const newDevice = {
    deviceId,
    deviceName,
    deviceType,
    screenWidth,
    screenHeight,
    registeredAt: new Date(),
  };
  devices.push(newDevice);
  return newDevice;
};

exports.getAllDevices = async () => {
  return devices;
};

exports.getDevice = async (deviceId) => {
  return devices.find((d) => d.deviceId === deviceId);
}
