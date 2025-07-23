// HistoryScreen.tsx
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const dummyNotifications = [
  {
    id: '1',
    date: 'Jun 13, 2025',
    pickup: 'Allama Iqbal town Lahore',
    dropoff: 'Badshahi Mosque, Lahore',
    fare: '450',
    status: 'Completed',
  },
  {
    id: '2',
    date: 'Jun 12, 2025',
    pickup: 'Model Town, Lahore',
    dropoff: 'Liberty Market, Lahore',
    fare: '380',
    status: 'Completed',
  },
  {
    id: '3',
    date: 'Jun 10, 2025',
    pickup: 'Gulberg III, Lahore',
    dropoff: 'DHA Phase 6, Lahore',
    fare: '510',
    status: 'Completed',
  },
];

const RideNotificationCard = ({date, pickup, dropoff, fare, status}: any) => {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>{date}</Text>
      <View style={styles.locationRow}>
        <Icon
          name="radio-button-checked"
          size={16}
          color="purple"
          style={styles.icon}
        />
        <Text style={styles.locationText}>{pickup}</Text>
      </View>
      <View style={styles.line} />
      <View style={styles.locationRow}>
        <Icon name="location-on" size={16} color="red" style={styles.icon} />
        <Text style={styles.locationText}>{dropoff}</Text>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.fare}>RS:{fare}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
    </View>
  );
};
const HistoryScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icons}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="menu" size={24} color="white"></Icon>
          </Pressable>
        </View>
        <Text style={styles.heading}>History</Text>
      </View>
      <View style={styles.notifications}>
        <View style={styles.notificationColumn}>
          <FlatList
            data={dummyNotifications}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <RideNotificationCard
                date={item.date}
                pickup={item.pickup}
                dropoff={item.dropoff}
                fare={item.fare}
                status={item.status}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25B324',
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    marginVertical: 35,
    paddingHorizontal: 25,
    gap: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 1,
  },
  notifications: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  notificationColumn: {
    top: -25,
    borderRadius: 1,
    width: '95%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginVertical: 5,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
  },
  date: {
    fontSize: 12,
    color: '#555',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  line: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
    marginLeft: 24,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  fare: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  status: {
    fontSize: 12,
    color: 'green',
    fontWeight: '600',
  },
});
export default HistoryScreen;
