import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export type VehicleInfo = {
  vehicleType: string;
  model: string;
  brand: string;
  color: string;
  plateNumber: string;
  images: {
    certificateFront: string | null;
    certificateBack: string | null;
    vehiclePhoto: string | null;
  };
  createdAt: string;
};

export const saveVehicleInfo = async (
  vehicleData: VehicleInfo,
): Promise<void> => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not logged in');

  await firestore().collection('vehicles').doc(userId).set(vehicleData);

  console.log('✅ Vehicle info saved to Firestore');
};

/**
 * Get vehicle info for the current user
 */
export const getVehicleInfo = async (): Promise<VehicleInfo | null> => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not logged in');

  const doc = await firestore().collection('vehicles').doc(userId).get();
  if (doc.exists) {
    return doc.data() as VehicleInfo;
  }
  return null;
};

/**
 * Delete vehicle info for the current user
 */
export const deleteVehicleInfo = async (): Promise<void> => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not logged in');

  await firestore().collection('vehicles').doc(userId).delete();
  console.log('🗑️ Vehicle info deleted from Firestore');
};

/**
 * Get vehicle info by driver UID
 */
export const getVehicleInfoByDriverId = async (
  driverId: string,
): Promise<VehicleInfo | null> => {
  const doc = await firestore().collection('vehicles').doc(driverId).get();
  if (doc.exists) {
    return doc.data() as VehicleInfo;
  }
  return null;
};

