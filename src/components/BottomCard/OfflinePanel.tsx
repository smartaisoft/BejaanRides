import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  onGoOnline: () => void;
}

const OfflinePanel: React.FC<Props> = ({onGoOnline}) => (
  <View style={styles.container}>
    <View style={styles.header} />

    <Text style={styles.offlineText}>You're Offline</Text>

    <View style={styles.profileRow}>
      <Image
        source={require('../../../assets/images/DriverAvatar.png')}
        style={styles.avatar}
      />
      <View style={styles.profileInfo}>
        <Text style={styles.name}>Driver name</Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={16} color="#fbc02d" />
          <Text style={styles.rating}>4.9</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.goButton} onPress={onGoOnline}>
        <Text style={styles.goText}>GO</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.divider} />

    <View style={styles.statsRow}>
      <View style={styles.statItem}>
        <Icon name="check-circle" size={24} color="#9C27B0" />
        <Text style={styles.statValue}>90.0%</Text>
        <Text style={styles.statLabel}>Acceptance</Text>
      </View>
      <View style={styles.statItem}>
        <Icon name="star-circle" size={24} color="#9C27B0" />
        <Text style={styles.statValue}>4.25</Text>
        <Text style={styles.statLabel}>Rating</Text>
      </View>
      <View style={styles.statItem}>
        <Icon name="close-circle" size={24} color="#9C27B0" />
        <Text style={styles.statValue}>2.5%</Text>
        <Text style={styles.statLabel}>Cancellation</Text>
      </View>
    </View>
  </View>
);

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
    backgroundColor: '#9C27B0',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  goText: {
    color: '#fff',
    fontWeight: 'bold',
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
