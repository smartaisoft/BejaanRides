import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../../themes/colors';
import Ionicons from 'react-native-vector-icons/MaterialIcons';


const ProfileSettings: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ProfileSettings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Name</Text>
          <TouchableOpacity>
            <Ionicons name="pencil" size={20} color={Colors.textBlack} />
          </TouchableOpacity>
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TouchableOpacity>
            <Ionicons name="pencil" size={20} color={Colors.textBlack} />
          </TouchableOpacity>
        </View>

        {/* CNIC */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>CNIC</Text>
          <TouchableOpacity>
            <Ionicons name="pencil" size={20} color={Colors.textBlack} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.textWhite,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: Colors.textWhite,
    fontSize: 22,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 16,
    color: Colors.textBlack,
  },
});

export default ProfileSettings;
