import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

export const submitTopup = async (payload: {
  depositAmount: number;
  rideBalance: number;
  method: string;
  slipFileName: string;
  slipUri: string;
  slipType: string;
  userId: string;
}) => {
  try {
    const topupId = uuid.v4();
    const filename = `${payload.userId}_${Date.now()}`;
    const reference = storage().ref(`topups/${payload.userId}/${filename}`);

    // ✅ Upload file to Firebase Storage
    console.log('Uploading file from:', payload.slipUri);
    await reference.putFile(payload.slipUri);

    // ✅ Get image download URL
    const downloadURL = await reference.getDownloadURL();
    console.log('✅ File uploaded. URL:', downloadURL);

    // ✅ Save topup to top-level 'topups' collection
    await firestore()
      .collection('topups')
      .doc(topupId.toString())
      .set({
        id: topupId,
        userId: payload.userId,
        depositAmount: payload.depositAmount,
        method: payload.method,
        slipUrl: downloadURL,
        slipFileName: payload.slipFileName,
        slipType: payload.slipType,
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    console.log('✅ Topup uploaded to Firestore');

    // ✅ Update user balance
    const userRef = firestore().collection('users').doc(payload.userId);
    const userDoc = await userRef.get();

    const currentDeposit = userDoc.exists ? userDoc.data()?.depositAmount || 0 : 0;
    const currentBalance = userDoc.exists ? userDoc.data()?.rideBalance || 0 : 0;

    await userRef.set(
      {
        depositAmount: currentDeposit + payload.depositAmount,
        rideBalance: currentBalance,
      },
      { merge: true }
    );

    return true;
  } catch (error) {
    console.error('❌ Topup submission error:', error);
    throw error;
  }
};
