import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import Colors from '../../themes/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '../../navigation/types';

const vehicleTypes = [
  {type: 'Car', icon: 'https://img.icons8.com/color/96/car--v1.png'},
  {type: 'Bike', icon: 'https://img.icons8.com/color/96/motorcycle.png'},
  {
    type: 'Rickshaw',
    icon: 'https://img.icons8.com/?size=100&id=UWFtLJmXvzDU&format=png&color=000000',
  },
];

const rideOptions = [
  {
    title: 'City Rides',
    image:
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'City to City',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Airport Ride',
    image:
      'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Rental',
    image:
      'https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=800&q=80',
  },
];

const RideCard = ({title, imageUrl}: {title: string; imageUrl: string}) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.rideCard}>
      <View style={styles.imageWrapper}>
        {loading && (
          <ActivityIndicator
            size="small"
            color="#888"
            style={styles.imageLoader}
          />
        )}
        <Image
          source={{uri: imageUrl}}
          style={styles.rideImage}
          onLoadEnd={() => setLoading(false)}
        />
      </View>
      <Text style={styles.rideText}>{title}</Text>
    </View>
  );
};

const PassengerHomeScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigation =
    useNavigation<BottomTabNavigationProp<BottomTabParamList>>();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome,</Text>
        <Text style={styles.headerName}>{user?.name || 'Passenger'} 👋</Text>
      </View>

      {/* Where to go? button */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('PassengerPickRide')}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>Where to go?</Text>
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.contentWrapper}>
          <View style={{marginBottom: 20}}>
            {/* Vehicle Type Section */}
            <Text style={styles.sectionTitle}>Select Vehicle Type</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={vehicleTypes}
              keyExtractor={item => item.type}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('PassengerPickRide')}
                  style={styles.vehicleCard}>
                  <Image
                    source={{uri: item.icon}}
                    style={styles.vehicleImage}
                  />
                  <Text style={styles.vehicleText}>{item.type}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{paddingHorizontal: 10}}
            />
          </View>

          {/* Ride Options Section */}
          <Text style={styles.sectionTitle}>Choose Your Ride</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={rideOptions}
            keyExtractor={item => item.title}
            renderItem={({item}) => (
              <RideCard title={item.title} imageUrl={item.image} />
            )}
            contentContainerStyle={{paddingHorizontal: 10}}
          />
        </View>
        {/* Ride With Us Section */}
        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Save Money & Time</Text>
          <Text style={styles.promoSubtitle}>Ride with Salam Rides</Text>

          <Image
            source={require('../../../assets/images/SalamRider.png')}
            style={styles.promoImage}
          />

          <Text style={styles.promoText}>
            Skip the hassle of finding a ride or overpaying. With Salam Rides,
            you get safe, reliable, and affordable transport anywhere — from
            city streets to airports and beyond. Book in seconds and reach on
            time.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PassengerHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },
  headerText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 4,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -10,
    marginBottom: 10,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    color: '#888',
    fontSize: 16,
  },
  contentWrapper: {
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
    color: '#333',
  },
  vehicleCard: {
    backgroundColor: '#FFFFFF',
    padding: 13,
    marginBottom: 20,
    marginRight: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    width: 100,
  },
  vehicleImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  vehicleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  rideCard: {
    backgroundColor: '#FFFFFF',
    marginRight: 14,
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
    width: 180,
    elevation: 6,
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    backgroundColor: '#ECECEC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLoader: {
    position: 'absolute',
    zIndex: 1,
  },
  rideImage: {
    width: '100%',
    height: '100%',
  },
  rideText: {
    fontSize: 16,
    fontWeight: '600',
    padding: 10,
    color: '#1B1B1B',
  },
  promoSection: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 4,
    marginBottom: 30,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  promoImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 12,
  },
  promoText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
});
