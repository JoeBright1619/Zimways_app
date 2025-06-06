// components/DottedLine.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const DottedLine = ({ color = '#ccc', dotSize = 4, gap = 6, lineWidth = '100%' }) => {
  const dots = new Array(100).fill(null); // Adjust number for longer or shorter lines

  return (
    <View style={[styles.lineContainer, { width: lineWidth }]}>
      {dots.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: color,
              width: dotSize,
              height: dotSize,
              marginRight: gap,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  lineContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  dot: {
    borderRadius: 999,
  },
});

export default DottedLine;
