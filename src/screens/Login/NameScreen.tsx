import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector, useDispatch} from 'react-redux';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {
  setName,
  setAuthLoading,
  setLoggedIn,
} from '../../redux/actions/authActions';
import Button from '../../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {createOrUpdateUser} from '../../services/realTimeUserService';
import {AppDispatch, RootState} from '../../redux/store';
import LoaderScreen from '../../components/LoaderScreen';

type NameScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Name'
>;

const NameScreen = () => {
  const [name, setNameInput] = useState('');
  const navigation = useNavigation<NameScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const phone = useSelector((state: RootState) => state.auth.phone);
  const role = useSelector((state: RootState) => state.auth.role);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      console.log('👤 Auth state restored:', user?.uid);
    });
    return unsubscribe;
  }, []);

  const handlePress = async () => {
    try {
      if (!name.trim()) {
        Alert.alert('Validation', 'Please enter your name.');
        return;
      }

      if (!role || !phone) {
        console.warn('❌ Missing role or phone in Redux');
        Alert.alert('Error', 'Missing required user info (role/phone).');
        return;
      }

      dispatch(setAuthLoading(true));
      dispatch(setName(name));

      await AsyncStorage.multiSet([
        ['@name', name],
        ['@role', role],
        ['@isLoggedIn', 'true'],
      ]);

      dispatch(setLoggedIn(true)); // ✅ Ensure Redux updates immediately

      const unsubscribe = auth().onAuthStateChanged(async user => {
        if (!user) {
          console.warn('❌ Firebase Auth user is still null');
          Alert.alert('Error', 'Authentication session is not ready yet.');
          dispatch(setAuthLoading(false));
          unsubscribe();
          return;
        }

        await createOrUpdateUser({
          uid: user.uid,
          name,
          phone,
          role,
          createdAt: new Date().toISOString(),
        });

        console.log('✅ User registered in Realtime Database');
        unsubscribe();

        dispatch(setAuthLoading(false));
        if (role === 'passenger') {
          navigation.navigate('Location'); // only navigate if passenger
        }
        // if driver, RootNavigator will automatically render DriverStack
      });
    } catch (error: any) {
      console.error('❌ Failed to register user or navigate:', error);
      dispatch(setAuthLoading(false));
      Alert.alert('Error', 'Something went wrong while saving your profile.');
    }
  };

  if (isLoading) {
    return <LoaderScreen />;
  }

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
