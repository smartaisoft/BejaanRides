import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import Colors from '../themes/colors';

const LoaderScreen = () => {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={Colors.primary}/>
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
