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
  Modal,
  Image,
} from 'react-native';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import Button from '../../components/Button';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack'; // Import the correct navigation prop
import {AuthStackParamList} from '../../navigation/AuthNavigator';
import {useDispatch} from 'react-redux';
import {setPhone} from '../../redux/actions/authActions'; // Adjust path based on your structure
import type {AppDispatch} from '../../redux/store'; // ✅ Import this
import auth from '@react-native-firebase/auth';

import {setAuthLoading} from '../../redux/actions/authActions';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {ActivityIndicator} from 'react-native';
// Define the navigation prop type for this screen
type LoginWithPhoneNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'PhoneLogin'
>;

// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  phone: Yup.string().required('Please enter phone number'),
});

const LoginWithPhone = () => {
  const navigation = useNavigation<LoginWithPhoneNavigationProp>(); // Type the navigation object
  const dispatch = useDispatch<AppDispatch>(); // ✅ Now it knows about AuthActionTypes
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const handleGoBack = () => {
    navigation.goBack();
  };

 const handlePhonePress = async (values: { phone: string }) => {
  dispatch(setAuthLoading(true));
  try {
    const fullPhoneNumber = values.phone;

    // ✅ Debug log for OTP sending
    console.log('Sending OTP to:', fullPhoneNumber);

    const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);

    dispatch(setPhone(fullPhoneNumber));

    navigation.navigate('Otp', {
      method: 'SMS',
      confirmation,
    });
  } catch (error) {
    console.error('Failed to send OTP:', error);
  } finally {
    dispatch(setAuthLoading(false));
  }
};


  const handleOptionPress = async (method: string) => {
    try {
      setModalVisible(false);

      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);

      navigation.navigate('Otp', {
        method,
        confirmation,
      });
    } catch (error) {
      console.error('OTP send error:', error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Close modal on cross icon click
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Dismiss keyboard when tapping outside */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          {/* Go Back text */}
          <TouchableOpacity onPress={handleGoBack}>
            <Text style={styles.goBackText}>{'<'}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Join us Via phone number</Text>
          <Text>We’ll send a code to verify your phone.</Text>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={{marginTop: 40}}
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
                      onChange={value => {
                        handleChange('phone')(value);
                        setPhoneNumber(value);
                      }}
                      error={touched.phone && errors.phone ? errors.phone : ''}
                    />
                  </View>
                  <Button
                    title="Next"
                    onPress={handleSubmit}
                    style={styles.button}
                  />
                </>
              )}
            </Formik>
          )}
        </View>
      </TouchableWithoutFeedback>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {/* Close icon */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseModal}>
              <Image
                source={require('../../../assets/images/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              How would you like to get the code?
            </Text>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionPress('WhatsApp')}>
              <Image source={require('../../../assets/images/Whatsapp.png')} />
              <Text style={styles.optionText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleOptionPress('SMS')}>
              <Image source={require('../../../assets/images/sms.png')} />
              <Text style={styles.optionText}>SMS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  goBackText: {
    color: '#333',
    fontSize: 20,
    marginTop: 10,
  },
  inputContainer: {
    marginTop: 30,
  },
  button: {
    width: '100%',
    marginTop: 20,
    position: 'absolute',
    bottom: 30,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeIcon: {
    width: 15, // Width of the icon
    height: 30, // Height of the icon
    resizeMode: 'contain', // Ensures the image keeps its aspect ratio
    position: 'absolute', // Position it absolutely
    top: 5, // 10 units from the top
    right: 5, // 10 units from the right
    zIndex: 1, // Ensure the icon is above other components
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center', // Horizontally center the text
    marginBottom: 40, // Space below the title
    width: '70%',
    color: '#000000', // Text color
  },

  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    width: '80%',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default LoginWithPhone;
