/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/types';

type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SubscriptionScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.header}>Wallet Options</Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top-Up</Text>
        <Text style={styles.cardDescription}>
          Add balance directly to your ride wallet. This balance will be used
          for your ride payments instantly and is non-refundable.
        </Text>
        <Text style={styles.cardTip}>
          💡 Recommended if you only want to ride without joining the network.
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.topUpButton]}
          onPress={() => navigation.navigate('Topup')}>
          <Text style={styles.buttonText}>Top-Up Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subscription</Text>
        <Text style={styles.cardDescription}>
          Join our monthly subscription to become part of the MLM network.
          You’ll get access to exclusive rewards and commission-based earnings.
        </Text>
        <Text style={styles.cardTip}>
          💡 Perfect if you want to earn by referring riders and drivers.
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.subscriptionButton]}
          onPress={() => navigation.navigate('SubscriptionPlansScreen')}>
          <Text style={styles.buttonText}>Subscribe Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SubscriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1C2E',
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1B2C3D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardDescription: {
    color: '#DDD',
    fontSize: 14,
    lineHeight: 20,
  },
  cardTip: {
    marginTop: 10,
    color: '#F2C94C',
    fontSize: 13,
    fontStyle: 'italic',
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  topUpButton: {
    backgroundColor: '#3AB0FF',
  },
  subscriptionButton: {
    backgroundColor: '#6C5CE7',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
