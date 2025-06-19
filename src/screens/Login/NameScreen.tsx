import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector, useDispatch} from 'react-redux';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {RootState} from '../../redux/store';
import {setName} from '../../redux/actions/authActions';
import Button from '../../components/Button';
import {AppDispatch} from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NameScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Name'
>;

const NameScreen = () => {
  const [name, setNameInput] = useState('');
  const navigation = useNavigation<NameScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const role = useSelector((state: RootState) => state.auth.role);
  console.log('Saved Role to Redux:', role);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePress = async () => {
    try {
      console.log('Next Button Pressed');
      dispatch(setName(name));
      console.log('Saved name to Redux:', name);

      if (!role) {
        console.warn('❌ Role is null, not saving session.');
        return;
      }

      await AsyncStorage.multiSet([
        ['@name', name],
        ['@role', role],
        ['@isLoggedIn', 'true'],
      ]);

      // 🔀 Navigate
      if (role === 'driver') {
        navigation.navigate('DriverPersonalInfo');
      } else if (role === 'passenger') {
        navigation.navigate('Location');
      } else {
        console.warn('No valid role set in Redux');
      }
    } catch (error) {
      console.error('❌ Failed to save session:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
        <Text style={styles.goBackText}>{'<'}</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Welcome to Bejaan Ride!</Text>
      <Text style={styles.subtitle}>Please introduce yourself</Text>

      <Text style={styles.label}>Enter your name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={name}
        onChangeText={setNameInput}
      />

      <Button title="Next" onPress={handlePress} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  goBackText: {
    fontSize: 20,
    color: '#333',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ddd',
    backgroundColor: '#E4E4E4',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
});

export default NameScreen;
