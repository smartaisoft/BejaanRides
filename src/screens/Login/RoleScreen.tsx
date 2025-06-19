import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Button from '../../components/Button';
import Ride from '../../../assets/SVG/Ride';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {useDispatch} from 'react-redux';
import {setRole} from '../../redux/actions/authActions';
import {AppDispatch} from '../../redux/store';
type RoleScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Role'
>;

const RoleScreen = () => {
  const navigation = useNavigation<RoleScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const handlePassengerPress = () => {
    console.log('Passenger selected');
    dispatch(setRole('passenger'));

    navigation.navigate('Name');
  };

  const handleDriverPress = () => {
    console.log('Driver selected');
    dispatch(setRole('driver'));
    navigation.navigate('Name');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Are you a passenger or a driver? </Text>

      <Text style={styles.subtitle}>You can change the mode.</Text>

      <View style={styles.imageContainer}>
        <Ride width={400} height={400} />
      </View>

      <Button
        title="Passenger"
        onPress={handlePassengerPress}
        backgroundColor="#9C27B0"
        textColor="white"
        style={styles.button}
        textStyle={styles.passengerText}
      />

      <Button
        title="Driver"
        onPress={handleDriverPress}
        backgroundColor="#E4E4E4"
        textColor="white"
        style={styles.button}
        textStyle={styles.DriverText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    marginBottom: 40,
    marginRight: 45,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  passengerText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  DriverText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default RoleScreen;
