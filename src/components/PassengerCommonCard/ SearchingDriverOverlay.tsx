import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Colors from '../../themes/colors';

interface Props {
  onCancel: () => void;
}

const SearchingDriverOverlay: React.FC<Props> = ({ onCancel }) => (
  <View style={styles.overlay}>
    <View style={styles.card}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.text}>Searching for nearby drivers...</Text>
      <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  cancelButton: {
    marginTop: 16,
  },
  cancelText: {
    color: '#9C27B0',
    fontWeight: '600',
  },
});

export default SearchingDriverOverlay;
