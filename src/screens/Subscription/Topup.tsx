import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

const Topup = ({navigation}: any) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Meezan');
  const [paySlip, setPaySlip] = useState<any>(null);

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
    switch (paymentMethod) {
      case 'Meezan':
        return (
          <View style={styles.accountInfo}>
            <Text style={styles.accountText}>
              Title of Account: Salam Rides
            </Text>
            <Text style={styles.accountText}>Meezan Bank</Text>
            <Text style={styles.accountText}>
              Account Number: 0840112094554
            </Text>
            <Text style={styles.accountText}>
              IBAN: PK10MEZN0002840112094554
            </Text>
          </View>
        );
      case 'Bank Alfalah':
        return (
          <View style={styles.accountInfo}>
            <Text style={styles.accountText}>
              Title of Account: Salam Rides
            </Text>
            <Text style={styles.accountText}>Bank Alfalah</Text>
            <Text style={styles.accountText}>
              Account Number: 02661010115172
            </Text>
            <Text style={styles.accountText}>IBAN: PK90ALFH02661010115172</Text>
          </View>
        );
      case 'JazzCash':
        return (
          <View style={styles.accountInfo}>
            <Text style={styles.accountText}>
              Account Title: Asmatullah Tunio
            </Text>
            <Text style={styles.accountText}>JazzCash Number: 03008244014</Text>
          </View>
        );
      default:
        return null;
    }
  };

 const validateAndProceed = () => {
  const amountValue = parseInt(amount);
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

  // ✅ STEP: Collect and log the data
  const payload = {
    amount: amountValue,
    method: paymentMethod,
    slipFileName: paySlip.fileName || 'unknown',
    slipUri: paySlip.uri,
    slipType: paySlip.type,
  };

  console.log('📤 Submitted Top-up Data:', payload);

  Alert.alert(
    'Payment Submitted',
    'Your payment request has been submitted successfully.',
  );
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

      <Text style={styles.label}>Enter Amount (PKR)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 1000"
        placeholderTextColor="#888"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Text style={styles.subText}>
        ⚠ Minimum 1000 PKR and Maximum 10 Billion PKR allowed.
      </Text>

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

export default Topup;

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
});
