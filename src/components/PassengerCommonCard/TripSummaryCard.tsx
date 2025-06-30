import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  pickup: string;
  dropoff: string;
  distance?: string;
  duration?: string;
  fare?: number; // 👈 add this
  onCancel: () => void;
  onNext: () => void;
}

const TripSummaryCard: React.FC<Props> = ({
  pickup,
  dropoff,
  distance,
  duration,
  onCancel,
  onNext,
  fare,
}) => (
  <View style={styles.container}>
    {/* Handle */}
    <View style={styles.handle} />

    {/* Next Button */}
    <TouchableOpacity style={styles.nextButton} onPress={onNext}>
      <Text style={styles.nextButtonText}>Next</Text>
    </TouchableOpacity>

    {/* Pickup Row */}
    <View style={styles.row}>
      <Icon
        name="circle-slice-8"
        size={20}
        color="#9C27B0"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.label}>PICKUP</Text>
        <Text style={styles.location}>{pickup}</Text>
      </View>
    </View>

    {/* Divider */}
    <View style={styles.divider} />

    {/* Drop-off Row */}
    <View style={styles.row}>
      <Icon name="map-marker" size={20} color="#F44336" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.label}>DROP-OFF</Text>
        <Text style={styles.location}>{dropoff}</Text>
      </View>
      <Pressable onPress={onCancel} style={styles.cancelButton}>
        <Icon name="close-circle-outline" size={20} color="#999" />
      </Pressable>
    </View>

    {/* Distance & Duration */}
    {(distance || duration || fare) && (
      <View style={styles.infoRow}>
        {distance && duration && (
          <Text style={styles.infoText}>
            {distance} • {duration} to destination
          </Text>
        )}
        {fare !== undefined && (
          <Text style={styles.infoText}>Estimated Fare: Rs {fare}</Text>
        )}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 12,
  },
  nextButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#9C27B0',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
    marginTop: 4,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  cancelButton: {
    padding: 4,
  },
  infoRow: {
    marginTop: 8,
    backgroundColor: '#f3f3f3',
  },
  infoText: {
    fontSize: 13,
    color: '#555',
  },
});

export default TripSummaryCard;
