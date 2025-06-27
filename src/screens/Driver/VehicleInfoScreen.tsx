import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';

interface ImageMap {
  certificateFront: string | null;
  certificateBack: string | null;
  vehiclePhoto: string | null;
}

const VehicleInfoScreen: React.FC = () => {
  const [vehicleModel, setVehicleModel] = useState<string>('');
  const [vehicleBrand, setVehicleBrand] = useState<string>('');
  const [vehicleColor, setVehicleColor] = useState<string>('');
  const [plateNumber, setPlateNumber] = useState<string>('');
  const [images, setImages] = useState<ImageMap>({
    certificateFront: null,
    certificateBack: null,
    vehiclePhoto: null,
  });

  const pickImage = (key: keyof ImageMap): void => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode && response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImages(prev => ({ ...prev, [key]: uri || null }));
      }
    });
  };

  const removeImage = (key: keyof ImageMap): void => {
    setImages(prev => ({ ...prev, [key]: null }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.heading}>Vehicle information</Text>

        <View style={styles.imageRow}>
          {[
            { key: 'certificateFront', label: 'Vehicle certificate' },
            { key: 'certificateBack', label: 'Back side of vehicle certificate' },
            { key: 'vehiclePhoto', label: 'Photo of your vehicle' },
          ].map(({ key, label }) => (
            <View key={key} style={styles.imageBox}>
              <TouchableOpacity onPress={() => pickImage(key as keyof ImageMap)}>
                {images[key as keyof ImageMap] ? (
                  <Image
                    source={{ uri: images[key as keyof ImageMap] as string }}
                    style={styles.image}
                  />
                ) : (
                  <View style={styles.placeholder}>
                    <Icon name="add" size={30} color="#888" />
                  </View>
                )}
              </TouchableOpacity>
              {images[key as keyof ImageMap] && (
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => removeImage(key as keyof ImageMap)}
                >
                  <Icon name="close" size={16} color="#fff" />
                </TouchableOpacity>
              )}
              <Text style={styles.imageLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.label}>Vehicle model</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Corolla 2020"
          value={vehicleModel}
          onChangeText={setVehicleModel}
        />

        <Text style={styles.label}>Vehicle brand</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Toyota"
          value={vehicleBrand}
          onChangeText={setVehicleBrand}
        />

        <Text style={styles.label}>Vehicle color</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Black"
          value={vehicleColor}
          onChangeText={setVehicleColor}
        />

        <Text style={styles.label}>Number plate</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. ABC-123"
          value={plateNumber}
          onChangeText={setPlateNumber}
        />

        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20 },
  backButton: {marginTop:20 ,marginBottom: 20 },
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
    marginBottom: 15,
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
