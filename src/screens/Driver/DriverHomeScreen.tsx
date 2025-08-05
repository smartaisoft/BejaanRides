import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Colors from '../../themes/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const DriverHomeScreen: React.FC = () => {
      const user = useSelector((state: RootState) => state.auth.user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>{user?.name}</Text>
          </View>
          <Image
            source={require('../../../assets/images/Avatar.png')}
            style={styles.avatar}
          />
        </View>

        {/* Search Box */}
        <View style={styles.searchBox}>
          <Text style={styles.whereTo}>Where to?</Text>
          <View style={styles.nowBox}>
            <Icon name="time-outline" size={16} color="#000" />
            <Text style={styles.nowText}>Now</Text>
          </View>
        </View>

        {/* Book a Ride */}
        <Text style={styles.sectionTitle}>Book A Ride Now</Text>
        {/* <View style={styles.rideOptions}>
          {rideOptions.map((item, index) => (
            <TouchableOpacity key={index} style={styles.rideItem}>
              <Image source={item.icon} style={styles.rideIcon} />
              <Text style={styles.rideLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Plan Your Ride */}
        <Text style={styles.sectionTitle}>Plan Your Ride</Text>
        {/* <Image
          source={require('../../assets/images/map-phone.png')}
          style={styles.banner}
        /> */}

        {/* Save Money */}
        <Text style={styles.sectionTitle}>Save Money! Ride With Us</Text>
        <View style={styles.saveMoneyRow}>
          {/* <Image
            source={require('../../assets/images/direction.png')}
            style={styles.saveImage}
          />
          <Image
            source={require('../../assets/images/ride-share.png')}
            style={styles.saveImage}
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// const rideOptions = [
//   {
//     label: 'Ride',
//     icon: require('../../assets/icons/ride.png'),
//   },
//   {
//     label: 'Bike',
//     icon: require('../../assets/icons/bike.png'),
//   },
//   {
//     label: 'Rickshaw',
//     icon: require('../../assets/icons/rickshaw.png'),
//   },
//   {
//     label: 'Car Rental',
//     icon: require('../../assets/icons/car-rental.png'),
//   },
// ];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textWhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.primary,
  },
  greeting: {
    color: Colors.textWhite,
    fontSize: 16,
  },
  name: {
    color: Colors.textWhite,
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
  },
  searchBox: {
    margin: 16,
    padding: 12,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  whereTo: {
    fontSize: 16,
    color: '#555',
  },
  nowBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 6,
    borderRadius: 10,
  },
  nowText: {
    marginLeft: 4,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  rideOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  rideItem: {
    alignItems: 'center',
  },
  rideIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  rideLabel: {
    marginTop: 4,
    fontSize: 12,
  },
  banner: {
    width: '90%',
    height: 180,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 12,
  },
  saveMoneyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  saveImage: {
    width: 160,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});

export default DriverHomeScreen;
