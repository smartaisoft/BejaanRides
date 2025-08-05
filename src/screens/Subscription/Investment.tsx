/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ToastAndroid,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/types';
import firestore from '@react-native-firebase/firestore';
import {AppDispatch, RootState} from '../../redux/store';
import {useSelector, useDispatch} from 'react-redux';
import {setUserSubscriptions} from '../../redux/actions/subscriptionActions';

type InvestmentRouteProp = RouteProp<RootStackParamList, 'Investment'>;

const Investment = ({navigation}: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const route = useRoute<InvestmentRouteProp>();
  const {planTitle, planPrice} = route.params;
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Meezan');
  const [paySlip, setPaySlip] = useState<any>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const existingSubs = useSelector(
    (state: RootState) => state.subscriptions.userSubscriptions,
  );

  useEffect(() => {
    setAmount(planPrice.replace(/[^0-9]/g, ''));
  }, [planPrice]);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });
    if (result.assets && result.assets.length > 0) {
      setPaySlip(result.assets[0]);
    }
  };

  const renderBankDetails = () => {
    const commonHeader = (
      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          📢 Please send the subscription amount to the following account:
        </Text>
      </View>
    );

    switch (paymentMethod) {
      case 'Meezan':
        return (
          <View style={styles.accountInfo}>
            {commonHeader}
            <Text style={styles.accountText}>🏦 Bank: Meezan Bank</Text>
            <Text style={styles.accountText}>
              👤 Account Title: Salam Rides
            </Text>
            <Text style={styles.accountText}>
              💳 Account Number: 0840112094554
            </Text>
            <Text style={styles.accountText}>
              🔢 IBAN: PK10MEZN0002840112094554
            </Text>
          </View>
        );
      case 'Bank Alfalah':
        return (
          <View style={styles.accountInfo}>
            {commonHeader}
            <Text style={styles.accountText}>🏦 Bank: Bank Alfalah</Text>
            <Text style={styles.accountText}>
              👤 Account Title: Salam Rides
            </Text>
            <Text style={styles.accountText}>
              💳 Account Number: 02661010115172
            </Text>
            <Text style={styles.accountText}>
              🔢 IBAN: PK90ALFH02661010115172
            </Text>
          </View>
        );
      case 'JazzCash':
        return (
          <View style={styles.accountInfo}>
            {commonHeader}
            <Text style={styles.accountText}>
              📲 JazzCash Number: 03008244014
            </Text>
            <Text style={styles.accountText}>
              👤 Account Title: Asmatullah Tunio
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const validateAndProceed = async () => {
    const amountValue = parseInt(amount, 10);

    if (
      !amount ||
      isNaN(amountValue) ||
      amountValue < 1000 ||
      amountValue > 10000000000
    ) {
      Alert.alert(
        'Invalid Amount',
        'Please enter an amount between 1,000 and 10,000,000,000 PKR.',
      );
      return;
    }

    if (!paymentMethod) {
      Alert.alert('Missing Payment Method', 'Please select a payment method.');
      return;
    }

    if (!paySlip) {
      Alert.alert(
        'Missing Pay Slip',
        'Please upload a screenshot of your pay slip.',
      );
      return;
    }

    if (!currentUser?.uid) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    const payload = {
      userId: currentUser.uid,
      planTitle,
      selectedAmount: amountValue,
      paymentMethod,
      screenshot: paySlip,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const subDocRef = firestore()
        .collection('subscriptions')
        .doc(currentUser.uid);

      await subDocRef.set(
        {
          userId: currentUser.uid,
          subscriptions: firestore.FieldValue.arrayUnion(payload),
        },
        {merge: true},
      );

      // ✅ Update Redux store
      const fullPayload = {...payload, id: currentUser.uid};
      dispatch(setUserSubscriptions([...existingSubs, fullPayload]));

      // ✅ Update wallet with pending deposit
      await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .update({
          'wallet.totalDeposit': firestore.FieldValue.increment(amountValue),
          'wallet.transactionHistory': firestore.FieldValue.arrayUnion({
            type: 'InvestmentPending',
            amount: amountValue,
            date: new Date().toISOString(),
            description: 'Pending Subscription Payment',
          }),
        });

      ToastAndroid.show(
        '✅ Subscription Submitted for Approval',
        ToastAndroid.LONG,
      );
    } catch (error) {
      console.error('❌ Subscription failed:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 40}}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.stepTitle}>💰 Deposit Funds</Text>
        <View style={{width: 24}} />
      </View>

      <Text style={styles.reviewLabel}>📌 Selected Plan: {planTitle}</Text>

      <Text style={styles.label}>Select Payment Method</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={paymentMethod}
          onValueChange={itemValue => setPaymentMethod(itemValue)}
          dropdownIconColor="#FFF"
          style={{color: '#FFF'}}>
          <Picker.Item label="-- Select Gateway --" value="" enabled={false} />
          <Picker.Item label="Meezan" value="Meezan" />
          <Picker.Item label="Bank Alfalah" value="Bank Alfalah" />
          <Picker.Item label="JazzCash" value="JazzCash" />
        </Picker>
      </View>

      <Text style={styles.label}>Selected Plan Amount : pkr {amount}</Text>

      {renderBankDetails()}

      <Text style={styles.label}>Upload Payment Screenshot</Text>
      <TouchableOpacity onPress={pickImage} style={styles.uploadBox}>
        <Text style={styles.uploadText}>📷 Tap to upload pay slip image</Text>
        {paySlip && (
          <Image source={{uri: paySlip.uri}} style={styles.paySlipImage} />
        )}
      </TouchableOpacity>

      <View style={styles.reviewBox}>
        <Text style={styles.reviewLabel}>🔍 Review Summary</Text>
        <Text style={styles.reviewItem}>Plan: {planTitle}</Text>
        <Text style={styles.reviewItem}>Amount: {amount || '---'}</Text>
        <Text style={styles.reviewItem}>Payment Method: {paymentMethod}</Text>
        <Text style={styles.reviewItem}>Total: {amount || '---'}</Text>
        <Text style={styles.reviewItem}>Pay Amount: {amount || '---'}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={validateAndProceed}>
        <Text style={styles.buttonText}>✅ PROCEED TO PAYMENT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Investment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071B2E',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepTitle: {
    color: '#F9D342',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    color: '#F2F2F2',
    marginTop: 12,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: '#162A40',
    borderRadius: 6,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  input: {
    backgroundColor: '#162A40',
    color: '#FFF',
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
  },
  subText: {
    fontSize: 12,
    color: '#F59E0B',
    marginBottom: 16,
  },
  accountInfo: {
    backgroundColor: '#1C314E',
    padding: 12,
    borderRadius: 6,
    marginVertical: 8,
  },
  accountText: {
    color: '#E2E8F0',
    fontSize: 14,
  },
  uploadBox: {
    height: 150,
    borderWidth: 1,
    borderColor: '#888',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginVertical: 12,
  },
  uploadText: {
    color: '#CCC',
  },
  paySlipImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 6,
  },
  reviewBox: {
    backgroundColor: '#1C314E',
    padding: 12,
    borderRadius: 6,
    marginVertical: 16,
  },
  reviewLabel: {
    color: '#F9D342',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  reviewItem: {
    color: '#D1D5DB',
    fontSize: 14,
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#3AB0FF',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noticeBox: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  noticeText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
});
