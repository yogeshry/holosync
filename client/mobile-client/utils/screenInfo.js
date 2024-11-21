import { Dimensions, Platform } from 'react-native';

export const getScreenSize = () => {
    const { width, height } = Dimensions.get('window');
    return { width, height };
};
