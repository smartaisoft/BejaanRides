import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { DriverStackParamList } from '../../navigation/DriverStack';
import { useDispatch } from 'react-redux';
import { setDriverPersonalInfo } from '../../redux/actions/vehicleActions';
import { AppDispatch } from '../../redux/store';
import auth from '@react-native-firebase/auth';
import { updateUser, getUserByUid } from '../../services/realTimeUserService';

type DriverPersonalInfoNavigationProp = StackNavigationProp<
  DriverStackParamList,
  'DriverPersonalInfo'
>;

const DriverPersonalInfo = () => {
  const navigation = useNavigation<DriverPersonalInfoNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const [licenseNumber, setLicenseNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [images, setImages] = useState<
    Record<'profile' | 'license' | 'selfie', string | null>
  >({
    profile: null,
    license: null,
    selfie: null,
  });

  // Load existing driver info on mount
  useEffect(() => {
    loadExistingDriverInfo();
  }, []);

  /**
   * Load driver info from Realtime DB if exists
   */
  const loadExistingDriverInfo = async () => {
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) throw new Error('User not logged in');

      const userData = await getUserByUid(uid);
      if (userData?.driverInfo) {
        console.log('✅ Loaded existing driver info:', userData.driverInfo);
        setLicenseNumber(userData.driverInfo.licenseNumber || '');
        setExpirationDate(userData.driverInfo.expirationDate || '');
        setImages({
          profile: userData.driverInfo.images?.profile || null,
          license: userData.driverInfo.images?.license || null,
          selfie: userData.driverInfo.images?.selfie || null,
        });
      } else {
        console.log('ℹ️ No existing driver info found.');
      }
    } catch (error) {
      console.error('❌ Failed to load driver info:', error);
    }
  };

  /**
   * Handle image selection
   */
  const pickImage = (key: 'profile' | 'license' | 'selfie') => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode && response.assets?.[0]?.uri) {
        const uri = response.assets[0].uri;
        setImages(prev => ({ ...prev, [key]: uri }));
      }
    });
  };

  /**
   * Remove selected image
   */
  const removeImage = (key: 'profile' | 'license' | 'selfie') => {
    setImages(prev => ({ ...prev, [key]: null }));
  };

  /**
   * Save info to Redux + Realtime DB
   */
  const handleNext = async () => {
    try {
      const uid = auth().currentUser?.uid;
      if (!uid) throw new Error('User not logged in');

      const payload = {
        licenseNumber,
        expirationDate,
        images,
      };

      console.log('✅ Saving driver info to Redux:', payload);
      dispatch(setDriverPersonalInfo(payload));

      console.log('✅ Saving driver info to Realtime Database...');
      await updateUser(uid, { driverInfo: payload });

      console.log('✅ Driver info saved successfully!');
      navigation.navigate('ChooseVehicleScreen');
    } catch (error) {
      console.error('❌ Failed to save driver info:', error);
      Alert.alert('Error', 'Could not save your information.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Personal information</Text>

        <View style={styles.imageRow}>
          {(['profile', 'license', 'selfie'] as const).map(key => (
            <View style={styles.imageBox} key={key}>
              <TouchableOpacity onPress={() => pickImage(key)}>
                {images[key] ? (
                  <Image source={{ uri: images[key]! }} style={styles.image} />
                ) : (
                  <View style={styles.placeholder}>
                    <Icon name="add" size={30} color="#888" />
                    <Text style={styles.placeholderText}>
                      {key === 'profile'
                        ? 'Upload picture'
                        : key === 'license'
                        ? 'Driver license'
                        : 'Selfie with license'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {images[key] && (
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => removeImage(key)}
                >
                  <Icon name="close" size={18} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="License number"
          placeholderTextColor="#888"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Expiration date"
          placeholderTextColor="#888"
          value={expirationDate}
          onChangeText={setExpirationDate}
        />

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  backButton: { marginBottom: 20, marginTop: 50 },
  title: {
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
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderWidth: 1.5,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  placeholderText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 16,
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 2,
  },
  input: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#9b2fc2',
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

export default DriverPersonalInfo;
