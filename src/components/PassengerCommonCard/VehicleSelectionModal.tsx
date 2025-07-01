import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface VehicleOption {
  id: string;
  type: string;
  price: string;
  eta: string;
  distance: string;
  icon: string;
}

interface Props {
  visible: boolean;
  onRequest: () => void;
  onClose: () => void;
  onSelectVehicle: (vehicle: VehicleOption) => void;
  routeInfo: {
    distanceText: string;
    durationText: string;
  } | null;
}

const categories = ['All', 'Bike', 'Car', 'Limousine', 'Luxury', 'ElectricCar'];

const VehicleSelectionModal: React.FC<Props> = ({
  visible,
  onRequest,
  onClose,
  onSelectVehicle,
  routeInfo,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('1');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const getVehicleOptions = (): VehicleOption[] => {
    if (!routeInfo) return [];

    const distanceKm =
      parseFloat(routeInfo.distanceText.replace('km', '').trim()) || 0;
    const durationMin =
      parseInt(routeInfo.durationText.replace('min', '').trim()) || 0;

    return [
      {
        id: '1',
        type: 'Bike',
        price: `RS:${Math.round(50 + distanceKm * 20 + durationMin * 2)}`,
        eta: `${Math.max(1, Math.floor(durationMin * 0.8))} min`,
        distance: `${distanceKm.toFixed(1)} km`,
        icon: 'motorbike',
      },
      {
        id: '2',
        type: 'Car',
        price: `RS:${Math.round(100 + distanceKm * 40 + durationMin * 5)}`,
        eta: `${Math.max(2, Math.floor(durationMin * 1))} min`,
        distance: `${distanceKm.toFixed(1)} km`,
        icon: 'car',
      },
      {
        id: '3',
        type: 'Limousine',
        price: `RS:${Math.round(200 + distanceKm * 70 + durationMin * 8)}`,
        eta: `${Math.max(4, Math.floor(durationMin * 1.2))} min`,
        distance: `${distanceKm.toFixed(1)} km`,
        icon: 'car-limousine',
      },
      {
        id: '4',
        type: 'Luxury',
        price: `RS:${Math.round(250 + distanceKm * 90 + durationMin * 10)}`,
        eta: `${Math.max(3, Math.floor(durationMin * 1.1))} min`,
        distance: `${distanceKm.toFixed(1)} km`,
        icon: 'car-convertible',
      },
      {
        id: '5',
        type: 'ElectricCar',
        price: `RS:${Math.round(150 + distanceKm * 60 + durationMin * 6)}`,
        eta: `${Math.max(2, Math.floor(durationMin * 0.9))} min`,
        distance: `${distanceKm.toFixed(1)} km`,
        icon: 'car-electric',
      },
    ];
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 12}}>
            Select Vehicle
          </Text>

          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item}
            contentContainerStyle={styles.categories}
            renderItem={({item: cat}) => (
              <TouchableOpacity
                style={[
                  styles.categoryButton,
                  activeCategory === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setActiveCategory(cat)}>
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === cat && styles.categoryTextActive,
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            )}
          />

          <FlatList
            data={
              activeCategory === 'All'
                ? getVehicleOptions()
                : getVehicleOptions().filter(v => v.type === activeCategory)
            }
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.vehicleRow,
                  selectedVehicle === item.id && styles.vehicleRowSelected,
                ]}
                onPress={() => {
                  setSelectedVehicle(item.id);
                  onSelectVehicle(item);
                }}>
                <Icon name={item.icon} size={30} color="#333" />
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleType}>{item.type}</Text>
                  <Text style={styles.vehicleDetails}>{item.distance}</Text>
                </View>
                <View style={styles.vehiclePrice}>
                  <Text style={styles.priceText}>{item.price}</Text>
                  <Text style={styles.etaText}>{item.eta}</Text>
                </View>
              </TouchableOpacity>
            )}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel request</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.requestButton} onPress={onRequest}>
              <Text style={styles.requestText}>Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 12,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#9C27B0',
    borderColor: '#9C27B0',
  },
  categoryText: {
    fontSize: 13,
    color: '#333',
  },
  categoryTextActive: {
    color: '#fff',
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  vehicleRowSelected: {
    backgroundColor: '#f2e1f5',
    borderRadius: 8,
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 10,
  },
  vehicleType: {
    fontSize: 15,
    fontWeight: '500',
  },
  vehicleDetails: {
    fontSize: 12,
    color: '#888',
  },
  vehiclePrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
  },
  etaText: {
    fontSize: 12,
    color: '#666',
  },
  driversContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  avatars: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  driversText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelText: {
    color: '#9C27B0',
    fontWeight: '600',
  },
  requestButton: {
    backgroundColor: '#9C27B0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  requestText: {
    color: '#fff',
    fontWeight: '600',
  },
  categories: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
});

export default VehicleSelectionModal;
