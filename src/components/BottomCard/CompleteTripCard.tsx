// src/components/BottomCard/CompleteTripCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  onComplete: () => void;
}

const CompleteTripCard: React.FC<Props> = ({ onComplete }) => (
  <View style={styles.container}>
    <View style={styles.handle} />
    <TouchableOpacity style={styles.button} onPress={onComplete}>
      <Text style={styles.buttonText}>Complete</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#9C27B0',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 50,
    width: '90%',
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CompleteTripCard;
