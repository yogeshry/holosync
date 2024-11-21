import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info'; // Works on native platforms
import { isMobile, isTablet, isDesktop } from 'react-device-detect'; // For web device detection
import axios from 'axios';


// Get the Device Type (Cross-platform)
export const getDeviceType = () => {
  if (Platform.OS === 'web') {
    if (isMobile) return 'Mobile';
    if (isTablet) return 'Tablet';
    if (isDesktop) return 'Desktop';
    return 'Unknown';
  }

  return DeviceInfo.getDeviceType(); // Native platforms
};

// Get the Device Name (Native only, fallback for Web)
export const getDeviceName = async () => {
  if (Platform.OS === 'web') {
    const userAgent = navigator.userAgent || 'Unknown';
    return `Browser (${userAgent})`; // Fallback to user agent
  }

  try {
    const deviceName = await DeviceInfo.getDeviceName();
    return deviceName;
  } catch (error) {
    console.error('Error getting device name:', error);
    return null;
  }
};

// Get Public IP Address (Useful for both Web and Native)
export const getPublicIp = async () => {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    return response.data.ip;
  } catch (error) {
    console.error('Error getting public IP address:', error);
    return null;
  }
};
