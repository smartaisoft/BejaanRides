import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Colors from '../../themes/colors';

interface BookingSuccessModalProps {
  visible: boolean;
  onDone: () => void;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({visible, onDone}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image
            source={require('../../../assets/images/check-circle.png')} // ✅ Add a green check icon to this path
            style={styles.icon}
          />
          <Text style={styles.title}>Booking Successful</Text>
          <Text style={styles.subtitle}>
            Your booking has been confirmed. {'\n'}Driver will pickup you in 2 minutes.
          </Text>
          <View style={styles.footer}>
            <Text style={styles.cancelText}>Cancel</Text>
            <TouchableOpacity onPress={onDone}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: 320,
    padding: 24,
    alignItems: 'center',
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 16,
    color: '#ccc',
  },
  doneText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default BookingSuccessModal;
