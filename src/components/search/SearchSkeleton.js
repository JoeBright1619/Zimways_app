import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import colors_fonts from '../../constants/colors_fonts';

const screenWidth = Dimensions.get('window').width;

const SearchSkeleton = ({ type = 'grid', count = 6 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const renderGridSkeleton = () => (
    <View style={styles.gridContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.gridItem,
            { opacity }
          ]}
        >
          <View style={styles.imageSkeleton} />
          <View style={styles.textSkeleton} />
          <View style={styles.textSkeleton2} />
        </Animated.View>
      ))}
    </View>
  );

  const renderHorizontalSkeleton = () => (
    <View style={styles.horizontalContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.horizontalItem,
            { opacity }
          ]}
        >
          <View style={styles.horizontalImageSkeleton} />
          <View style={styles.horizontalTextSkeleton} />
        </Animated.View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {type === 'grid' ? renderGridSkeleton() : renderHorizontalSkeleton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (screenWidth - 60) / 2,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 3,
  },
  imageSkeleton: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  textSkeleton: {
    width: '80%',
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 4,
  },
  textSkeleton2: {
    width: '60%',
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  horizontalContainer: {
    flexDirection: 'row',
  },
  horizontalItem: {
    width: 168,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
  
  },
  horizontalImageSkeleton: {
    width: '100%',
    height: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  horizontalTextSkeleton: {
    width: '70%',
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
});

export default SearchSkeleton; 