import { Alert, Platform } from 'react-native';

const alertPolyfill = (title, description, options) => {
    const result = window.confirm([title, description].filter(Boolean).join('\n'));

    const option = options && options.find(({ style }) => 
        (result && style !== 'cancel') || (!result && style === 'cancel')
    );

    option && option.onPress();
};

const alert = Platform.OS === 'web' ? alertPolyfill : Alert.alert;

export default alert;
