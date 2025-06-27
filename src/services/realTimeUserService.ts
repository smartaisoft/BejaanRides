// // firebase/realtimeUserService.ts
// import database from '@react-native-firebase/database';

// export type UserRole = 'driver' | 'passenger';

// export interface UserData {
//   uid: string;
//   name: string;
//   phone: string;
//   role: UserRole;
//   createdAt: string;
// }

// // 🔹 Create or Update User
// export const createOrUpdateUser = async (user: UserData) => {
//   try {
//     await database()
//       .ref(`/users/${user.uid}`)
//       .set({
//         name: user.name,
//         phone: user.phone,
//         role: user.role,
//         createdAt: user.createdAt,
//       });

//     console.log('✅ User created/updated in Realtime DB');
//   } catch (error) {
//     console.error('❌ Failed to create/update user:', error);
//   }
// };

// // 🔹 Get User by UID
// export const getUserByUid = async (uid: string): Promise<UserData | null> => {
//   try {
//     const snapshot = await database().ref(`/users/${uid}`).once('value');
//     if (snapshot.exists()) {
//       return { uid, ...snapshot.val() };
//     }
//     return null;
//   } catch (error) {
//     console.error('❌ Failed to fetch user:', error);
//     return null;
//   }
// };

// // 🔹 Update User Fields
// export const updateUser = async (
//   uid: string,
//   updatedFields: Partial<Omit<UserData, 'uid' | 'createdAt'>>
// ) => {
//   try {
//     await database().ref(`/users/${uid}`).update(updatedFields);
//     console.log('✅ User updated');
//   } catch (error) {
//     console.error('❌ Failed to update user:', error);
//   }
// };

// // 🔹 Delete User
// export const deleteUser = async (uid: string) => {
//   try {
//     await database().ref(`/users/${uid}`).remove();
//     console.log('🗑️ User deleted from Realtime DB');
//   } catch (error) {
//     console.error('❌ Failed to delete user:', error);
//   }
// };
// src/services/firestoreUserService.ts
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

/**
 * Create or overwrite a user document
 */
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
    if (doc.exists) {
      return doc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to fetch user:', error);
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
