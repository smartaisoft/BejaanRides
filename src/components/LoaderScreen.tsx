import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const LoaderScreen = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#9C27B0" />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default LoaderScreen;
