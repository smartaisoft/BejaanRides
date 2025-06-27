import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  onFindTrips: () => void;
}

const OnlinePanel: React.FC<Props> = ({ onFindTrips }) => (
  <View style={styles.container}>
    <View style={styles.handle} />
    <Text style={styles.onlineText}>You're Online</Text>
    <TouchableOpacity onPress={onFindTrips}>
      <Text style={styles.findingTrips}>Finding Trips</Text>
    </TouchableOpacity>
    <Text style={styles.subtitle}>More requests than usual</Text>
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
    marginBottom: 12,
  },
  onlineText: {
    color: '#9C27B0',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 12,
  },
  findingTrips: {
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
    color: '#000',
  },
  subtitle: {
    marginBottom: 16,
    fontSize: 14,
    color: '#444',
  },
});

export default OnlinePanel;
