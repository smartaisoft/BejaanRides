import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection('users');

export const createUser = async (uid: string, data: any) => {
  return usersCollection.doc(uid).set(data);
};

export const getUser = async (uid: string) => {
  const doc = await usersCollection.doc(uid).get();
return doc.exists() ? doc.data() : null;
};

export const updateUser = async (uid: string, data: Partial<any>) => {
  return usersCollection.doc(uid).update(data);
};


export const deleteUser = async (uid: string) => {
  return usersCollection.doc(uid).delete();
};
