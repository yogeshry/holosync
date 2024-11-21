import { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView, Text, View, TextInput, Button } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import { getDeviceType, getDeviceName, getPublicIp } from '../utils/deviceInfo';
import { getScreenSize } from '../utils/screenInfo';
import alert from '../components/Notifications/alert';
import { useRouter } from 'expo-router';

const fetchDeviceInfo = async (setDeviceData) => {
    const name = await getDeviceName();
    const type = await getDeviceType();
    const publicIp = await getPublicIp();
    const { width, height } = getScreenSize();

    setDeviceData({
        deviceId: publicIp,
        deviceName: name,
        deviceType: type,
        screenWidth: width.toString(),
        screenHeight: height.toString()
    });
};

const HomeScreen = ({ navigation }) => {
    const router = useRouter();
    const [deviceData, setDeviceData] = useState({
        deviceId: '',
        deviceName: '',
        deviceType: '',
        screenWidth: '',
        screenHeight: ''
    });
    const [serverIp, setServerIp] = useState('localhost:3000');

    useEffect(() => {
        fetchDeviceInfo(setDeviceData);
    }, []);

    const { deviceId, deviceName, deviceType, screenWidth, screenHeight } = deviceData;

    const handleRegister = useCallback(async () => {
       
        try {
            const response = await axios.get(`http://${serverIp}/devices/${deviceId}`);
            if (response.data) {
                alert('Device already registered');
                router.push(`/visualization?deviceId=${deviceId}&deviceName=${deviceName}`);
            } else {
                const response = await axios.post(`http://${serverIp}/devices/register`, deviceData);
                alert('Registration Successful', response.data.message);
                router.push(`/visualization?deviceId=${deviceId}&deviceName=${deviceName}`);
            }
        } catch (error) {
            alert('Registration Failed', error.message);
        }
    }, [serverIp, deviceId, deviceData, router]);

    const qrCodeValue = useMemo(() => JSON.stringify(deviceData), [deviceData]);

    return (
        <ScrollView className="flex-1 p-6 bg-gray-100">
            <Text className="mb-4 text-xl font-bold text-center">
                Scan this QR code for registration.
            </Text>

            {deviceId && deviceName && deviceType && screenWidth && screenHeight && (
                <View className="items-center w-full max-w-md mx-auto mt-4">
                    <QRCode value={qrCodeValue} size={200} />
                </View>
            )}

            <View className="w-full max-w-md mx-auto mt-6">
                <Text className="mb-4 text-xl font-bold text-center">
                    Or Register Manually
                </Text>
                <TextInput
                    placeholder="Enter Server IP Address (localhost:3000)"
                    className="w-full p-2 mb-4 border"
                    onChangeText={setServerIp}
                />
                <Button
                    title="Register"
                    onPress={handleRegister}
                />
            </View>
        </ScrollView>
    );
};

export default HomeScreen;
