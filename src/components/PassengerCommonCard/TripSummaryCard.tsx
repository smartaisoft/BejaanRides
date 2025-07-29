/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../themes/colors';
import LocationSearchModal from './LocationSearchModal';

export interface Stop {
  description: string;
  latitude: number;
  longitude: number;
}

interface Props {
  pickup: string;
  dropoff: string;
  distance?: string;
  duration?: string;
  fare?: number;
  onCancel: () => void;
  onNext: (stops: Stop[]) => void;
  loading?: boolean;
  additionalStops: Stop[]; // 👈 ADD THIS
  onStopsChange: (stops: Stop[]) => void; // ✅ ADD THIS
}

const TripSummaryCard: React.FC<Props> = ({
  pickup,
  dropoff,
  onCancel,
  onNext,
  loading,
  additionalStops = [],
  onStopsChange,
}) => {
  const stops = additionalStops;
  const setStops = (newStops: Stop[]) => onStopsChange(newStops);
  const [activeStopIndex, setActiveStopIndex] = useState<number | null>(null);

  const addStop = () => {
    if (stops.length < 5) {
      setStops([...stops, {description: '', latitude: 0, longitude: 0}]);
    }
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = (index: number, stop: Stop) => {
    const updated = [...stops];
    updated[index] = stop;
    setStops(updated);
  };

  return (
    <View style={styles.container}>
      <View style={styles.handle} />

      {/* Pickup */}
      <View style={styles.row}>
        <Icon name="checkbox-blank-circle" size={20} color={Colors.primary} />
        <View style={styles.textContainer}>
          <Text style={styles.label}>PICKUP</Text>
          <Text style={{color: Colors.textBlack}}>{pickup}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.verticalLine} />

      {/* Drop-off */}
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
      <View style={styles.verticalLine} />

      {stops.length > 0 && (
        <View style={styles.additionalStopsLabel}>
          <Text style={styles.additionalStopsText}>Additional Stops</Text>
        </View>
      )}

      <ScrollView style={styles.stopsContainer}>
        {stops.map((stop, index) => {
          const stopLabels = [
            'Add Your First Stop',
            'Add Your Second Stop',
            'Add Your Third Stop',
            'Add Your Fourth Stop',
            'Add Your Fifth Stop',
          ];
          const label = stopLabels[index] || `Stop ${index + 1}`;
          const isPlaceholder = !stop.description;

          return (
            <Pressable
              key={index}
              onPress={() => setActiveStopIndex(index)}
              style={styles.stopInputWrapper}>
              <Text
                style={[
                  styles.stopInput,
                  isPlaceholder && {color: '#999'}, // grey placeholder
                ]}>
                {stop.description || label}
              </Text>
              <Pressable
                onPress={() => removeStop(index)}
                style={styles.deleteIcon}>
                <Icon name="delete-outline" size={20} color="red" />
              </Pressable>
            </Pressable>
          );
        })}
      </ScrollView>

      {stops.length < 5 && (
        <View style={styles.addStopButton}>
          <Text style={styles.addStopText}>Add additional stop</Text>
          <Pressable onPress={addStop}>
            <View style={styles.plusCircle}>
              <Icon name="plus" size={20} color={Colors.textWhite} />
            </View>
          </Pressable>
        </View>
      )}

      <TouchableOpacity
        style={[styles.nextButton, loading && styles.nextButtonDisabled]}
        onPress={() => onNext(stops)}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.nextButtonText}>Next</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={activeStopIndex !== null}
        animationType="slide"
        transparent>
        <View style={styles.fullScreenModal}>
          <LocationSearchModal
            visible={true}
            onSelect={location => {
              if (activeStopIndex !== null) {
                updateStop(activeStopIndex, location);
                setActiveStopIndex(null);
              }
            }}
            onClose={() => setActiveStopIndex(null)}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 70,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    elevation: 5,
  },
  handle: {
    width: 50,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
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
    fontSize: 15,
    color: '#1b1b1b',
    fontWeight: '500',
  },
  verticalLine: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  cancelButton: {
    padding: 4,
  },
  stopsContainer: {
    maxHeight: 160,
  },
  stopInputWrapper: {
    borderBottomWidth: 2,
    borderColor: '#ccc',
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 6,
  },
  deleteIcon: {
    marginLeft: 10,
  },
  addStopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginTop: 12,
  },
  addStopText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  additionalStopsLabel: {
    marginTop: 12,
    marginBottom: 8,
    paddingLeft: 4,
  },
  additionalStopsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  plusCircle: {
    backgroundColor: '#19AF18',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: '#19AF18',
    paddingVertical: 8,
    borderRadius: 30,
    marginTop: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  fullScreenModal: {
    flex: 1,
  },
});

export default TripSummaryCard;
