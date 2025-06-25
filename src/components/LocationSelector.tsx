import React from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Suggestion = {
  id: string;
  name: string;
  isGooglePlace: boolean;
};

type Props = {
  pickupAddress: string;
  dropoffAddress: string;
  searchText: string;
  suggestions: Suggestion[];
  onChangeSearch: (text: string) => void;
  onSelectDropoff: (item: Suggestion) => void;
  canProceed: boolean;
  showVehicleOptions: boolean;
  onNext: () => void;
};

const LocationSelector: React.FC<Props> = ({
  pickupAddress,
  dropoffAddress,
  searchText,
  suggestions,
  onChangeSearch,
  onSelectDropoff,
  canProceed,
  showVehicleOptions,
  onNext,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>PICKUP</Text>
      <View style={styles.row}>
        <Icon name="radio-button-checked" size={20} color="#9b2fc2" />
        <Text style={styles.pickupText}>{pickupAddress}</Text>
        {canProceed && !showVehicleOptions && (
          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.row}>
        <Icon name="place" size={20} color="red" />
        <Text style={styles.label}>DROP-OFF</Text>
        <TextInput
          style={styles.input}
          placeholder="Where to?"
          value={searchText}
          onChangeText={onChangeSearch}
        />
      </View>

      <FlatList
        data={suggestions}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onSelectDropoff(item)}>
            <Text style={styles.suggestion}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    marginTop: 'auto',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    color: '#999',
    marginLeft: 6,
    marginRight: 12,
  },
  pickupText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 14,
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: '#9b2fc2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
  },
  nextText: {
    color: '#fff',
    fontWeight: '600',
  },
  suggestion: {
    fontSize: 14,
    padding: 10,
  },
});

export default LocationSelector;
