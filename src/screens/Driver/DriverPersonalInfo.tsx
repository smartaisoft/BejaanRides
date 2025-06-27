import React, {useState} from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {DriverStackParamList} from '../../navigation/DriverStack';

type DriverPersonalInfoNavigationProp = StackNavigationProp<
  DriverStackParamList,
  'DriverPersonalInfo'
>;

const DriverPersonalInfo = () => {
  const navigation = useNavigation<DriverPersonalInfoNavigationProp>();

  const [licenseNumber, setLicenseNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [images, setImages] = useState<
    Record<'profile' | 'license' | 'selfie', string | null>
  >({
    profile: null,
    license: null,
    selfie: null,
  });

  const pickImage = (key: 'profile' | 'license' | 'selfie') => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (
        !response.didCancel &&
        !response.errorCode &&
        response.assets?.[0]?.uri
      ) {
        const uri = response.assets[0].uri;
        setImages(prev => ({...prev, [key]: uri}));
      }
    });
  };

  const removeImage = (key: 'profile' | 'license' | 'selfie') => {
    setImages(prev => ({...prev, [key]: null}));
  };

  const handleNext = () => {
    // Optional: Add validation here
    navigation.navigate('ChooseVehicleScreen');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Personal information</Text>

        <View style={styles.imageRow}>
          {(['profile', 'license', 'selfie'] as const).map(key => (
            <View style={styles.imageBox} key={key}>
              <TouchableOpacity onPress={() => pickImage(key)}>
                {images[key] ? (
                  <Image source={{uri: images[key]!}} style={styles.image} />
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
                  onPress={() => removeImage(key)}>
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
  container: {flex: 1, backgroundColor: '#fff'},
  scrollContent: {padding: 20},
  backButton: {
    marginBottom: 20,
    marginTop: 50,
  },
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
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
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
