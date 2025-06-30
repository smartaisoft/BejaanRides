import firestore from '@react-native-firebase/firestore';

export type UserRole = 'driver' | 'passenger';

export interface UserData {
  uid: string;
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  driverInfo?: any; // You can define a proper type if you want
}

export const createOrUpdateUser = async (user: UserData) => {
  try {
    await firestore().collection('users').doc(user.uid).set(user);
    console.log('✅ User created/updated in Firestore');
  } catch (error) {
    console.error('❌ Failed to create/update user:', error);
  }
};

/**
 * Get a user document
 */
export const getUserByUid = async (uid: string): Promise<UserData | null> => {
  try {
    const doc = await firestore().collection('users').doc(uid).get();
    if (doc.exists()) {
      return doc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to fetch user:', error);
    return null;
  }
};
// src/services/realTimeUserService.ts

// ✅ Firestore version
export const getDriverByUid = async (uid: string): Promise<UserData | null> => {
  try {
    const doc = await firestore().collection('users').doc(uid).get();
    if (doc.exists()) {
      return doc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to fetch driver:', error);
    return null;
  }
};


/**
 * Update fields of a user document
 */
export const updateUser = async (
  uid: string,
  updatedFields: Partial<Omit<UserData, 'uid'>>
) => {
  try {
    await firestore().collection('users').doc(uid).update(updatedFields);
    console.log('✅ User updated in Firestore');
  } catch (error) {
    console.error('❌ Failed to update user:', error);
  }
};

/**
 * Delete a user document
 */
export const deleteUser = async (uid: string) => {
  try {
    await firestore().collection('users').doc(uid).delete();
    console.log('🗑️ User deleted from Firestore');
  } catch (error) {
    console.error('❌ Failed to delete user:', error);
  }
};
