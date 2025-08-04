import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const WalletStatusScreen = ({navigation}: any) => {
  // Static example data — replace these with real values from Redux or Firebase
  const rideBalance = 12000; // PKR
  const walletBalance = 3000; // PKR
  const walletStatus = 'Pending Approval'; // 'Approved' | 'Rejected'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return '#4CAF50';
      case 'Pending Approval':
        return '#FBC02D';
      case 'Rejected':
        return '#F44336';
      default:
        return '#999';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header with Back */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.header}>💼 Wallet Overview</Text>
        <View style={{width: 24}} />
      </View>

      {/* Ride Balance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🚗 Ride Balance</Text>
        <Text style={styles.amount}>PKR {rideBalance.toLocaleString()}</Text>
      </View>

      {/* Wallet Balance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💰 Wallet Balance</Text>
        <Text style={styles.amount}>PKR {walletBalance.toLocaleString()}</Text>
      </View>

      {/* Wallet Status */}
      <View style={styles.statusBox}>
        <Text style={styles.statusLabel}>📋 Wallet Request Status:</Text>
        <Text style={[styles.statusValue, {color: getStatusColor(walletStatus)}]}>
          {walletStatus}
        </Text>
        <Text style={styles.statusHint}>
          * Wallet amount will be added to your ride balance once approved by admin.
        </Text>
      </View>
    </ScrollView>
  );
};

export default WalletStatusScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1C2E',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1B2C3D',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    color: '#AAA',
    marginBottom: 8,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3ED3A3',
  },
  statusBox: {
    backgroundColor: '#1C314E',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  statusLabel: {
    fontSize: 16,
    color: '#F2F2F2',
    marginBottom: 8,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusHint: {
    color: '#CCC',
    fontSize: 12,
  },
});
