import React, {useEffect, useState, useRef} from 'react';
import {
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  Alert,
  TextInput,
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

const categories = ['All', 'Car', 'Bike', 'Rikhsha', 'Pickup'];

const categoryTypeMap: Record<string, string[]> = {
  All: ['Bike', 'Car', 'Limousine', 'Luxury', 'ElectricCar'],
  Car: ['Car', 'Limousine', 'Luxury', 'ElectricCar'],
  Bike: ['Bike'],
  Rikhsha: ['Rikhsha'],
  Pickup: ['Pickup'],
};

const VehicleSelectionSheet: React.FC<Props> = ({
  visible,
  onRequest,
  onSelectVehicle,
  routeInfo,
  onClose,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleOption | null>(
    null,
  );
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [editingFare, setEditingFare] = useState<boolean>(false);
  const [customFare, setCustomFare] = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim, visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });
  const getFareRange = (vehicle: VehicleOption) => {
    // For example, allow +/- 20% flexibility
    const baseFare = parseInt(vehicle.price.replace('RS:', ''));
    return {
      min: Math.floor(baseFare * 0.8),
      max: Math.ceil(baseFare * 1.2),
    };
  };

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
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.sheetContainer, {transform: [{translateY}]}]}>
      <View style={styles.sheet}>
        {/* Back Button */}
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Icon name="arrow-left" size={28} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>Vehicle category</Text>

        {/* Categories */}
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

        {/* Vehicles */}
        <FlatList
          data={getVehicleOptions().filter(v =>
            categoryTypeMap[activeCategory]?.includes(v.type),
          )}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.vehicleRow,
                selectedVehicle?.id === item.id && styles.vehicleRowSelected,
              ]}
              onPress={() => {
                setSelectedVehicle(item);
                onSelectVehicle(item);
              }}>
              <Icon
                name={item.icon}
                size={28}
                color={selectedVehicle?.id === item.id ? '#fff' : '#333'}
              />
              <View style={styles.vehicleInfo}>
                <Text
                  style={[
                    styles.vehicleType,
                    selectedVehicle?.id === item.id && {color: '#fff'},
                  ]}>
                  {item.type}
                </Text>
              </View>
              <View style={styles.vehiclePrice}>
                <Text
                  style={[
                    styles.priceText,
                    selectedVehicle?.id === item.id && {color: '#fff'},
                  ]}>
                  {item.price}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Selected Fare Box */}
        {selectedVehicle && (
          <View style={styles.fareBox}>
            <View style={styles.fareLeft}>
              <Icon name={selectedVehicle.icon} size={28} color="#000" />
              <Text style={styles.fareVehicle}>{selectedVehicle.type}</Text>
            </View>
            <View style={styles.fareRight}>
              {editingFare ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                    style={styles.fareInput}
                    value={
                      customFare ?? selectedVehicle.price.replace('RS:', '')
                    }
                    keyboardType="numeric"
                    onChangeText={setCustomFare}
                    placeholder="Enter fare"
                  />
                  <TouchableOpacity
                    onPress={() => {
                      const {min, max} = getFareRange(selectedVehicle);
                      const fareNumber = parseInt(customFare ?? '0');

                      if (
                        isNaN(fareNumber) ||
                        fareNumber < min ||
                        fareNumber > max
                      ) {
                        Alert.alert(
                          'Invalid Fare',
                          `Please enter a fare between RS:${min} and RS:${max}.`,
                        );
                        return;
                      }

                      setEditingFare(false);
                      setSelectedVehicle({
                        ...selectedVehicle,
                        price: `RS:${fareNumber}`,
                      });
                    }}>
                    <Icon name="check" size={22} color="#4CAF50" />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <Text style={styles.fareText}>
                    Recommended fare: {selectedVehicle.price}
                  </Text>
                  <TouchableOpacity onPress={() => setEditingFare(true)}>
                    <Icon name="pencil" size={20} color="#333" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={styles.requestButton}
          onPress={onRequest}
          disabled={!selectedVehicle}>
          <Text style={styles.requestText}>Find Offers</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 4,
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
    backgroundColor: '#000',
    borderColor: '#000',
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
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  vehicleRowSelected: {
    backgroundColor: '#4CAF50',
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
  fareBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    marginTop: 12,
  },
  fareLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareVehicle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fareRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fareText: {
    fontSize: 14,
    marginRight: 8,
  },
  requestButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  requestText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  fareInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    width: 80,
    marginRight: 8,
    fontSize: 14,
  },
});

export default VehicleSelectionSheet;
