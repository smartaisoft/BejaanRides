import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {useSelector, useDispatch} from 'react-redux';
import {RootState, AppDispatch} from '../../redux/store';
import {
  setLoggedIn,
  setOtp,
  setRole,
  setUserData,
  setAuthLoading,
} from '../../redux/actions/authActions';
import {getUserByUid} from '../../services/realTimeUserService';
import Colors from '../../themes/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width} = Dimensions.get('window');
const iconSize = Math.min(30, width * 0.08);
type OTPScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Otp'
>;
type OTPScreenRouteProp = RouteProp<AuthStackParamList, 'Otp'>;

const OTPScreen = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute<OTPScreenRouteProp>();
  const {confirmation, isNewUser} = route.params;

  const dispatch = useDispatch<AppDispatch>();
  const phone = useSelector((state: RootState) => state.auth.phone);
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const [otp, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [confirmationState, setConfirmationState] = useState(confirmation);

  // Countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGoBack = () => navigation.goBack();

  const verifyOtp = async (code: string) => {
    dispatch(setAuthLoading(true));
    try {
      const credential = await confirmationState.confirm(code);
      if (!credential?.user) {
        throw new Error('User not found');
      }

      if (isNewUser) {
        await AsyncStorage.setItem('@isPhoneVerified', 'true');
        navigation.navigate('Role');
      } else {
        const userData = await getUserByUid(credential.user.uid);
        if (userData) {
          dispatch(setUserData(userData));
          dispatch(setRole(userData.role));
        }
        dispatch(setLoggedIn(true));
      }
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      if (error.code === 'auth/invalid-verification-code') {
        setOtpError('Invalid code. Please try again.');
      } else if (error.code === 'auth/code-expired') {
        setOtpError('Code expired. Please request a new one.');
      } else {
        setOtpError('Something went wrong. Try again.');
      }
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const handleOtpChange = (text: string) => {
    setOtpInput(text);
    setOtpError(null);
    dispatch(setOtp(text));
  };

  const handleResendCode = async () => {
    dispatch(setAuthLoading(true));
    try {
      const newConfirmation = await auth().signInWithPhoneNumber(phone);
      setConfirmationState(newConfirmation);
      Alert.alert('Code Resent', 'A new OTP has been sent to your phone.');
      setCountdown(30);
      setOtpInput('');
      setOtpError(null);
    } catch (error: any) {
      console.error('Resend OTP failed:', error);
      Alert.alert('Error', 'Could not resend OTP. Please try again.');
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <>
          <TouchableOpacity onPress={handleGoBack} style={styles.goBackButton}>
            <Icon name="arrow-back" size={iconSize} color="#333" />
          </TouchableOpacity>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Enter the code</Text>
            <Text style={styles.subText}>
              We have sent you a verification code to {phone}
            </Text>
          </View>

          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={handleOtpChange}
            maxLength={6}
            keyboardType="number-pad"
            placeholder="Enter OTP"
            placeholderTextColor="#333"
            autoFocus
          />
          {otpError && <Text style={styles.otpError}>{otpError}</Text>}

          <TouchableOpacity
            onPress={() => otp.length === 6 && verifyOtp(otp)}
            style={styles.verifyButton}>
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>

          {countdown > 0 ? (
            <Text style={styles.timerText}>Resend in {countdown}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendText}>Resend a new code</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 10,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 3,
  },
  goBackText: {
    fontSize: 20,
    color: '#333',
  },
  textContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
  otpInput: {
    width: '80%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30,
    padding: 10,
  },
  otpError: {
    color: 'red',
    marginTop: 10,
  },
  verifyButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  verifyText: {
    color: 'white',
    fontSize: 16,
  },
  timerText: {
    marginTop: 20,
    color: '#888',
  },
  resendText: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});

export default OTPScreen;
