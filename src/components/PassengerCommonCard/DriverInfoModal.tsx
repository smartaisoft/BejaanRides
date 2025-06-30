import React from 'react';
import {Modal, View, StyleSheet, Text, TouchableOpacity} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const DriverInfoModal: React.FC<Props> = ({visible, onClose}) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.container}>
      <Text style={styles.title}>Driver Information</Text>
      {/* Fill with driver data */}
      <Text>Name: Driver Name</Text>
      <Text>Vehicle: Toyota Black AAA-123</Text>
      <Text>Distance: 2 km</Text>
      <Text>Price: Rs450</Text>
      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>Done</Text>
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
});

export default DriverInfoModal;
