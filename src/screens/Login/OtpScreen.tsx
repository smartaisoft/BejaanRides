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
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [confirmationState, setConfirmationState] = useState(confirmation);

  // Countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGoBack = () => navigation.goBack();

  const handleOtpChange = async (text: string) => {
    setOtpInput(text);
    setOtpError(null);
    dispatch(setOtp(text));

    if (text.length === 6) {
      dispatch(setAuthLoading(true));
      try {
        const credential = await confirmationState.confirm(text);
        if (!credential?.user) throw new Error('User not found');

        if (isNewUser) {
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
          setIsOtpExpired(true);
        } else {
          setOtpError('Something went wrong. Try again.');
        }
      } finally {
        dispatch(setAuthLoading(false));
      }
    }
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
      setIsOtpExpired(false);
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
            <Text style={styles.goBackText}>{'<'}</Text>
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
            autoFocus
          />
          {otpError && (
            <Text style={{color: 'red', marginTop: 10}}>{otpError}</Text>
          )}

          {countdown > 0 ? (
            <Text style={{marginTop: 20, color: '#888'}}>
              Resend in {countdown}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={[styles.resendText, {color: 'red'}]}>
                Resend a new code
              </Text>
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
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
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
  resendText: {
    fontSize: 16,
    color: '#007BFF',
    marginTop: 20,
  },
});

export default OTPScreen;
