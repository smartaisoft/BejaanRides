import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Clipboard,
  Alert,
  Share,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../themes/colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';

const InviteFriend = () => {
  const navigation = useNavigation();
  // const inviteCode = 'RIDE1234';
  const user = useSelector((state: RootState) => state.auth.user);
  const inviteCode = user?.referralLink || 'N/A';

  const handleCopy = () => {
    Clipboard.setString(inviteCode);
    Alert.alert('Copied!', 'Invite code copied to clipboard.');
  };
  const handleInvite = async () => {
    try {
      const message = `Join Salam Rides and earn rewards! Use my referral code: ${inviteCode} 🚗\nDownload the app now: https://salamrides.com`;

      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Error sharing referral code:', error);
      Alert.alert('Error', 'Could not share invite. Please try again.');
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
          <Text style={styles.headerTitle}>Invite Friends</Text>
          <Image
            source={require('../../../assets/images/gift.png')}
            style={styles.avatar}
          />
          <Text style={styles.subText}>
            Earn free rides or cash by inviting your friends to join!
          </Text>
        </View>
      </View>

      {/* Invite Code Field */}
      <View style={styles.card}>
        <Text style={styles.itemText}>Share your Invite Code</Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{inviteCode}</Text>
          <TouchableOpacity onPress={handleCopy}>
            <Icon name="content-copy" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Invite Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.inviteButton} onPress={handleInvite}>
          <Text style={styles.inviteButtonText}>Invite Friends</Text>
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
    paddingTop: 20,
  },

  avatar: {
    width: 180,
    height: 160,
    borderRadius: 40,
    marginVertical: 10,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  subText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 16,
  },

  card: {
    // backgroundColor: '#fff',
    // marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    // elevation: 3,
  },

  itemText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 10,
    fontWeight: '400',
  },

  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#EFEFEF',
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  codeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  bottomContainer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  inviteButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  inviteButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#ffffff',
  },
});

export default InviteFriend;
