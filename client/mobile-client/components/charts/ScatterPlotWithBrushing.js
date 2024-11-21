import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Svg, Circle, Text } from "react-native-svg";
import * as d3 from "d3";

const ScatterPlot = ({ data }) => {
  // Dimensions
  const chartWidth = 400;
  const chartHeight = 300;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };

  // Scaling
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.distance)])
    .range([margin.left, chartWidth - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d.delay), d3.max(data, (d) => d.delay)])
    .range([chartHeight - margin.bottom, margin.top]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Svg width={chartWidth} height={chartHeight}>
          {/* Points */}
          {data.map((d, i) => (
            <Circle
              key={i}
              cx={xScale(d.distance)}
              cy={yScale(d.delay)}
              r={3}
              fill="blue"
            />
          ))}

          {/* X-Axis */}
          {xScale.ticks(5).map((tick, i) => (
            <Text
              key={`x-${i}`}
              x={xScale(tick)}
              y={chartHeight - margin.bottom + 15}
              fontSize="10"
              textAnchor="middle"
            >
              {tick}
            </Text>
          ))}

          {/* Y-Axis */}
          {yScale.ticks(5).map((tick, i) => (
            <Text
              key={`y-${i}`}
              x={margin.left - 10}
              y={yScale(tick) + 5}
              fontSize="10"
              textAnchor="end"
            >
              {tick}
            </Text>
          ))}

          {/* X-Axis Label */}
          <Text
            x={chartWidth / 2}
            y={chartHeight - 5}
            fontSize="12"
            textAnchor="middle"
          >
            Distance (miles)
          </Text>

          {/* Y-Axis Label */}
          <Text
            x={-chartHeight / 2}
            y={15}
            fontSize="12"
            textAnchor="middle"
            transform="rotate(-90)"
          >
            Arrival Delay (minutes)
          </Text>
        </Svg>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});

export default ScatterPlot;
