import React, {useEffect, useState} from 'react';
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
const SUGGESTIONS = [
  'Jinnah park',
  'Badshahi Mosque, Lahore',
  'Data Darbar',
  'Punjab university',
];

const LocationPick = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 31.5204,
    longitude: 74.3587,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const [locationLoaded, setLocationLoaded] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
    }
    Geolocation.getCurrentPosition(
      pos => {
        const {latitude, longitude} = pos.coords;
        setRegion({...region, latitude, longitude});
        setLocationLoaded(true);
      },
      error => console.error(error),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const renderSuggestion = ({item}: {item: string}) => (
    <TouchableOpacity style={styles.suggestion}>
      <Icon name="location-pin" size={22} color="#555" />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        region={region}
        showsUserLocation={true}
        onRegionChangeComplete={setRegion}>
        <Marker coordinate={region}>
          <Icon name="navigation" size={28} color="#fff" />
        </Marker>
        <Circle center={region} radius={300} fillColor="rgba(139,0,255,0.1)" />
      </MapView>

      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <Menu size={28} color="#444" />
          <Image
            source={require('../../../assets/images/Avatar.png')}
            style={{width: 80, height: 80}}
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
    backgroundColor: '#803be4',
    borderRadius: 30,
    padding: 4,
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
});

export default LocationPick;
