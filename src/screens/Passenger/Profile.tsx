/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
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
      await auth().signOut();
      dispatch(setLoggedIn(false));
      dispatch(setUserData({}));
      dispatch(setPhone(''));
      dispatch(verifyOtp(false));
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    } catch (err) {
      console.error('❌ Logout error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text style={styles.headerTitle}>
            {user?.name || 'Passenger Name'}
          </Text>
        </View>

        <Image
          source={require('../../../assets/images/Avatar.png')}
          style={styles.avatar}
        />
      </View>

      {/* Wallet Overview */}
      <ScrollView
        style={{marginTop: 16}}
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.walletGrid}>
          {[
            {
              label: 'Ride Balance',
              value: `Rs ${user?.wallet?.rideBalance ?? 0}`,
              icon: 'work-outline',
            },
            {
              label: 'Total Deposit',
              value: `Rs ${user?.wallet?.totalDeposit ?? 0}`,
              icon: 'description',
            },
            {
              label: 'Total Investment',
              value: `Rs ${user?.wallet?.totalInvestment ?? 0}`,
              icon: 'check-circle-outline',
            },
            {
              label: 'Total Commission',
              value: `Rs ${user?.wallet?.totalCommission ?? 0}`,
              icon: 'credit-card',
            },
            {
              label: 'Total Withdraw',
              value: `Rs ${user?.wallet?.totalWithdraw ?? 0}`,
              icon: 'paid',
            },
            {
              label: 'Referral Bonus',
              value: `Rs ${user?.wallet?.referralBonus ?? 0}`,
              icon: 'card-giftcard',
            },
            {
              label: 'Total Referral',
              value: `${user?.wallet?.totalReferral ?? 0}`,
              icon: 'group',
            },
          ].map((item, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <Icon name={item.icon} size={24} color="#6A1B9A" />
                <Text style={styles.statValue}>{item.value}</Text>
              </View>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Luxury Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Subscriptions')}>
            <Icon
              name="subscriptions"
              size={26}
              color="#6A1B9A"
              style={styles.icon}
            />
            <Text style={styles.itemText}>Subscriptions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('MyWallet')}>
            <Icon
              name="account-balance-wallet"
              size={26}
              color="#2E7D32"
              style={styles.icon}
            />
            <Text style={styles.itemText}>My Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('InviteFriend')}>
            <Icon
              name="person-add"
              size={26}
              color="#0277BD"
              style={styles.icon}
            />
            <Text style={styles.itemText}>Invite Friends</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={handleLogout}>
            <Icon name="logout" size={26} color="#D32F2F" style={styles.icon} />
            <Text style={styles.itemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  backButton: {
    marginRight: 10,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    marginRight: 12,
  },

  nameContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  cash: {
    fontSize: 14,
    color: '#BBDEFB',
    marginTop: 2,
  },

  profileInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  walletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
  },
  statCard: {
    width: '45%',
    backgroundColor: '#E1BEE7',
    padding: 12,
    borderRadius: 16,
    marginVertical: 8,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#4A148C',
  },
  statLabel: {
    fontSize: 14,
    color: '#6A1B9A',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  icon: {
    marginRight: 16,
  },
  itemText: {
    fontSize: 18,
    color: '#222',
    textTransform: 'capitalize',
    fontFamily: 'sans-serif-medium',
  },
});

export default Profile;
