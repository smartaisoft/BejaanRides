import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../themes/colors';

interface Props {
  pickup: string;
  dropoff: string;
  distance?: string;
  duration?: string;
  fare?: number;
  onCancel: () => void;
  onNext: () => void;
  loading?: boolean;
}

const TripSummaryCard: React.FC<Props> = ({
  pickup,
  dropoff,
  distance,
  duration,
  onCancel,
  onNext,
  fare,
  loading,
}) => (
  <View style={styles.container}>
    {/* Handle */}
    <View style={styles.handle} />

    {/* Next Button */}
    <TouchableOpacity
      style={[styles.nextButton, loading && styles.nextButtonDisabled]}
      onPress={loading ? undefined : onNext}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={styles.nextButtonText}>Next</Text>
      )}
    </TouchableOpacity>

    {/* Pickup Row */}
    <View style={styles.row}>
      <Icon
        name="circle-slice-8"
        size={20}
        color={Colors.primary}
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              name="map-clock"
              size={16}
              color="#666"
              style={{marginRight: 6}}
            />
            <Text style={styles.infoText}>
              Distance {distance} • {duration} Route
            </Text>
          </View>
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
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  nextButtonDisabled: {
    opacity: 0.6,
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
    marginTop: 12,
    backgroundColor: '#f3f3f3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default TripSummaryCard;
