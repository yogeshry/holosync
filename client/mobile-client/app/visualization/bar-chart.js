import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Svg, Circle, G, Line, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';
const SERVER_URL = 'http://localhost:3000';

const ScatterPlot = ({ year }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [data, setData] = useState([]);
  const wsRef = useRef(null); // WebSocket reference


    // Initialize WebSocket and setup listeners
    const initializeWebSocket = () => {
      wsRef.current = new WebSocket(`ws://localhost:3000/ws`);
      wsRef.current.onopen = () =>  {
        console.log('WebSocket initialized.', wsRef);
      }
      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'BRUSH_UPDATE') {
            setSelectedCountry(message.selectedPoints);
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
  // Fetch initial scatterplot data
  const fetchScatterData = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/data/population`);
      const scatterData = await response.json();
      setData(scatterData);
    } catch (error) {
      console.error('Error fetching scatterplot data:', error);
    }
  };

  useEffect(() => {
    fetchScatterData();
    initializeWebSocket();
  }, []);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    console.log('Brushed points:', country);
    // Send brush state to the server only if WebSocket is ready
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'BRUSH_EVENT',
          brushState: { selectedPoints: country },
        })
      );
    } else {
      console.error('WebSocket is not ready. Brush state could not be sent.');
    }
  };

  // Filter data for the selected year
  const scatterData = useMemo(() => data.filter(d => d.year === year), [data, year]);

  // D3 scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.fertility)) // Use full dataset for consistent scaling
    .range([50, 300]);

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.life_expect))
    .range([300, 50]);

  const radiusScale = d3
    .scaleSqrt()
    .domain(d3.extent(data, d => d.pop))
    .range([3, 15]);

  // Axis ticks
  const xTicks = xScale.ticks(5);
  const yTicks = yScale.ticks(5);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Fertility vs Life Expectancy in ${year}`}</Text>
      <Svg width={350} height={350}>
        {/* Y-axis */}
        <G>
          {yTicks.map((tick, i) => (
            <G key={`y-tick-${i}`} transform={`translate(50, ${yScale(tick)})`}>
              <Line x1={0} x2={300 - 50} stroke="lightgray" />
              <SvgText x={-10} y={4} textAnchor="end" fontSize={10}>
                {tick}
              </SvgText>
            </G>
          ))}
        </G>

        {/* X-axis */}
        <G>
          {xTicks.map((tick, i) => (
            <G key={`x-tick-${i}`} transform={`translate(${xScale(tick)}, 300)`}>
              <Line y1={0} y2={-250} stroke="lightgray" />
              <SvgText y={15} textAnchor="middle" fontSize={10}>
                {tick}
              </SvgText>
            </G>
          ))}
        </G>

        {/* Data Points */}
        {scatterData.map((d, i) => (
          <Circle
            key={i}
            cx={xScale(d.fertility)}
            cy={yScale(d.life_expect)}
            r={radiusScale(d.pop)}
            fill={d.country === selectedCountry ? '#3484c7' : 'lightgrey'}
            onPress={() =>
              handleSelect(d.country === selectedCountry ? null : d.country)
            }
          />
        ))}

        {/* Axis Labels */}
        <SvgText x={20} y={20} fontSize={12} fontWeight="bold">
          Fertility vs Life Expectancy
        </SvgText>
      </Svg>
    </View>
  );
};



export default function App() {
  return <ScatterPlot year={1970} />;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});
