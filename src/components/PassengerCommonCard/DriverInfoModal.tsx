import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../themes/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  driver?: {
    name: string;
    phone: string;
    vehicleName: string;
    vehicleColor: string;
    vehicleNumber: string;
    rating?: number;
    avatarUrl?: string;
  };
  distance?: string;
  duration?: string;
  fare?: number;
  etaToPickup?: string;
  onOpen?: () => void
}

const DriverInfoPanel: React.FC<Props> = ({
  visible,
  onClose,
  driver,
  etaToPickup,
  distance,
  duration,
  fare,
  onOpen
}) => {
  if (!visible) return null;

  return (
    <View style={styles.panel}>
      <TouchableOpacity style={[styles.closeButton]} onPress={onClose}>
        <Icon name="chevron-down" size={40} color="black" />
      </TouchableOpacity>
      <View style={styles.topSection}>
        <Image
          source={{
            uri:
              driver?.avatarUrl ??
              'https://randomuser.me/api/portraits/men/1.jpg',
          }}
          style={styles.avatar}
        />
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>{driver?.name ?? 'Driver Name'}</Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>
              {driver?.rating?.toFixed(1) ?? '4.9'}
            </Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="message" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, {backgroundColor: Colors.primary}]}>
            <Icon name="phone" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.vehicleDetails}>
        <View style={styles.vehicleItem}>
          <Text style={styles.vehicleLabel}>Vehicle</Text>
          <Text style={styles.vehicleValue}>
            {driver?.vehicleName ?? 'N/A'}
          </Text>
        </View>
        <View style={styles.vehicleItem}>
          <Text style={styles.vehicleLabel}>Colour</Text>
          <Text style={styles.vehicleValue}>
            {driver?.vehicleColor ?? 'N/A'}
          </Text>
        </View>
        <View style={styles.vehicleItem}>
          <Text style={styles.vehicleLabel}>Number</Text>
          <Text style={styles.vehicleValue}>
            {driver?.vehicleNumber ?? 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <Icon name="car" size={32} color="#333" />
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>DISTANCE</Text>
          <Text style={styles.infoValue}>{distance ?? 'N/A'}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>TIME</Text>
          <Text style={styles.infoValue}>{duration ?? 'N/A'}</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>PRICE</Text>
          <Text style={styles.infoValue}>
            {fare != null ? `RS: ${fare}` : 'N/A'}
          </Text>
        </View>
      </View>

      <Text style={styles.arrivalButton}>
        <Text style={styles.arrivalText}>
          {etaToPickup
            ? `Driver will arrive in approx ${etaToPickup}`
            : 'Driver is on the way'}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 10,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignSelf: 'center',
  },
  vehicleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  vehicleItem: {
    alignItems: 'center',
    flex: 1,
  },
  vehicleLabel: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  vehicleValue: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoBlock: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  arrivalButton: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  arrivalText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default DriverInfoPanel;
