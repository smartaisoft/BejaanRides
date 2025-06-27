// src/services/vehicleService.ts

import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

export type VehicleInfo = {
 vehicleType:string; // e.g., 'car', 'bike', 'riksha', 'loader'
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

/**
 * Save or update vehicle info under current user's UID
 */
export const saveVehicleInfo = async (vehicleData: VehicleInfo): Promise<void> => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not logged in');

  await database()
    .ref(`/vehicles/${userId}`)
    .set(vehicleData);
};

/**
 * Get vehicle info for the current user
 */
export const getVehicleInfo = async (): Promise<VehicleInfo | null> => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not logged in');

  const snapshot = await database().ref(`/vehicles/${userId}`).once('value');
  return snapshot.val();
};

/**
 * Delete vehicle info for the current user
 */
export const deleteVehicleInfo = async (): Promise<void> => {
  const userId = auth().currentUser?.uid;
  if (!userId) throw new Error('User not logged in');

  await database().ref(`/vehicles/${userId}`).remove();
};
