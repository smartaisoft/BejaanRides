import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {setPhone, setAuthLoading} from '../../redux/actions/authActions';
import type {AppDispatch, RootState} from '../../redux/store';
import {getUserByPhone} from '../../services/realTimeUserService';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import Button from '../../components/Button';
import Colors from '../../themes/colors';

type LoginWithPhoneNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'PhoneLogin'
>;

const validationSchema = Yup.object().shape({
  phone: Yup.string().required('Please enter phone number'),
});

const LoginWithPhone: React.FC = () => {
  const navigation = useNavigation<LoginWithPhoneNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const handleGoBack = () => {
    navigation.goBack();
  };

  // const handlePhonePress = async (values: {phone: string}) => {
  //   dispatch(setAuthLoading(true));
  //   const fullPhoneNumber = values.phone;

  //   try {
  //     // 🔹 Check if the phone number exists in Firestore
  //     const user = await getUserByPhone(fullPhoneNumber);

  //     if (user) {
  //       console.log('✅ Phone number exists in Firestore.');
  //     } else {
  //       console.log('✅ Phone number NOT found in Firestore.');
  //     }

  //     // 🔹 Send OTP
  //     const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);

  //     // 🔹 Save phone to Redux
  //     dispatch(setPhone(fullPhoneNumber));

  //     // 🔹 Navigate to OTP screen
  //     navigation.navigate('Otp', {
  //       method: 'SMS',
  //       confirmation,
  //       isNewUser: !user,
  //     });
  //   } catch (error) {
  //     console.error('❌ Failed to send OTP:', error);
  //   } finally {
  //     dispatch(setAuthLoading(false));
  //   }
  // };

const handlePhonePress = async ({ phone }: { phone: string }) => {
  dispatch(setAuthLoading(true));
  const fullPhoneNumber = phone;

  try {
    const user = await getUserByPhone(fullPhoneNumber);
    const isNewUser = !user;

    console.log(
      `📱 Phone number ${isNewUser ? 'NOT ' : ''}found in Firestore.`,
    );

    const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
    console.log('✅ OTP sent successfully.', confirmation);

    dispatch(setPhone(fullPhoneNumber));

    navigation.navigate('Otp', {
      method: 'SMS',
      confirmation,
      isNewUser,
    });
  } catch (error: any) {
    let message = 'Something went wrong while sending OTP.';
    let title = 'OTP Error';

    switch (error.code) {
      case 'auth/invalid-phone-number':
        message = 'Invalid phone number format. Please use correct country code and format.';
        break;
      case 'auth/missing-phone-number':
        message = 'Phone number is missing. Please enter it.';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please wait a few minutes and try again.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Check your internet connection.';
        break;
      case 'auth/app-not-authorized':
        message = 'App is not authorized for Firebase Phone Auth.\nPlease ensure the SHA-1 from Play Console is added in Firebase and google-services.json is updated.';
        break;
      case 'auth/quota-exceeded':
        message = 'SMS quota for the project exceeded. Please try again later.';
        break;
      default:
        message += `\n\nCode: ${error.code}`;
        break;
    }

    Alert.alert(title, message);
    console.warn(`❌ Firebase OTP error [${error.code}]:`, error?.message || error);
  } finally {
    dispatch(setAuthLoading(false));
  }
};



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* Back Button */}
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.goBackText}>{'<'}</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Join us via phone number</Text>
          <Text style={styles.subtitle}>
            We’ll send a code to verify your phone.
          </Text>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={styles.loader}
            />
          ) : (
            <Formik
              initialValues={{phone: ''}}
              validationSchema={validationSchema}
              onSubmit={handlePhonePress}>
              {({handleChange, handleSubmit, values, errors, touched}) => (
                <>
                  <View style={styles.inputContainer}>
                    <PhoneNumberInput
                      value={values.phone}
                      onChange={handleChange('phone')}
                      error={touched.phone && errors.phone ? errors.phone : ''}
                    />
                  </View>
                  <Button
                    title="Next"
                    onPress={handleSubmit}
                    style={styles.button}
                    backgroundColor={Colors.primary}
                  />
                </>
              )}
            </Formik>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  innerContainer: {
    flex: 1,
    paddingTop: 50,
  },
  goBackText: {
    color: '#333',
    fontSize: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  inputContainer: {
    marginTop: 30,
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  loader: {
    marginTop: 40,
  },
});

export default LoginWithPhone;
