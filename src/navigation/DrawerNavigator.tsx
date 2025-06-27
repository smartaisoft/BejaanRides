import React, {useEffect, useState} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {View, Text, Image, StyleSheet, Pressable, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {setLoggedIn} from '../redux/actions/authActions';
import SettingsScreen from '../screens/Passenger/SettingsScreen';
import NotificationsScreen from '../screens/Passenger/NotificationsScreen';
import HistoryScreen from '../screens/Passenger/HistoryScreen';
import LocationPick from '../screens/Passenger/LocationPick';
import PaymentScreen from '../screens/Passenger/PaymentScreen';
import type {AppDispatch} from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserByUid, UserData} from '../services/realTimeUserService';
import auth from '@react-native-firebase/auth';

export type DrawerParamList = {
  History: undefined;
  Notifications: undefined;
  Settings: undefined;
  Logout: undefined;
  Location: undefined;
  Payment: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth().currentUser;
      if (!currentUser) return;

      const userData = await getUserByUid(currentUser.uid);
      if (userData) {
        setUser(userData);
      } else {
        Alert.alert('Error', 'User data not found.');
      }
    };

    fetchUser();
  }, []);
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['@isLoggedIn', '@role', '@name']);
      dispatch(setLoggedIn(false));
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/images/Avatar.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || 'Passenger'}</Text>
        <Text style={styles.phone}>{user?.phone || ''}</Text>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <View style={styles.logoutRow}>
            <Icon name="logout" size={24} color="#242E42" />
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </Pressable>
      </DrawerContentScrollView>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Location"
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#000',
        drawerInactiveTintColor: '#242E42',
        drawerLabelStyle: {marginLeft: -5, fontSize: 16},
        drawerStyle: {
          backgroundColor: '#fff',
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="Location"
        component={LocationPick}
        options={{drawerItemStyle: {height: 0}}}
      />
      <Drawer.Screen
        name="History"
        component={HistoryScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="history" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="bell-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="cog-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Icon name="cash" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#9C27B0',
    paddingVertical: 70,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  phone: {
    color: '#E0E0E0',
    fontSize: 14,
    marginTop: 4,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
    color: '#242E42',
  },
});

export default DrawerNavigator;
