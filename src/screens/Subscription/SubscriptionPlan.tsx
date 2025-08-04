/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {RootStackParamList} from '../../navigation/types';
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const plans = [
  {
    title: 'Regular Subscription',
    price: 'Rs1000',
    icon: '💡',
  },
  {
    title: 'Silver Subscription',
    price: 'Rs3000',
    icon: '🏪',
  },
  {
    title: 'Bronze Subscription',
    price: 'Rs5000',
    icon: '🏆',
  },
  {
    title: 'Gold Subscription',
    price: 'Rs10000',
    icon: '📢',
  },
  {
    title: 'Diamond Subscription',
    price: 'Rs20000',
    icon: '📢',
  },
];

const SubscriptionPlansScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.header}>All Subscriptions</Text>
        <View style={{width: 24}} />
      </View>
      <View style={styles.grid}>
        {plans.map((plan, index) => (
          <View key={index} style={styles.card}>
            {plan.icon ? (
              <Text style={styles.icon}>{plan.icon}</Text>
            ) : (
              <Text style={styles.icon}>{plan.icon}</Text>
            )}
            <Text style={styles.title}>{plan.title}</Text>
            <Text style={styles.label}>Investment</Text>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.provider}>* Salam Rides</Text>
            <TouchableOpacity
              style={styles.payButton}
              onPress={() =>
                navigation.navigate('Investment', {
                  planTitle: plan.title,
                  planPrice: plan.price,
                })
              }>
              <Text style={styles.payButtonText}>✓ PAY NOW</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default SubscriptionPlansScreen;

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
    marginBottom: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#1B2C3D',
    borderColor: '#EB5CA9',
    borderWidth: 1,
    borderRadius: 10,
    width: '48%',
    padding: 16,
    marginBottom: 16,
  },
  icon: {
    fontSize: 32,
    marginBottom: 10,
    textAlign: 'center',
  },
  image: {
    width: 32,
    height: 32,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  label: {
    color: '#AAA',
    fontSize: 12,
    textAlign: 'center',
  },
  price: {
    color: '#3ED3A3',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 4,
  },
  provider: {
    fontSize: 12,
    color: '#F2C94C',
    textAlign: 'center',
    marginBottom: 12,
  },
  payButton: {
    // backgroundColor: 'linear-gradient(90deg, #EB5CA9, #FFB03A)',
    borderRadius: 30,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F25C8E', // fallback for gradient
  },
  payButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
