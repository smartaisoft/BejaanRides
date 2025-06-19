import firestore from '@react-native-firebase/firestore';

const walletsCollection = firestore().collection('wallets');

export const createWallet = async (userId: string, data: any) => {
  return walletsCollection.doc(userId).set(data);
};

export const getWallet = async (userId: string) => {
  const doc = await walletsCollection.doc(userId).get();
  return doc.exists() ? doc.data() : null;
};

export const updateWallet = async (userId: string, data: Partial<any>) => {
  return walletsCollection.doc(userId).update(data);
};

export const deleteWallet = async (userId: string) => {
  return walletsCollection.doc(userId).delete();
};
