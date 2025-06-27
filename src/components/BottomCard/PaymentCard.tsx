import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  amount: number;
  onConfirm: () => void;
}

const PaymentCard: React.FC<Props> = ({amount, onConfirm}) => (
  <View style={styles.container}>
    <View style={styles.handle} />
    <Text style={styles.title}>Payment</Text>
    <Text style={styles.amount}>Rs {amount.toFixed(0)}</Text>

    <View style={styles.methodsRow}>
      <View style={styles.method}>
        <Icon name="cash" size={24} color="#9C27B0" />
        <Text style={styles.methodTextSelected}>Cash</Text>
      </View>
    </View>

    <TouchableOpacity style={styles.button} onPress={onConfirm}>
      <Text style={styles.buttonText}>Collect payment</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  methodsRow: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the method in the row
    width: '100%',
    marginBottom: 20,
  },
  method: {
    alignItems: 'center',
  },
  methodTextSelected: {
    marginTop: 4,
    fontSize: 14,
    color: '#9C27B0',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#9C27B0',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 50,
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PaymentCard;
