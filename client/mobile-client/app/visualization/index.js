import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function VisualizationScreen() {
  const router = useRouter();
  console.log(router);
  const { deviceId, deviceName } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {deviceName}!</Text>
      <Text style={styles.subtitle}>Device ID: {deviceId}</Text>

      <Text style={styles.options}>Choose a Visualization:</Text>
      <Button title="Scatter Plot" onPress={() => router.push('/visualization/bar-chart')} />
      <Button title="Line Chart" onPress={() => router.push('/visualization/line-chart')} />
      <Button title="Pie Chart" onPress={() => router.push('/visualization/pie-chart')} />
      <Button title="Linked Chart" onPress={() => router.push('/visualization/linked-chart')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#555',
  },
  options: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});
