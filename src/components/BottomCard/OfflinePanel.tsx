import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../themes/colors';
import {RootState} from '../../redux/store';
import {useSelector} from 'react-redux';
import useTopupListener from '../../services/useTopupListener';

interface Props {
  onGoOnline: () => void;
  driverName?: string;
}

const OfflinePanel: React.FC<Props> = ({onGoOnline, driverName}) => {
  const vehicleInfo = useSelector((state: RootState) => state.vehicle);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const topupHistory = useSelector(
    (state: RootState) => state.topup.topupHistory,
  );

  useTopupListener(currentUser?.uid);
  // Calculate Ride Balance (sum of approved topups)
  const rideBalance = topupHistory
    ?.filter(t => t.status === 'approved')
    .reduce((sum, t) => sum + (t.depositAmount || t.amount || 0), 0);

  // Calculate Deposit Amount (sum of pending topups)
  const depositAmount = topupHistory
    ?.filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + (t.depositAmount || t.amount || 0), 0);
  const driverPhoto =
    vehicleInfo?.vehicleDetails?.driverPhoto ??
    vehicleInfo?.vehicleDetails?.images?.driverPhoto ??
    null;
  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <Text style={styles.offlineText}>You're Offline</Text>
      <Text style={styles.helperText}>
        Tap the
        <Text style={{fontWeight: 'bold', color: Colors.primary}}> GO </Text>
        button below to come online and start receiving ride requests.
      </Text>

      <View style={styles.profileRow}>
        {/* {driverPhoto ? (
          <Image source={{uri: driverPhoto}} style={styles.avatar} />
        ) : (
          <Image
            source={require('../../../assets/images/DriverAvatar.png')}
            style={styles.avatar}
          />
        )} */}
        <Image
          source={require('../../../assets/images/DriverAvatar.png')}
          style={styles.avatar}
        />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{driverName ?? 'Driver'}</Text>
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#fbc02d" />
            <Text style={styles.rating}>4.9</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.goButton} onPress={onGoOnline}>
          <Text style={styles.goText}>GO</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.balancesContainer}>
        {/* Ride Balance */}
        <View style={styles.balanceBox}>
          <Icon name="wallet" size={24} color={Colors.primary} />
          <View style={{marginLeft: 8, alignItems: 'center'}}>
            <Text style={styles.balanceAmount}>PKR {rideBalance}</Text>
            <Text style={styles.balanceLabel}>Ride Balance</Text>
          </View>
        </View>

        {/* Total Deposit */}
        <View style={styles.balanceBox}>
          <Icon name="bank" size={24} color={Colors.primary} />
          {/* Changed icon */}
          <View style={{marginLeft: 8, alignItems: 'center'}}>
            <Text style={styles.balanceAmount}>PKR {depositAmount}</Text>
            <Text style={styles.balanceLabel}>Total Deposit</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Icon name="check-circle" size={24} color={Colors.primary} />
          <Text style={styles.statValue}>90.0%</Text>
          <Text style={styles.statLabel}>Acceptance</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="star-circle" size={24} color={Colors.primary} />
          <Text style={styles.statValue}>4.25</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="close-circle" size={24} color={Colors.primary} />
          <Text style={styles.statValue}>2.5%</Text>
          <Text style={styles.statLabel}>Cancellation</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  header: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 8,
  },
  offlineText: {
    color: '#e53935',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
  },
  helperText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
    marginBottom: 12,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    marginLeft: 4,
    color: '#777',
  },
  goButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  goText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rideBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // ✅ Center horizontally
    marginBottom: 12,
    marginTop: 4,
  },
  balancesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },

  balanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  balanceAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textBlack,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontWeight: '600',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
});

export default OfflinePanel;
