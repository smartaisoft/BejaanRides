import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSelector, useDispatch} from 'react-redux';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {
  setName as setNameAction,
  setAuthLoading,
  setLoggedIn,
  setUserData,
} from '../../redux/actions/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {createOrUpdateUser} from '../../services/realTimeUserService';
import {AppDispatch, RootState} from '../../redux/store';
import LoaderScreen from '../../components/LoaderScreen';
import * as yup from 'yup';
import PhoneNumberInput from '../../components/PhoneNumberInput';

type NameScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Name'
>;

const NameScreen: React.FC = () => {
  const [name, setNameInput] = useState('');
  const [email, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [cnic, setCnicInput] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    cnic?: string;
  }>({});

  const navigation = useNavigation<NameScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const role = useSelector((state: RootState) => state.auth.role);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handlePress = async () => {
    try {
      setErrors({});

      // ✅ Validation schema for +9234... format
      const schema = yup.object().shape({
        name: yup
          .string()
          .trim()
          .min(2, 'Name must be at least 2 characters.')
          .required('Name is required.'),
        email: yup
          .string()
          .trim()
          .email('Enter a valid email.')
          .required('Email is required.'),
        phone: yup
          .string()
          .trim()
          .matches(/^\+92\d{10}$/, 'Enter a valid phone number starting with +92.'),
        cnic: yup
          .string()
          .trim()
          .matches(/^\d{13}$/, 'CNIC must be 13 digits.'),
      });

      await schema.validate(
        {
          name,
          email,
          phone: phoneInput.trim(),
          cnic: cnic.trim(),
        },
        {abortEarly: false}
      );

      if (!role) {
        console.warn('❌ Missing user role');
        return;
      }

      dispatch(setAuthLoading(true));
      dispatch(setNameAction(name));

      // ✅ Save to AsyncStorage
      await AsyncStorage.multiSet([
        ['@name', name],
        ['@role', role],
        ['@isLoggedIn', 'true'],
      ]);

      dispatch(setLoggedIn(true));

      const currentUser = auth().currentUser;

      if (!currentUser) {
        console.warn('❌ Firebase Auth user is null');
        dispatch(setAuthLoading(false));
        return;
      }

      const userData = {
        uid: currentUser.uid,
        name: name.trim(),
        phone: phoneInput.trim(), // Save in +92 format
        email: email.trim(),
        cnic: cnic.trim(),
        role,
        createdAt: new Date().toISOString(),
      };

      await createOrUpdateUser(userData);

      console.log('✅ User registered in Firestore');

      dispatch(setUserData(userData));

      dispatch(setAuthLoading(false));

      // Optionally navigate further
      // navigation.navigate('SomeScreen');
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const newErrors: any = {};
        error.inner.forEach((err: any) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error('❌ Error saving profile:', error);
        dispatch(setAuthLoading(false));
      }
    }
  };

  if (isLoading) {
    return <LoaderScreen />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
        <Text style={styles.goBackText}>{'←'}</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Personal Information</Text>

      {/* Name */}
      <Text style={styles.label}>Enter your Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setNameInput}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      {/* Phone */}
      <Text style={styles.label}>Enter your Phone</Text>
      <PhoneNumberInput
        value={phoneInput}
        onChange={setPhoneInput}
        error={errors.phone}
      />

      {/* Email */}
      <Text style={styles.label}>Enter your Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmailInput}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* CNIC */}
      <Text style={styles.label}>Enter your CNIC</Text>
      <TextInput
        style={styles.input}
        placeholder="CNIC number"
        value={cnic}
        onChangeText={setCnicInput}
        keyboardType="numeric"
        maxLength={13}
      />
      {errors.cnic && <Text style={styles.errorText}>{errors.cnic}</Text>}

      <TouchableOpacity style={styles.nextButton} onPress={handlePress}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  goBackButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  goBackText: {
    fontSize: 22,
    color: '#000',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  label: {
    fontSize: 14,
    color: '#000',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#E4E4E4',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 12,
  },
  nextButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NameScreen;
