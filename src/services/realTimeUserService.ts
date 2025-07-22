import firestore from '@react-native-firebase/firestore';
import { MLMUserData } from './mlmUserService';

export type UserRole = 'driver' | 'passenger';

export interface UserData {
  uid: string;
  name: string;
  phone: string;
  email: string;
  cnic: string;
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
// export const getUserByUid = async (uid: string): Promise<UserData | null> => {
//   try {
//     const doc = await firestore().collection('users').doc(uid).get();
//     if (doc.exists()) {
//       return doc.data() as UserData;
//     }
//     return null;
//   } catch (error) {
//     console.error('❌ Failed to fetch user:', error);
//     return null;
//   }
// };

export const getUserByUid = async (uid: string): Promise<MLMUserData | null> => {
  try {
    const doc = await firestore().collection('users').doc(uid).get();
    if (doc.exists()) {
      return doc.data() as MLMUserData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by UID:', error);
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

/**
 * Get user by phone number
 */
export const getUserByPhone = async (phone: string): Promise<UserData | null> => {
  try {
    const querySnapshot = await firestore()
      .collection('users')
      .where('phone', '==', phone)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to fetch user by phone:', error);
    return null;
  }
};
