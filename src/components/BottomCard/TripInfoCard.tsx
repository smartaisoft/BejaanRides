import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../themes/colors';

interface Props {
  riderName: string;
  riderPhone: string;
  eta: string;
  distance: string;
  onChat: () => void;
  onCall: () => void;
  onCancel: () => void;
  onArrived: () => void;
}

const TripInfoCard: React.FC<Props> = ({
  eta,
  distance,
  onChat,
  onCall,
  onCancel,
  onArrived,
  riderName,
  riderPhone,
}) => (
  <View style={styles.container}>
    <View style={styles.handle} />
    <Text style={styles.riderName}>{riderName}</Text>
    <Text style={styles.riderPhone}>{riderPhone}</Text>

    <Text style={styles.eta}>{eta}</Text>
    <View style={styles.row}>
      <TouchableOpacity style={styles.iconButton} onPress={onChat}>
        <Icon name="chat" size={24} color={Colors.primary} />
        <Text style={styles.iconText}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onCall}>
        <Icon name="phone" size={24} color={Colors.primary} />
        <Text style={styles.iconText}>Call</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onCancel}>
        <Icon name="close" size={24} color={Colors.primary} />
        <Text style={styles.iconText}>{distance}</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.button} onPress={onArrived}>
      <Text style={styles.buttonText}>Arrived</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    marginBottom: 12,
  },
  eta: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 16,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 50,
    width: '90%',
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  riderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  riderPhone: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
});

export default TripInfoCard;
