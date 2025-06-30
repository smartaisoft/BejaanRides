import React, {useState} from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface VehicleOption {
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
}

const vehicleOptions: VehicleOption[] = [
  {
    id: '1',
    type: 'Just go',
    price: 'RS:450',
    eta: '2 min',
    distance: 'Near by you',
    icon: 'car',
  },
  {
    id: '2',
    type: 'Limousine',
    price: 'RS:800',
    eta: '5 min',
    distance: '0.2 km',
    icon: 'car-limousine',
  },
  {
    id: '3',
    type: 'Luxury',
    price: 'RS:1200',
    eta: '3 min',
    distance: '0.4 km',
    icon: 'car-convertible',
  },
  {
    id: '4',
    type: 'ElectricCar',
    price: 'RS:600',
    eta: '2 min',
    distance: '0.45 km',
    icon: 'car-electric',
  },
];

const categories = ['All', 'Car', 'Bike', 'Riksha', 'Pickup'];

const VehicleSelectionModal: React.FC<Props> = ({
  visible,
  onRequest,
  onClose,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('1');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />
          <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 12}}>
            Select Vehicle
          </Text>

          {/* Categories */}
          <View style={styles.categories}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
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
            ))}
          </View>

          {/* Vehicle List */}
          <FlatList
            data={vehicleOptions}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.vehicleRow,
                  selectedVehicle === item.id && styles.vehicleRowSelected,
                ]}
                onPress={() => setSelectedVehicle(item.id)}>
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

          {/* Drivers viewed */}
          <View style={styles.driversContainer}>
            <View style={styles.avatars}>
              {[
                'https://randomuser.me/api/portraits/men/1.jpg',
                'https://randomuser.me/api/portraits/men/2.jpg',
                'https://randomuser.me/api/portraits/men/3.jpg',
              ].map((url, index) => (
                <Image
                  key={index}
                  source={{uri: url}}
                  style={[styles.avatar, {marginLeft: index === 0 ? 0 : -12}]}
                />
              ))}
            </View>
            <Text style={styles.driversText}>
              3 drivers viewed your request
            </Text>
          </View>

          {/* Actions */}
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
  categories: {
    flexDirection: 'row',
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
});

export default VehicleSelectionModal;
