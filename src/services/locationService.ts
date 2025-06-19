import firestore from '@react-native-firebase/firestore';

// Reference to the 'locations' collection
const locationsCollection = firestore().collection('locations');

// ✅ Create a new location document
export const createLocation = async (id: string, data: any) => {
  return locationsCollection.doc(id).set(data);
};

// ✅ Get a location document by ID
export const getLocation = async (id: string) => {
  const doc = await locationsCollection.doc(id).get();
  return doc.exists() ? doc.data() : null;
};

// ✅ Update a location document by ID
export const updateLocation = async (id: string, data: Partial<any>) => {
  return locationsCollection.doc(id).update(data);
};

// ✅ Delete a location document by ID
export const deleteLocation = async (id: string) => {
  return locationsCollection.doc(id).delete();
};

// ✅ Get all locations (optional utility)
export const getAllLocations = async () => {
  const snapshot = await locationsCollection.get();
  return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
};
