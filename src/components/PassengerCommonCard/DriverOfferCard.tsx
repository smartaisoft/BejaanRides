import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  driver: {
    name: string;
    avatarUrl?: string;
    rating: number;
    totalRides: number;
    vehicleName: string;
    fare: number;
    eta: string;
    distance: string;
  };
  onAccept: () => void;
  onReject: () => void;
}

const DriverOfferCard: React.FC<Props> = ({driver, onAccept, onReject}) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Avatar */}
        <Image
          source={
            driver.avatarUrl
              ? {uri: driver.avatarUrl}
              : require('../../../assets/images/Avatar.png')
          }
          style={styles.avatar}
        />

        {/* Info Section */}
        <View style={{flex: 1, marginHorizontal: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.name}>Driver name</Text>
            <Icon name="star" size={16} color="#FFC107" style={{marginLeft: 6}} />
            <Text style={styles.rating}>{driver.rating}</Text>
            <Text style={styles.rides}> ({driver.totalRides} rides)</Text>
          </View>
          <Text style={styles.vehicle}>{driver.vehicleName}</Text>
          <Text style={styles.fare}>PKR{driver.fare}</Text>
        </View>

        {/* ETA & Distance */}
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.eta}>{driver.eta}</Text>
          <Text style={styles.distance}>{driver.distance}</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.rejectBtn} onPress={onReject}>
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptBtn} onPress={onAccept}>
          <Text style={styles.acceptText}>Tap to Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    borderRadius: 12,
    padding: 14,
    elevation: 4,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
  },
  rating: {
    fontSize: 13,
    color: '#000',
    marginLeft: 2,
  },
  rides: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  vehicle: {
    fontSize: 13,
    color: '#333',
    marginTop: 4,
  },
  fare: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 4,
  },
  eta: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  distance: {
    fontSize: 12,
    color: '#777',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#D5F5D5',
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  rejectText: {
    color: '#444',
    fontWeight: '500',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#19AF18',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  acceptText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default DriverOfferCard;
