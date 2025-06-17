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

const DriverPersonalInfo = () => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [images, setImages] = useState({
    profile: null,
    license: null,
    selfie: null,
  });

  const pickImage = async key => {
    ImagePicker.launchImageLibrary({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        const uri = response.assets[0].uri;
        setImages(prev => ({...prev, [key]: uri}));
      }
    });
  };

  const removeImage = key => {
    setImages(prev => ({...prev, [key]: null}));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Personal information</Text>

        <View style={styles.imageRow}>
          {['profile', 'license', 'selfie'].map(key => (
            <View style={styles.imageBox} key={key}>
              <TouchableOpacity onPress={() => pickImage(key)}>
                {images[key] ? (
                  <Image source={{uri: images[key]}} style={styles.image} />
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>
                      {key === 'profile'
                        ? 'Upload picture'
                        : key === 'license'
                        ? 'Driver license'
                        : 'Selfie with driver license'}
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

        <TouchableOpacity style={styles.nextButton}>
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
    marginTop:50,

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
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
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
