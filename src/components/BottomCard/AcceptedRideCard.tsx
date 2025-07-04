import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../themes/colors';

interface Props {
  eta: string;
  fare: number;
  rating: number;
  distance: number;
  onStart: () => void;
}


const StartTripCard: React.FC<Props> = ({ eta, fare, rating, distance, onStart }) => (
  <View style={styles.container}>
    <View style={styles.handle} />
    <Text style={styles.eta}>{eta}</Text>
    <TouchableOpacity style={styles.button} onPress={onStart}>
      <Text style={styles.buttonText}>Go</Text>
    </TouchableOpacity>
    <View style={styles.infoRow}>
      <View style={styles.infoItem}>
        <Icon name="cash" size={20} color={Colors.primary} />
        <Text style={styles.infoValue}>RS:{fare}</Text>
        <Text style={styles.infoLabel}>Cash</Text>
      </View>
      <View style={styles.infoItem}>
        <Icon name="star" size={20} color={Colors.primary} />
        <Text style={styles.infoValue}>{rating}</Text>
        <Text style={styles.infoLabel}>Rating</Text>
      </View>
      <View style={styles.infoItem}>
        <Icon name="map-marker-distance" size={20} color={Colors.primary} />
        <Text style={styles.infoValue}>{distance}</Text>
        <Text style={styles.infoLabel}>Ride</Text>
      </View>
    </View>
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
  eta: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
    color: '#000',
  },
  button: {
    backgroundColor:Colors.primary,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 50,
    width: '90%',
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
});

export default StartTripCard;
