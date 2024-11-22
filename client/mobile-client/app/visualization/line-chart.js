import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Svg, Path, G, Line, Text as SvgText } from 'react-native-svg';
import * as d3 from 'd3';

const SERVER_URL = 'http://localhost:3000';

const LineChart = ({ yearRange }) => {
    const [data, setData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
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

    // Group data by country
    const groupedData = useMemo(() => {
        const grouped = d3.group(data, d => d.country);
        return Array.from(grouped.values());
    }, [data]);
    console.log(groupedData);

    // X and Y scales
    const xScale = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain(yearRange) // Range of years (e.g., [1950, 2020])
                .range([50, 300]), // Map to canvas width
        [yearRange]
    );

    const yScale = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([0, d3.max(data, d => d.pop)]) // Max life expectancy across all data
                .range([300, 50]), // Map to canvas height
        [data]
    );

    // Line generator
    const lineGenerator = d3
        .line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.pop))
        .curve(d3.curveMonotoneX); // Smooth curves

    // Axis ticks
    const xTicks = xScale.ticks(5);
    const yTicks = yScale.ticks(5);


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
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Population Trends by Country</Text>
            <Svg width={500} height={450}>
                {/* Y-axis */}
                <G>
                    {yTicks.map((tick, i) => (
                        <G key={`y-tick-${i}`} transform={`translate(50, ${yScale(tick)})`}>
                            <Line x1={0} x2={300 - 50} stroke="lightgray" />
                            <SvgText x={-20} y={4} textAnchor="end" fontSize={10}>
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

                {/* Line paths */}
                {groupedData.map((countryData, i) => (
                    <Path
                        key={`line-${i}`}
                        d={lineGenerator(countryData)}
                        stroke={selectedCountry === countryData[0].country ? 'red' : 'lightblue'} // Highlight selected country
                        strokeWidth={selectedCountry === countryData[0].country ? 3 : 2}
                        fill="none"
                        onPress={() => handleSelect(countryData[0].country)} // Set selected country on press
                    />
                ))}
            </Svg>
        </View>
    );
};

export default function App() {
    return <LineChart yearRange={[1955, 2005]} />;
}

const styles = StyleSheet.create({
    container: {
        padding: 50,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
});
