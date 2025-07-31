/* eslint-disable curly */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
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
  setRole,
} from '../../redux/actions/authActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {createOrUpdateUser} from '../../services/realTimeUserService';
import {AppDispatch, RootState} from '../../redux/store';
import LoaderScreen from '../../components/LoaderScreen';
import * as yup from 'yup';
import Colors from '../../themes/colors';
import {generateReferralCode} from '../../services/mlmUserService';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const iconSize = Math.min(30, width * 0.08);
type NameScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Name'
>;

interface ReferralInfo {
  referredBy?: string;
  referrUid?: string;
}

interface UserData {
  name?: string;
  email?: string;
  cnic?: string;
  referredBy?: string;
  referralCode?: string;
}

const NameScreen: React.FC = () => {
  const navigation = useNavigation<NameScreenNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const phoneFromRedux = useSelector((state: RootState) => state.auth.phone);
  const userData = useSelector(
    (state: RootState) => state.auth.user,
  ) as UserData;
  const role = useSelector((state: RootState) => state.auth.role);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const [name, setNameInput] = useState('');
  const [email, setEmailInput] = useState('');
  const [cnic, setCnicInput] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);

  useEffect(() => {
    if (userData) {
      setNameInput(userData.name || '');
      setEmailInput(userData.email || '');
      setCnicInput(userData.cnic || '');
      setReferredBy(userData.referredBy || '');
      setReferralCode(userData.referralCode || '');
    }
  }, [userData]);

  useEffect(() => {
    const loadReferralInfo = async () => {
      try {
        const stored = await AsyncStorage.getItem('referralInfo');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.referredBy && parsed?.referrUid) {
            setReferralInfo(parsed);
          }
        }
      } catch (err) {
        console.error('Failed to load referralInfo:', err);
      }
    };
    loadReferralInfo();
  }, []);

  const handlePress = async () => {
    try {
      setErrors({});
      const schema = yup.object().shape({
        name: yup.string().trim().min(2).required(),
        email: yup.string().trim().email().required(),
        cnic: yup
          .string()
          .trim()
          .matches(/^\d{13}$/, 'CNIC must be 13 digits.'),
      });
      await schema.validate({name, email, cnic}, {abortEarly: false});

      if (!role) return;
      dispatch(setAuthLoading(true));
      dispatch(setNameAction(name));

      await AsyncStorage.multiSet([
        ['@name', name],
        ['@role', role],
        ['@isLoggedIn', 'true'],
      ]);

      dispatch(setLoggedIn(true));
      dispatch(setRole(role));

      const currentUser = auth().currentUser;
      if (!currentUser) {
        dispatch(setAuthLoading(false));
        return;
      }

      const newReferralCode = generateReferralCode(name, currentUser.uid);
      const user = {
        uid: currentUser.uid,
        name: name.trim(),
        phone: phoneFromRedux,
        email: email.trim(),
        cnic: cnic.trim(),
        role,
        createdAt: new Date().toISOString(),
        referralCode: newReferralCode,
        referredBy: referralInfo?.referredBy || referredBy || null,
        referrerUid: referralInfo?.referrUid || null,
        mlmNetwork: {
          level1: [],
          level2: [],
          level3: [],
          level4: [],
          level5: [],
          level6: [],
          level7: [],
        },
        isSubscribed: false,
        subscriptionExpiry: null,
        isActive: true,
        isApproved: false,
        wallet: {
          rideBalance: 0,
          commissionIncome: 0,
          withdrawalBalance: 0,
          transactionHistory: [],
        },
      };

      await createOrUpdateUser(user);
      Platform.OS === 'android'
        ? ToastAndroid.show('User created successfully!', ToastAndroid.SHORT)
        : Alert.alert('Success', 'User created successfully!');

      dispatch(setUserData(user));
      dispatch(setAuthLoading(false));
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const newErrors: Record<string, string> = {};
        error.inner.forEach(
          (err: any) => err.path && (newErrors[err.path] = err.message),
        );
        setErrors(newErrors);
      } else {
        dispatch(setAuthLoading(false));
        console.error('Error saving profile:', error);
      }
    }
  };

  if (isLoading) return <LoaderScreen />;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.goBackButton}>
              <Icon name="arrow-back" size={iconSize} color="#333" />
            </TouchableOpacity>
            <Text style={styles.header}>Personal Information</Text>

            {[
              {
                label: 'Enter your Name',
                value: name,
                onChange: setNameInput,
                placeholder: 'Name',
                error: errors.name,
              },
              {
                label: 'Enter your Phone',
                value: phoneFromRedux,
                onChange: setNameInput,
                placeholder: 'Phone number',
                editable: false,
              },
              {
                label: 'Enter your Email',
                value: email,
                onChange: setEmailInput,
                placeholder: 'Email',
                error: errors.email,
              },
              {
                label: 'Enter your CNIC',
                value: cnic,
                onChange: setCnicInput,
                placeholder: 'CNIC number',
                keyboardType: 'numeric' as const,
                maxLength: 13,
                error: errors.cnic,
              },
              {
                label: 'Referral By (optional)',
                value: referredBy,
                onChange: setReferredBy,
                placeholder: 'Enter Name',
              },
              {
                label: 'Referral Code (optional)',
                value: referralCode,
                onChange: setReferralCode,
                placeholder: 'Referral code',
              },
            ].map((item, index) => (
              <View key={index}>
                <Text style={styles.label}>{item.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={item.placeholder}
                  placeholderTextColor="#999"
                  value={item.value}
                  onChangeText={item.onChange}
                  editable={item.editable !== false}
                  keyboardType={item.keyboardType}
                  maxLength={item.maxLength}
                />
                {item.error && (
                  <Text style={styles.errorText}>{item.error}</Text>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.nextButton} onPress={handlePress}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
    backgroundColor: '#FFFFFF',
  },
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
    backgroundColor: Colors.primary,
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
