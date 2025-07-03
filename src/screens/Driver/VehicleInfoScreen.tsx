import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  setVehicleDetails,
  resetVehicleInfo,
} from '../../redux/actions/vehicleActions';
import {AppDispatch, RootState} from '../../redux/store';
import {saveVehicleInfo} from '../../services/vehicleService';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {DriverStackParamList} from '../../navigation/DriverStack';
import {Formik} from 'formik';
import * as yup from 'yup';
import LoaderScreen from '../../components/LoaderScreen';
import { setAuthLoading } from '../../redux/actions/authActions';

interface ImageMap {
  certificateFront: string | null;
  certificateBack: string | null;
  vehiclePhoto: string | null;
}

const validationSchema = yup.object().shape({
  model: yup.string().required('Vehicle model is required'),
  brand: yup.string().required('Vehicle brand is required'),
  color: yup.string().required('Vehicle color is required'),
  plateNumber: yup.string().required('Number plate is required'),
  images: yup.object().shape({
    certificateFront: yup
      .string()
      .nullable()
      .required('Certificate front is required'),
    certificateBack: yup
      .string()
      .nullable()
      .required('Certificate back is required'),
    vehiclePhoto: yup.string().nullable().required('Vehicle photo is required'),
  }),
});

const VehicleInfoScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {vehicleType} = useSelector((state: RootState) => state.vehicle);
  const navigation = useNavigation<StackNavigationProp<DriverStackParamList>>();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  const handlePickImage = (
    key: keyof ImageMap,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (
        !response.didCancel &&
        !response.errorCode &&
        response.assets &&
        response.assets.length > 0
      ) {
        const uri = response.assets[0].uri;
        setFieldValue(`images.${key}`, uri || null);
      }
    });
  };

  const handleRemoveImage = (
    key: keyof ImageMap,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    setFieldValue(`images.${key}`, null);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (!vehicleType) {
        Alert.alert('Error', 'Please select a vehicle type.');
        return;
      }
            dispatch(setAuthLoading(true));


      const userId = auth().currentUser?.uid;
      if (!userId) throw new Error('User not logged in');

      const payload = {
        vehicleType,
        ...values,
        createdAt: new Date().toISOString(),
      };

      // Save to Redux
      dispatch(setVehicleDetails(payload));
      console.log('✅ Saved in Redux:', payload);

      // Save to Firebase
      await saveVehicleInfo(payload);

      dispatch(resetVehicleInfo());

      Alert.alert('Success', 'Vehicle information saved!');

      navigation.reset({
        index: 0,
        routes: [{name: 'DriverMapScreen'}],
      });
    } catch (error) {
      console.error('❌ Error saving vehicle info:', error);
      Alert.alert('Error', 'Could not save vehicle info.');
    }finally {
      dispatch(setAuthLoading(false));
    }
  };
  if (isLoading) {
    return <LoaderScreen />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.heading}>Vehicle information</Text>

        <Formik
          initialValues={{
            model: '',
            brand: '',
            color: '',
            plateNumber: '',
            images: {
              certificateFront: null,
              certificateBack: null,
              vehiclePhoto: null,
            },
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({
            handleChange,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <>
              {/* Images */}
              <View style={styles.imageRow}>
                {[
                  {key: 'certificateFront', label: 'Vehicle certificate'},
                  {
                    key: 'certificateBack',
                    label: 'Back side of vehicle certificate',
                  },
                  {key: 'vehiclePhoto', label: 'Photo of your vehicle'},
                ].map(({key, label}) => (
                  <View key={key} style={styles.imageBox}>
                    <TouchableOpacity
                      onPress={() =>
                        handlePickImage(key as keyof ImageMap, setFieldValue)
                      }>
                      {values.images[key as keyof ImageMap] ? (
                        <Image
                          source={{uri: values.images[key as keyof ImageMap]!}}
                          style={styles.image}
                        />
                      ) : (
                        <View style={styles.placeholder}>
                          <Icon name="add" size={30} color="#888" />
                        </View>
                      )}
                    </TouchableOpacity>
                    {values.images[key as keyof ImageMap] && (
                      <TouchableOpacity
                        style={styles.removeIcon}
                        onPress={() =>
                          handleRemoveImage(
                            key as keyof ImageMap,
                            setFieldValue,
                          )
                        }>
                        <Icon name="close" size={16} color="#fff" />
                      </TouchableOpacity>
                    )}
                    <Text style={styles.imageLabel}>{label}</Text>
                    {errors.images?.[key as keyof ImageMap] &&
                      touched.images?.[key as keyof ImageMap] && (
                        <Text style={styles.errorText}>
                          {errors.images[key as keyof ImageMap]}
                        </Text>
                      )}
                  </View>
                ))}
              </View>

              {/* Model */}
              <Text style={styles.label}>Vehicle model</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Corolla 2020"
                value={values.model}
                onChangeText={handleChange('model')}
              />
              {errors.model && touched.model && (
                <Text style={styles.errorText}>{errors.model}</Text>
              )}

              {/* Brand */}
              <Text style={styles.label}>Vehicle brand</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Toyota"
                value={values.brand}
                onChangeText={handleChange('brand')}
              />
              {errors.brand && touched.brand && (
                <Text style={styles.errorText}>{errors.brand}</Text>
              )}

              {/* Color */}
              <Text style={styles.label}>Vehicle color</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Black"
                value={values.color}
                onChangeText={handleChange('color')}
              />
              {errors.color && touched.color && (
                <Text style={styles.errorText}>{errors.color}</Text>
              )}

              {/* Plate Number */}
              <Text style={styles.label}>Number plate</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. ABC-123"
                value={values.plateNumber}
                onChangeText={handleChange('plateNumber')}
              />
              {errors.plateNumber && touched.plateNumber && (
                <Text style={styles.errorText}>{errors.plateNumber}</Text>
              )}

              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => handleSubmit()}>
                <Text style={styles.nextText}>Save</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  content: {padding: 20},
  backButton: {marginTop: 20, marginBottom: 20},
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  imageBox: {
    width: '30%',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 6,
  },
  placeholder: {
    width: 90,
    height: 90,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  removeIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#0008',
    borderRadius: 10,
    padding: 2,
  },
  imageLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#e5e5e5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  nextButton: {
    backgroundColor: '#9C27B0',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VehicleInfoScreen;
