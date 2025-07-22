// HistoryScreen.tsx
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
const dummyNotifications = [
  {id: '1', title: 'System', message: 'Your booking has been confirmed.'},
  {id: '2', title: 'Promo', message: 'Get 20% off on your next ride.'},
  {id: '3', title: 'Alert', message: 'Driver is arriving in 2 minutes.'},
];
const NotificationItem = ({title, message}: any) => (
  <View style={styles.notification}>
    <Icon name="dangerous" size={24} color="red" style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  </View>
);
const NotificationsScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icons}>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="white"></Icon>
          </Pressable>
          <Pressable onPress={() => navigation.goBack()}>
            <Icon name="delete" size={24} color="white"></Icon>
          </Pressable>
        </View>
        <Text style={styles.heading}>Notifications</Text>
      </View>
      <View style={styles.notifications}>
        <View style={styles.notificationColumn}>
          <FlatList
            data={dummyNotifications}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <NotificationItem title={item.title} message={item.message} />
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
    paddingHorizontal: 25,
  },
  notificationColumn: {
    backgroundColor: 'white',
    top: -15,
    borderRadius: 1,
    paddingHorizontal: 25,
    width: '100%',
    elevation: 3,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#EFEFF4',
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 14,
    color: 'black',
  },
  message: {
    fontSize: 10,
    color: 'black',
  },
});
export default NotificationsScreen;
