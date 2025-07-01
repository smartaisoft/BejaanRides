import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';

interface Props {
  driver: {
    name: string;
    phone: string;
    vehicleName: string;
    vehicleColor: string;
    vehicleNumber: string;
    rating: number;
    avatarUrl?: string;
  };
  onClose: () => void;
}

const DriverArrivedCard: React.FC<Props> = ({driver, onClose}) => {
  return (
    <View style={styles.container}>
      {/* Close Button */}
      {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity> */}

      {/* Driver Info */}
      <View style={styles.header}>
        {driver.avatarUrl ? (
          <Image source={{uri: driver.avatarUrl}} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{driver.name[0]}</Text>
          </View>
        )}

        <View style={styles.driverInfo}>
          <Text style={styles.name}>{driver.name}</Text>
        </View>
      </View>

      {/* Message */}
      <Text style={styles.message}>
        I’m here! Please come to the pickup location.
      </Text>

      {/* <View style={styles.vehicleContainer}>
        <Text style={styles.vehicle}>
          {driver.vehicleColor} {driver.vehicleName}
        </Text>
        <Text style={styles.vehicleNumber}>{driver.vehicleNumber}</Text>
      </View> */}

      {/* Call Driver */}
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => Linking.openURL(`tel:${driver.phone}`)}>
        <Text style={styles.callButtonText}>📞 Call Driver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    padding: 4,
  },
  closeText: {
    fontSize: 22,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#9b2fc2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  driverInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  rating: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  message: {
    fontSize: 15,
    color: '#444',
    marginBottom: 16,
    alignSelf: 'center',
  },
  vehicleContainer: {
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicle: {
    fontSize: 15,
    color: '#333',
  },
  vehicleNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DriverArrivedCard;
