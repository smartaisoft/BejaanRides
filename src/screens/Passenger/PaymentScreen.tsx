import React, { useState } from 'react';
import { View, FlatList, Pressable, StyleSheet } from 'react-native';
import { Text, Appbar, Card, RadioButton, List, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type PaymentMethod = {
  id: string;
  type: 'cash' | 'mastercard' | 'visa';
  masked?: string;
};

const savedMethods: PaymentMethod[] = [
  { id: 'cash', type: 'cash' },
  { id: 'card1', type: 'mastercard', masked: '**** **** **** 3461' },
  { id: 'card2', type: 'visa', masked: '**** **** **** 5967' },
];

const PaymentsScreen = () => {
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState<string>('cash');

  const renderSavedMethod = (item: PaymentMethod) => (
    <Pressable onPress={() => setSelectedMethod(item.id)}>
      <Card style={styles.card} mode={item.id === selectedMethod ? 'outlined' : 'elevated'}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.iconRow}>
            {item.type === 'cash' && <Icon name="cash" size={24} />}
            {item.type === 'mastercard' && <Icon name="credit-card" size={24} />}
            {item.type === 'visa' && <Icon name="credit-card" size={24} />}
            <Text style={styles.cardText}>
              {item.type === 'cash' ? 'Cash' : item.masked}
            </Text>
          </View>
          <RadioButton
            value={item.id}
            status={selectedMethod === item.id ? 'checked' : 'unchecked'}
            onPress={() => setSelectedMethod(item.id)}
          />
        </Card.Content>
      </Card>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Payments" />
        <Appbar.Action icon="check" onPress={() => navigation.goBack()} />
      </Appbar.Header>

      <View style={styles.inner}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Saved payment Methods</Text>
        <FlatList
          data={savedMethods}
          renderItem={({ item }) => renderSavedMethod(item)}
          keyExtractor={(item) => item.id}
        />

        <Text variant="titleMedium" style={styles.sectionTitle}>Add New payment Methods</Text>
        <Card style={styles.newCard}><List.Item title="Apple Pay" left={() => <Icon name="apple" size={24} />} /></Card>
        <Card style={styles.newCard}><List.Item title="Google Pay" left={() => <Icon name="google" size={24} />} /></Card>
        <Card style={styles.newCard}><List.Item title="PayPal" left={() => <Icon name="paypal" size={24} />} /></Card>
      </View>
    </View>
  );
};

export default PaymentsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 16 },
  sectionTitle: { marginTop: 16, marginBottom: 8, fontWeight: '600' },
  card: { marginBottom: 12, borderRadius: 8 },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconRow: { flexDirection: 'row', alignItems: 'center' },
  cardText: { marginLeft: 12, fontSize: 16 },
  newCard: { marginBottom: 12, borderRadius: 8 },
});
