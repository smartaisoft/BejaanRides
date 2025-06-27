import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  onProfile: () => void;
  onLogout: () => void;
  onEarnings: () => void;
}

const MenuDrawer: React.FC<Props> = ({ onProfile, onLogout, onEarnings }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.item} onPress={onProfile}>
      <Text style={styles.text}>Profile</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.item} onPress={onEarnings}>
      <Text style={styles.text}>Earnings</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.item} onPress={onLogout}>
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  item: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: { fontSize: 16 },
});

export default MenuDrawer;
