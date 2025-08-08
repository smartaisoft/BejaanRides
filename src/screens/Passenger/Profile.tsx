import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../themes/colors';
import {RootStackParamList} from '../../navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../redux/store';
import auth from '@react-native-firebase/auth';
import {
  setLoggedIn,
  setPhone,
  setUserData,
  verifyOtp,
} from '../../redux/actions/authActions';

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Profile = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await auth().signOut(); // Sign out from Firebase (optional but recommended)
      dispatch(setLoggedIn(false));
      dispatch(setUserData({})); // clear user object
      dispatch(setPhone(''));
      dispatch(verifyOtp(false));
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}], // or 'Login' depending on your stack
      });
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.profileInfo}>
          <Image
            source={require('../../../assets/images/Avatar.png')}
            style={styles.avatar}
          />
          <Text style={styles.headerTitle}>
            {user?.name || 'Passenger Name'}
          </Text>
          <Text style={styles.cash}>
            Cash ${user?.wallet?.rideBalance ?? 0}
          </Text>
        </View>
      </View>

      {/* White Card */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.item}>
          <Icon name="history" size={24} color="#666" style={styles.icon} />
          <Text style={styles.itemText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item}>
          <Icon
            name="notifications"
            size={24}
            color="#666"
            style={styles.icon}
          />
          <Text style={styles.itemText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={24} color="#666" style={styles.icon} />
          <Text style={styles.itemText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('ProfileSetting')}>
          <Icon name="person" size={24} color="#666" style={styles.icon} />
          <Text style={styles.itemText}>Profile Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('InviteFriend')}>
          <Icon name="group-add" size={24} color="#666" style={styles.icon} />
          <Text style={styles.itemText}>Invite Friends</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#666" style={styles.icon} />
          <Text style={styles.itemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    backgroundColor: Colors.primary,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },

  profileInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  cash: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#fff',
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    elevation: 3,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  icon: {
    marginRight: 16,
  },

  itemText: {
    fontSize: 16,
    color: '#222',
    textTransform: 'capitalize',
  },
});

export default Profile;
