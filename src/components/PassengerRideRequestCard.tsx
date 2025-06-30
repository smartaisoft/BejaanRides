// components/BottomCard/PassengerRideRequestCard.tsx
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RideData } from '../redux/types/driverTypes';

interface Props {
  ride: RideData;
  onAccept: () => void;
  onReject: () => void;
}

const PassengerRideRequestCard: React.FC<Props> = ({
  ride,
  onAccept,
  onReject,
}) => (
  <View style={styles.container}>
    <View style={styles.row}>
      <Image
        source={require('../../assets/images/DriverAvatar.png')}
        style={styles.avatar}
      />
      <View style={{flex: 1, marginHorizontal: 10}}>
        <Text style={styles.name}>{ride.riderName}</Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={16} color="#FFC107" />
          <Text style={styles.rating}>4.9</Text>
        </View>
      </View>
      <View style={styles.timeDistance}>
        <Text style={styles.timeText}>25 min</Text>
        <Text style={styles.distanceText}>
          {ride.distance != null
            ? `${ride.distance.toFixed(1)} km`
            : ride.distance ?? 'Distance N/A'}
        </Text>
      </View>
    </View>

    <View style={styles.buttonsRow}>
      <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
        <Text style={styles.rejectText}>Reject</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
        <Text style={styles.acceptText}>Tap to Accept</Text>
      </TouchableOpacity>
    </View>
  </View>
);


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 12,
    elevation: 3,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
  },
  ratingRow: {flexDirection: 'row', alignItems: 'center'},
  rating: {marginLeft: 4, fontSize: 12, color: '#888'},
  timeDistance: {alignItems: 'flex-end'},
  timeText: {fontWeight: '500', fontSize: 14},
  distanceText: {fontSize: 12, color: '#777'},
  buttonsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#E1D7EE',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#9C27B0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectText: {
    color: '#333',
    fontWeight: '500',
  },
  acceptText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default PassengerRideRequestCard;
