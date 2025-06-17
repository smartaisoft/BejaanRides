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

const SUGGESTIONS = [
  'Jinnah parks',
  'Badshahi Mosque, Lahore',
  'Data Darbar',
  'Punjab university',
];

const INITIAL_DELTA = {
  latitudeDelta: 0.015,
  longitudeDelta: 0.0121,
};

const LocationPick = () => {
  const [region, setRegion] = useState<Region | null>(null);
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

  const getCurrentLocation = useCallback(async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.warn('Location permission not granted');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const newRegion = {
          latitude,
          longitude,
          ...INITIAL_DELTA,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      },
      error => {
        console.error('Location Error:', error);
        if (error.code === 3) {
          alert('Location request timed out. Please ensure GPS is on.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
        distanceFilter: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  }, []);

  useEffect(() => {
    setTimeout(() => {
      getCurrentLocation();
    }, 500); // slight delay helps on some devices
  }, []);

  const renderSuggestion = useCallback(
    ({item}: {item: string}) => (
      <TouchableOpacity style={styles.suggestion}>
        <Icon name="location-pin" size={22} color="#555" />
        <Text style={styles.suggestionText}>{item}</Text>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <View style={styles.container}>
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
        </MapView>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.center]}>
          <Text>Fetching your current location...</Text>
        </View>
      )}

      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <Menu size={28} color="#444" />
          <Image
            source={require('../../../assets/images/Avatar.png')}
            style={styles.avatar}
          />
        </View>

        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#999" />
          <TextInput
            placeholder="Where are you going and what’s your offer?"
            style={styles.input}
            placeholderTextColor="#666"
          />
        </View>

        <FlatList
          data={SUGGESTIONS}
          renderItem={renderSuggestion}
          keyExtractor={(item, idx) => idx.toString()}
          style={styles.suggestionsList}
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
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingTop: 50,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  suggestionsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxHeight: 160,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
    marginLeft: 8,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
