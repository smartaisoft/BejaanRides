import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export type UserRole = 'driver' | 'passenger';

interface RegisterUserPayload {
  name: string;
  phone: string;
  role: UserRole;
  driverInfo?: {
    vehicleType: string;
    licensePlate: string;
    licenseURL: string;
  };
  passengerInfo?: {
    // optional: frequent locations etc.
  };
}

export const registerUserToFirestore = async (userData: RegisterUserPayload) => {
  const currentUser = auth().currentUser;

  if (!currentUser) {
    throw new Error('User not authenticated');
  }

  const userDoc = {
    name: userData.name,
    phone: userData.phone,
    role: userData.role,
    createdAt: firestore.FieldValue.serverTimestamp(),
    ...(userData.role === 'driver' && { driverInfo: userData.driverInfo }),
    ...(userData.role === 'passenger' && { passengerInfo: userData.passengerInfo }),
  };

  await firestore().collection('users').doc(currentUser.uid).set(userDoc);

  console.log('✅ User registered to Firestore');
};
