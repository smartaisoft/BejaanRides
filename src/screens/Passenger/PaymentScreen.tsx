import React, {useState} from 'react';
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import {Text, Card, RadioButton, List} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HEADER_HEIGHT = 240;

const imageAssets = {
  cash: require('../../../assets/images/cash.png'),
  mastercard: require('../../../assets/images/mastercard.png'),
  visa: require('../../../assets/images/visa.png'),
  apple: require('../../../assets/images/apple-pay.png'),
  google: require('../../../assets/images/google-pay.png'),
  paypal: require('../../../assets/images/paypal.png'),
};

type PaymentMethod = {
  id: string;
  type: 'cash' | 'mastercard' | 'visa';
  masked?: string;
};

const savedMethods: PaymentMethod[] = [
  {id: 'cash', type: 'cash'},
  {id: 'card1', type: 'mastercard', masked: '**** **** **** 3461'},
  {id: 'card2', type: 'visa', masked: '**** **** **** 5967'},
];

const PaymentsScreen = () => {
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState<string>('cash');

  const renderSavedMethod = (item: PaymentMethod) => (
    <Pressable onPress={() => setSelectedMethod(item.id)}>
      <Card
        style={[styles.card, item.id === 'cash' && styles.primaryCard]}
        mode={item.id === selectedMethod ? 'outlined' : 'elevated'}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.iconRow}>
            <Image source={imageAssets[item.type]} style={styles.paymentIcon} />
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
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBg}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </Pressable>
          <Pressable onPress={() => navigation.goBack()}>
            <MaterialIcons name="check" size={24} color="#fff" />
          </Pressable>
        </View>
        <View style={{marginTop: 30}}>
          <Text style={styles.title}>Payments</Text>
          <Text style={styles.subtitle}>Saved payment Methods</Text>
        </View>
      </View>

      <View style={styles.innerCardWrapper}>
        <FlatList
          data={savedMethods}
          renderItem={({item}) => renderSavedMethod(item)}
          keyExtractor={item => item.id}
        />
      </View>
      <Text style={styles.sectionTitle}>Add New payment Methods</Text>

      <View style={styles.innerCardWrapper1}>
        <Card style={styles.newCard}>
          <List.Item
            title="Apple Pay"
            left={() => (
              <Image source={imageAssets.apple} style={styles.paymentIcon} />
            )}
          />
        </Card>
        <Card style={styles.newCard}>
          <List.Item
            title="Google Pay"
            left={() => (
              <Image source={imageAssets.google} style={styles.paymentIcon} />
            )}
          />
        </Card>
        <Card style={styles.newCard}>
          <List.Item
            title="PayPal"
            left={() => (
              <Image source={imageAssets.paypal} style={styles.paymentIcon} />
            )}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
};

export default PaymentsScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  headerBg: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 16,
    paddingTop: 40,
    height: HEADER_HEIGHT,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  innerCardWrapper: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    paddingTop: 16,
    borderRadius: 12,
    marginTop: -40,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
    innerCardWrapper1: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    paddingTop: 16,
    borderRadius: 12,
    // marginTop: -40,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  primaryCard: {
    borderColor: '#9C27B0',
    borderWidth: 1.5,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 12,
    fontSize: 16,
  },
  newCard: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  paymentIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
