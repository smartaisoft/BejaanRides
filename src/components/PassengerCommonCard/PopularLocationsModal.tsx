import React from 'react';
import {Modal, View, StyleSheet, TouchableOpacity, Text, FlatList} from 'react-native';
import { popularLocations } from '../../utils/popularLocations';

interface Props {
  visible: boolean;
  onSelect: (location: string) => void;
  onClose: () => void;
}

const PopularLocationsModal: React.FC<Props> = ({visible, onSelect, onClose}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <FlatList
          data={popularLocations}
          keyExtractor={(item) => item}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => onSelect(item)} style={styles.item}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={onClose} style={styles.close}>
          <Text style={styles.closeText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 280,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    padding: 16,
  },
  item: {padding: 12, borderBottomWidth: 1, borderColor: '#eee'},
  close: {marginTop: 16},
  closeText: {textAlign: 'center', color: '#9C27B0'},
});

export default PopularLocationsModal;
