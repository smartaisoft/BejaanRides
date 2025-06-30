import React from 'react';
import {Modal, View, StyleSheet, TouchableOpacity, Text} from 'react-native';

interface Props {
  visible: boolean;
  onRequest: () => void;
  onClose: () => void;
}

const VehicleSelectionModal: React.FC<Props> = ({visible, onRequest, onClose}) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.container}>
      <Text style={styles.title}>Select Vehicle</Text>
      {/* You can map vehicle list here */}
      <TouchableOpacity style={styles.button} onPress={onRequest}>
        <Text style={styles.buttonText}>Request Ride</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.close} onPress={onClose}>
        <Text style={styles.closeText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  title: {fontSize: 16, fontWeight: 'bold', marginBottom: 8},
  button: {
    backgroundColor: '#9C27B0',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {color: '#fff', textAlign: 'center'},
  close: {marginTop: 8},
  closeText: {textAlign: 'center', color: '#9C27B0'},
});

export default VehicleSelectionModal;
