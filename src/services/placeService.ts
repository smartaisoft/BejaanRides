import firestore from '@react-native-firebase/firestore';

const placesCollection = firestore().collection('places');

export const createPlace = async (id: string, data: any) => {
  return placesCollection.doc(id).set(data);
};

export const getPlace = async (id: string) => {
  const doc = await placesCollection.doc(id).get();
  return doc.exists() ? doc.data() : null;
};

export const updatePlace = async (id: string, data: Partial<any>) => {
  return placesCollection.doc(id).update(data);
};

export const deletePlace = async (id: string) => {
  return placesCollection.doc(id).delete();
};

export const getAllPlaces = async () => {
  const snapshot = await placesCollection.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
