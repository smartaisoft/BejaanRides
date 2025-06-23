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
  Image,
  Alert,
} from 'react-native';
import MapView, {
  Marker,
  Circle,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Menu from '../../../assets/SVG/Menu';
import Locate from '../../../assets/SVG/Locate';
import {updateUser, getUser} from '../../services/userService';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerParamList} from '../../navigation/DrawerNavigator';
import {getAllLocations} from '../../services/locationService';

const INITIAL_DELTA = {
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

type DrawerNav = DrawerNavigationProp<DrawerParamList>;

const LocationPick = () => {
  const navigation = useNavigation<DrawerNav>();
  const [region, setRegion] = useState<Region | null>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
  const mapRef = useRef<MapView | null>(null);

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

  const testUpdateAndFetchUser = async () => {
    const uid = '1shbKBPjwMShAPn0BbNsoVAqwoT2';
    try {
      await updateUser(uid, {
        lastName: 'Mokoena',
        address: 'New Street 123, Cape Town',
      });
      const updatedUser = await getUser(uid);
      console.log('🔥 Updated user:', updatedUser);
    } catch (error) {
      console.error('❌ Error updating user:', error);
    }
  };

  const getCurrentLocation = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const newRegion = {latitude, longitude, ...INITIAL_DELTA};
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      },
      error => {
        console.error('Location Error:', error);
        if (error.code === 3) {
          Alert.alert('Location Timeout', 'Please ensure GPS is turned on.');
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 6000,
        distanceFilter: 0,
      },
    );
  }, []);

  useEffect(() => {
    const init = async () => {
      await testUpdateAndFetchUser();
      try {
        const allLocations = await getAllLocations();
        setLocations(allLocations);
        setFilteredSuggestions(allLocations.slice(0, 5));
      } catch (err) {
        console.error('❌ Error fetching locations:', err);
      }
      setTimeout(() => {
        getCurrentLocation();
      }, 500);
    };
    init();
  }, [getCurrentLocation]);

  const filterSuggestions = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredSuggestions(locations.slice(0, 5));
      return;
    }
    const lowerText = text.toLowerCase();
    const matches = locations.filter(loc =>
      loc.name?.toLowerCase().includes(lowerText),
    );
    setFilteredSuggestions(matches.slice(0, 10));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={styles.drawerButton}>
        <Menu width={28} height={28} />
      </TouchableOpacity>

      {region ? (
        <MapView
          ref={ref => (mapRef.current = ref)}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          region={region}
          showsUserLocation
          onRegionChangeComplete={setRegion}>
          <Marker coordinate={region}>
            <Icon name="navigation" size={28} color="#fff" />
          </Marker>
          <Circle
            center={region}
            radius={300}
            fillColor="rgba(139,0,255,0.1)"
          />
          {locations.map(loc => {
            const coords = loc?.position?.geopoint;
            if (!coords) return null;
            return (
              <Marker
                key={loc.id}
                coordinate={{
                  latitude: coords._latitude,
                  longitude: coords._longitude,
                }}
                title={loc.name}>
                <Icon name="place" size={30} color="red" />
              </Marker>
            );
          })}
        </MapView>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <Text>Fetching your current location...</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.pickupLabel}>PICKUP</Text>

        <View style={styles.pickupRow}>
          <Icon name="radio-button-checked" size={20} color="#9b2fc2" />
          <Text style={styles.pickupText}>My current location</Text>
        </View>
        <View style={styles.dropoffRow}>
          <Icon name="place" size={20} color="red" />
          <Text style={styles.pickupLabel}>DROP-OFF</Text>
          <TextInput
            style={styles.dropInput}
            placeholder="Enter drop-off location"
            value={searchText}
            onChangeText={filterSuggestions}
          />
        </View>

        <FlatList
          data={filteredSuggestions}
          keyExtractor={(item, idx) => idx.toString()}
          ListHeaderComponent={
            <Text style={styles.sectionLabel}>POPULAR LOCATIONS</Text>
          }
          renderItem={({item}) => {
            const isFav = item.isFavorite || false;
            return (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  const coords = item?.position?.geopoint;
                  if (coords && mapRef.current) {
                    const newRegion = {
                      latitude: coords._latitude,
                      longitude: coords._longitude,
                      ...INITIAL_DELTA,
                    };
                    mapRef.current.animateToRegion(newRegion, 1000);
                    setRegion(newRegion);
                    setSearchText(item.name);
                  }
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon name="place" color="#e74c3c" size={20} />
                  <Text style={styles.suggestionText}>{item.name}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const updated = locations.map(loc =>
                      loc.id === item.id ? {...loc, isFavorite: !isFav} : loc,
                    );
                    setLocations(updated);
                    setFilteredSuggestions(updated);
                  }}>
                  <Icon
                    name={isFav ? 'star' : 'star-outline'}
                    color={isFav ? '#f1c40f' : '#aaa'}
                    size={20}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
        />
      </View>

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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    marginTop: 'auto',
    elevation: 5,
  },
  drawerButton: {
  position: 'absolute',
  top: Platform.OS === 'ios' ? 50 : 20,
  left: 20,
  zIndex: 10,
  backgroundColor: '#fff',
  borderRadius: 20,
  padding: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 5,
},

  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropoffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pickupLabel: {
    fontSize: 10,
    color: '#999',
    marginLeft: 6,
    marginRight: 12,
    textTransform: 'uppercase',
  },
  pickupText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dropInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 14,
    marginLeft: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 6,
    marginTop: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '',
  },
  locateButton: {
    position: 'absolute',
    bottom: 250,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  locateIcon: {
    width: 24,
    height: 24,
    tintColor: '#9b2fc2',
  },
});

export default LocationPick;
