import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  tripsCompleted: number;
  rating: number;
  earnings: number;
}

const DriverStats: React.FC<Props> = ({ tripsCompleted, rating, earnings }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Your Stats</Text>
    <Text>Trips Completed: {tripsCompleted}</Text>
    <Text>Rating: {rating.toFixed(1)} ⭐</Text>
    <Text>Total Earnings: ${earnings.toFixed(2)}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
});

export default DriverStats;
