import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Rect } from 'react-native-svg';
import ScatterPlotWithBrushing from '../../components/charts/ScatterPlotWithBrushing';
import BarChart from '../../components/charts/BarChart';
const LinkedCharts = () => {
    const data = [
        { name: "Airline A", value: 2.5 },
        { name: "Airline B", value: 5.3 },
        { name: "Airline C", value: 3.1 },
        { name: "Airline D", value: 7.8 },
        { name: "Airline E", value: 1.4 },
      ];

  return (
    <View>
        <BarChart data={data} />
      <ScatterPlotWithBrushing data={data}/>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
});

export default LinkedCharts;
