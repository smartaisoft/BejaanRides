import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, {
  Marker,
  Circle,
  PROVIDER_GOOGLE,
  Region,
  Polyline,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../../../assets/SVG/Menu';
import Locate from '../../../assets/SVG/Locate';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerParamList} from '../../navigation/DrawerNavigator';
import {
  getRouteDirections,
  Coordinate,
  RouteInfo,
} from '../../utils/directions';

const INITIAL_DELTA = {latitudeDelta: 0.015, longitudeDelta: 0.0121};
const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU';

const fetchPlaceSuggestions = async (query: string): Promise<any[]> => {
  if (!query.trim()) return [];
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&key=${GOOGLE_MAPS_API_KEY}`,
    );
    const data = await response.json();
    return data.status === 'OK' ? data.predictions : [];
  } catch (error) {
    console.error('Places API Error:', error);
    return [];
  }
};

type VehicleOption = {
  id: string;
  name: string;
  icon: string;
  price: number;
  time: string;
  distance: string;
};

const vehicles: VehicleOption[] = [
  {
    id: '1',
    name: 'Just go',
    icon: 'directions-car',
    price: 450,
    time: '2 min',
    distance: 'Nearby you',
  },
  {
    id: '2',
    name: 'Limousine',
    icon: 'airport-shuttle',
    price: 800,
    time: '5 min',
    distance: '0.2 km',
  },
  {
    id: '3',
    name: 'Luxury',
    icon: 'time-to-leave',
    price: 1200,
    time: '3 min',
    distance: '0.4 km',
  },
  {
    id: '4',
    name: 'ElectricCar',
    icon: 'electric-car',
    price: 600,
    time: '2 min',
    distance: '0.45 km',
  },
];

type DrawerNav = DrawerNavigationProp<DrawerParamList>;
type Coordinate = {latitude: number; longitude: number};

const LocationPick = () => {
  const navigation = useNavigation<DrawerNav>();
  const mapRef = useRef<MapView | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [pickupAddress, setPickupAddress] = useState(
    'Fetching current location...',
  );
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupCoords, setPickupCoords] = useState<Coordinate | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<Coordinate | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
  const [showVehicleOptions, setShowVehicleOptions] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      const coarse = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );
      return (
        fine === PermissionsAndroid.RESULTS.GRANTED ||
        coarse === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const reverseGeocode = async (
    latitude: number,
    longitude: number,
  ): Promise<string> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const data = await response.json();
      return data.status === 'OK'
        ? data.results[0]?.formatted_address || 'Unknown location'
        : 'No address found';
    } catch {
      return 'Reverse geocoding error';
    }
  };

  const getCurrentLocation = useCallback(async () => {
    if (!(await requestPermissions())) return;
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        const newRegion = {latitude, longitude, ...INITIAL_DELTA};
        setRegion(newRegion);
        setPickupCoords({latitude, longitude});
        const address = await reverseGeocode(latitude, longitude);
        setPickupAddress(address);
        mapRef.current?.animateToRegion(newRegion, 1000);
      },
      err => console.error('Location Error:', err),
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 6000,
        distanceFilter: 0,
      },
    );
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const allLocations = await getAllLocations();
        setLocations(allLocations);
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
      getCurrentLocation();
    };
    init();
  }, [getCurrentLocation]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (pickupCoords && dropoffCoords) {
        const result = await getRouteDirections(pickupCoords, dropoffCoords);
        if (result) {
          setRouteCoords(result.path);
          setDistanceKm(result.distanceKm);
          setDuration(result.durationText);
        }
      }
    };
    fetchRoute();
  }, [pickupCoords, dropoffCoords]);

  const onSelectDropoff = async (item: any) => {
    if (item.isGooglePlace) {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.id}&key=${GOOGLE_MAPS_API_KEY}`,
      );
      const data = await res.json();
      const loc = data.result.geometry.location;
      const coords = {latitude: loc.lat, longitude: loc.lng};
      setDropoffCoords(coords);
      setDropoffAddress(data.result.formatted_address);
      setSearchText(data.result.formatted_address);
      mapRef.current?.animateToRegion({...coords, ...INITIAL_DELTA}, 1000);
    }
  };

  const handleMapPress = async (event: any) => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setDropoffCoords({latitude, longitude});
    const address = await reverseGeocode(latitude, longitude);
    setDropoffAddress(address);
    setSearchText(address);
  };

  const filterSuggestions = async (text: string) => {
    setSearchText(text);
    const results = await fetchPlaceSuggestions(text);
    setFilteredSuggestions(
      results.map(item => ({
        id: item.place_id,
        name: item.description,
        isGooglePlace: true,
      })),
    );
  };

  const canProceed = pickupCoords && dropoffCoords;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.drawerButton}>
        <Menu width={28} height={25} />
      </TouchableOpacity>

      {region && (
        <MapView
          ref={mapRef}
          onPress={handleMapPress}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          showsUserLocation>
          {pickupCoords && (
            <>
              <Marker
                coordinate={pickupCoords}
                title="You are here"
                pinColor="#9b2fc2"
              />
              <Circle
                center={pickupCoords}
                radius={30}
                strokeColor="#9b2fc2"
                fillColor="rgba(155, 47, 194, 0.2)"
              />
            </>
          )}

          {dropoffCoords && <Marker coordinate={dropoffCoords} />}

          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="red"
              strokeWidth={4}
            />
          )}

          <Circle
            center={region}
            radius={300}
            fillColor="rgba(139,0,255,0.1)"
          />
        </MapView>
      )}

      <View style={styles.card}>
        <Text style={styles.pickupLabel}>PICKUP</Text>
        <View style={styles.pickupRow}>
          <Icon name="radio-button-checked" size={20} color="#9b2fc2" />
          <Text style={styles.pickupText}>{pickupAddress}</Text>
          {canProceed && !showVehicleOptions && (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => setShowVehicleOptions(true)}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.dropoffRow}>
          <Icon name="place" size={20} color="red" />
          <Text style={styles.pickupLabel}>DROP-OFF</Text>
          <TextInput
            style={styles.dropInput}
            placeholder="Where to?"
            value={searchText}
            onChangeText={filterSuggestions}
          />
        </View>

        {/* ✅ Distance info */}
        {distanceKm !== null && duration !== null && (
          <View style={{marginTop: 6, paddingHorizontal: 8}}>
            <Text style={{fontSize: 13, color: '#555'}}>
              Distance: {distanceKm.toFixed(2)} km • ETA: {duration}
            </Text>
          </View>
        )}

        <FlatList
          data={filteredSuggestions}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => onSelectDropoff(item)}>
              <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {showVehicleOptions && (
        <View style={styles.vehicleCard}>
          <Text style={styles.vehicleTitle}>Choose a Vehicle</Text>
          <FlatList
            data={vehicles}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => setSelectedVehicle(item.id)}
                style={[
                  styles.vehicleOption,
                  selectedVehicle === item.id && styles.vehicleSelected,
                ]}>
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
      )}

      {selectedVehicle && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() =>
            Alert.alert('Ride Confirmed', `Vehicle: ${selectedVehicle}`)
          }>
          <Text style={styles.confirmText}>Confirm Ride</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.locateButton}
        onPress={getCurrentLocation}>
        <Locate style={styles.locateIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  drawerButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    zIndex: 999,
    elevation: 10,
  },

  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    marginTop: 'auto',
  },
  pickupRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  dropoffRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 16},
  pickupLabel: {fontSize: 10, color: '#999', marginLeft: 6, marginRight: 12},
  pickupText: {fontSize: 14, fontWeight: '600', flex: 1, flexWrap: 'wrap'},
  dropInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 14,
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: '#9b2fc2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  nextText: {color: '#fff', fontWeight: '600'},
  suggestionText: {fontSize: 14, padding: 10},
  vehicleCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    marginTop: 15,
  },
  vehicleTitle: {fontSize: 18, fontWeight: 'bold', marginBottom: 12},
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  vehicleSelected: {backgroundColor: '#9b2fc2', borderRadius: 8},
  vehicleTextContainer: {flex: 1, marginLeft: 12},
  vehicleName: {fontWeight: 'bold', fontSize: 16},
  vehicleDetails: {fontSize: 12, color: '#666'},
  vehiclePrice: {fontSize: 16, fontWeight: '600'},
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'green',
    padding: 16,
    borderRadius: 30,
  },
  confirmText: {color: '#fff', fontWeight: 'bold'},
  locateButton: {position: 'absolute', top: 40, right: 10},
  locateIcon: {width: 24, height: 24, tintColor: '#9b2fc2'},
});

export default LocationPick;
