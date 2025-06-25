// components/ConfirmRideButton.tsx

import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

type Props = {
  selectedVehicle: string;
};

const ConfirmRideButton: React.FC<Props> = ({ selectedVehicle }) => {
  const handleConfirm = () => {
    Alert.alert('Ride Confirmed', `Vehicle: ${selectedVehicle}`);
  };

  return (
    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
      <Text style={styles.confirmText}>Confirm Ride</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 30,
    zIndex: 10,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ConfirmRideButton;
