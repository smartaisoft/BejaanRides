import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RideData} from '../redux/types/driverTypes';
import Colors from '../themes/colors';

interface Props {
  ride: RideData;
  passengerFare: number;
  onAccept: (customFare: number) => void;
  onReject: () => void;
}

const PassengerRideRequestCard: React.FC<Props> = ({
  ride,
  passengerFare,
  onAccept,
  onReject,
}) => {
  const [customFare, setCustomFare] = useState(
    String(passengerFare ?? ride.fareEstimate ?? ''),
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          source={require('../../assets/images/DriverAvatar.png')}
          style={styles.avatar}
        />
        <View style={{flex: 1, marginHorizontal: 10}}>
          <Text style={styles.name}>
            {ride.passengerName ?? ride.riderName ?? 'Unknown Passenger'}
          </Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#FFC107" />
            <Text style={styles.rating}>5.0</Text>
          </View>

          <Text style={styles.fareLabel}>Set Your Fare</Text>
          <View style={styles.inputWrapper}>
            <Icon
              name="attach-money"
              size={20}
              color={Colors.primary}
              style={{marginRight: 4}}
            />
            <TextInput
              style={styles.fareInput}
              keyboardType="numeric"
              value={customFare}
              onChangeText={setCustomFare}
              placeholder={`e.g. ${ride.fareEstimate}`}
              placeholderTextColor="#aaa"
            />
          </View>
          <Text style={styles.helperText}>
            You can offer a different fare if needed
          </Text>
        </View>
        <View style={styles.timeDistance}>
          <Text style={styles.timeText}>{ride.durationText ?? 'ETA N/A'}</Text>
          <Text style={styles.distanceText}>
            {ride.distanceText ?? 'Distance N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <Text style={styles.rejectText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => onAccept(Number(customFare))}>
          <Text style={styles.acceptText}>Send Offer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
    fontSize: 14,
  },
  fareLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginTop: 8,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    // paddingVertical: 0,
    marginTop: 6,
  },

  fareInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },

  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  buttonsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: Colors.primary,
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
