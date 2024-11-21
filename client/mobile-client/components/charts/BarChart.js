import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Svg, Rect, Text } from "react-native-svg";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  // Dimensions
  const chartWidth = 400;
  const chartHeight = 300;
  const barWidth = 20;

  // Scaling
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([0, chartWidth]);

  const yScale = d3
    .scaleBand()
    .domain(data.map((d) => d.name))
    .range([0, chartHeight])
    .padding(0.1);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Svg width={chartWidth + 100} height={chartHeight + 50}>
          {/* Bars */}
          {data.map((d, i) => (
            <Rect
              key={i}
              x={100} // Margin for labels
              y={yScale(d.name)}
              width={xScale(d.value)}
              height={yScale.bandwidth()}
              fill="skyblue"
            />
          ))}

          {/* Labels */}
          {data.map((d, i) => (
            <Text
              key={`label-${i}`}
              x={0}
              y={yScale(d.name) + yScale.bandwidth() / 2 + 5}
              fontSize="10"
              textAnchor="start"
            >
              {d.name}
            </Text>
          ))}

          {/* X-Axis */}
          {xScale.ticks(5).map((tick, i) => (
            <Text
              key={`x-${i}`}
              x={100 + xScale(tick)}
              y={chartHeight + 20}
              fontSize="10"
              textAnchor="middle"
            >
              {tick}
            </Text>
          ))}
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


export default BarChart;
