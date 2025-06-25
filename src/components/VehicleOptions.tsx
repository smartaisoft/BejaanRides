// components/VehicleOptions.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { VehicleOption } from '../utils/types';

type Props = {
  vehicles: VehicleOption[];
  selectedVehicle: string | null;
  onSelect: (id: string) => void;
};

const VehicleOptions: React.FC<Props> = ({ vehicles, selectedVehicle, onSelect }) => {
  return (
    <View style={styles.vehicleCard}>
      <Text style={styles.vehicleTitle}>Choose a Vehicle</Text>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelect(item.id)}
            style={[
              styles.vehicleOption,
              selectedVehicle === item.id && styles.vehicleSelected,
            ]}
          >
            <Icon
              name={item.icon}
              size={28}
              color={selectedVehicle === item.id ? '#fff' : '#333'}
            />
            <View style={styles.vehicleTextContainer}>
              <Text style={styles.vehicleName}>{item.name}</Text>
              <Text style={styles.vehicleDetails}>
                {item.time} • {item.distance}
              </Text>
            </View>
            <Text style={styles.vehiclePrice}>Rs: {item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  vehicleCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  vehicleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  vehicleSelected: {
    backgroundColor: '#9b2fc2',
    borderRadius: 8,
  },
  vehicleTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  vehicleName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  vehicleDetails: {
    fontSize: 12,
    color: '#666',
  },
  vehiclePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default VehicleOptions;
