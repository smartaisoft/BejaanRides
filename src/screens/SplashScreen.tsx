import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const SplashScreenComponent = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/BeejanLogo.png')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B39DDBCC',
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    maxWidth: 300,
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreenComponent;
