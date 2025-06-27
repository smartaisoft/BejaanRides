import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {RideData} from '../../redux/types/driverTypes';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  ride: RideData;
  onAccept: () => void;
    onReject?: () => void; // <-- Add this line

}

const RideRequestCard: React.FC<Props> = ({ride, onAccept}) => (
  <View style={styles.container}>
    <View style={styles.handle} />

    <Text style={styles.etaText}>25 min</Text>

    <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
      <Text style={styles.acceptButtonText}>Tap to Accept</Text>
    </TouchableOpacity>

    <View style={styles.infoRow}>
      <View style={styles.infoItem}>
        <Icon name="attach-money" size={20} color="#9C27B0" />
        <Text style={styles.infoValue}>RS:{ride.fare.toFixed(0)}</Text>
        <Text style={styles.infoLabel}>Cash</Text>
      </View>
      <View style={styles.infoItem}>
        <Icon name="star" size={20} color="#9C27B0" />
        <Text style={styles.infoValue}>2.50</Text>
        <Text style={styles.infoLabel}>Rating</Text>
      </View>
      <View style={styles.infoItem}>
        <Icon name="close" size={20} color="#9C27B0" />
        <Text style={styles.infoValue}>{ride.distance.toFixed(1)} km</Text>
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
  etaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  acceptButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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

export default RideRequestCard;
