import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Circle, Rect } from 'react-native-svg';

const SERVER_URL = 'http://localhost:3000';
const DEVICE_ID = 'scatterplot';

const ScatterPlot = () => {
  const [data, setData] = useState([]); // Scatterplot data points
  const [selectedPoints, setSelectedPoints] = useState([]); // Highlighted points
  const wsRef = useRef(null); // WebSocket reference

  // Fetch initial scatterplot data
  const fetchScatterData = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/data/scatterplot?deviceId=${DEVICE_ID}`);
      const scatterData = await response.json();
      setData(scatterData);
    } catch (error) {
      console.error('Error fetching scatterplot data:', error);
    }
  };

  // Initialize WebSocket and setup listeners
  const initializeWebSocket = () => {
    wsRef.current = new WebSocket(`ws://localhost:3000/ws?deviceId=${DEVICE_ID}`);
    wsRef.current.onopen = () =>  {
      console.log('WebSocket initialized.', wsRef);
    }
    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'BRUSH_UPDATE') {
          setSelectedPoints(message.selectedPoints);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  };

  // Handle brushing and send the state to the server
  const handleBrush = (xRange, yRange) => {
    const brushedPoints = data.filter((d) => d.x >= xRange[0] && d.x <= xRange[1] && d.y >= yRange[0] && d.y <= yRange[1]);
    setSelectedPoints(brushedPoints);
    console.log('Brushed points:', brushedPoints);
    console.log(wsRef.current);
    // Send brush state to the server only if WebSocket is ready
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'BRUSH_EVENT',
          deviceId: DEVICE_ID,
          brushState: { xRange, yRange, selectedPoints: brushedPoints },
        })
      );
    } else {
      console.error('WebSocket is not ready. Brush state could not be sent.');
    }
  };
  // Use effect to handle data fetching and WebSocket lifecycle
  useEffect(() => {
    fetchScatterData();
    initializeWebSocket();

    return () => {
      // if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Svg width={300} height={300}>
        {/* Render scatterplot points */}
        {data.map((d, i) => (
          <Circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={5}
            fill={selectedPoints.includes(d) ? 'orange' : 'steelblue'}
          />
        ))}

        {/* Brushing area */}
        <Rect
        
          width={300}
          height={300}
          fill="rgba(0,0,0,0.1)"
          onPress={() => handleBrush([50, 150], [50, 150])}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScatterPlot;
