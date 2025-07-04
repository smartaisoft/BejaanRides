import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {DriverStackParamList} from '../../navigation/DriverStack';
import {useDispatch} from 'react-redux';
import {setVehicleType} from '../../redux/actions/vehicleActions';
import {AppDispatch} from '../../redux/store';
import Colors from '../../themes/colors';

type Vehicle = {
  id: string;
  label: string;
  icon: any;
};

const vehicles: Vehicle[] = [
  {
    id: 'car',
    label: 'Car',
    icon: require('../../../assets/images/vehicles/carVehicle.png'),
  },
  {
    id: 'bike',
    label: 'Bike',
    icon: require('../../../assets/images/vehicles/bikeVehicle.png'),
  },
  {
    id: 'riksha',
    label: 'Riksha',
    icon: require('../../../assets/images/vehicles/rikshaVehicle.png'),
  },
  {
    id: 'loader',
    label: 'Loader',
    icon: require('../../../assets/images/vehicles/truckVehicle.png'),
  },
];

const ChooseVehicleScreen = () => {
  const navigation = useNavigation<StackNavigationProp<DriverStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const handleSelectVehicle = (vehicleId: string) => {
    console.log('✅ Saving vehicle type in Redux:', vehicleId);

    dispatch(setVehicleType(vehicleId));
    navigation.navigate('VehicleInfoScreen');
  };

  const renderItem = ({item}: {item: Vehicle}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelectVehicle(item.id)}>
      <View style={styles.iconBox}>
        <Image source={item.icon} style={styles.icon} resizeMode="contain" />
      </View>
      <Text style={styles.label}>{item.label}</Text>
      <Icon name="chevron-right" size={24} color="#444" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.heading}>Choose your vehicle</Text>
      <FlatList
        data={vehicles}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 20}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 20},
  back: {marginTop: 20, marginBottom: 16},
  heading: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    backgroundColor: '#f5f5f5',
  },
  iconBox: {
    width: 50,
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {width: 32, height: 32},
  label: {flex: 1, fontSize: 16, color: '#1a1a1a', fontWeight: '600'},
});

export default ChooseVehicleScreen;
