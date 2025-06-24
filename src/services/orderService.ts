import firestore from '@react-native-firebase/firestore';

const ordersCollection = firestore().collection('orders');

export const createOrder = async (orderId: string, data: any) => {
  return ordersCollection.doc(orderId).set(data);
};

export const getOrder = async (orderId: string) => {
  const doc = await ordersCollection.doc(orderId).get();
  return doc.exists() ? doc.data() : null;
};

export const updateOrder = async (orderId: string, data: Partial<any>) => {
  return ordersCollection.doc(orderId).update(data);
};

export const deleteOrder = async (orderId: string) => {
  return ordersCollection.doc(orderId).delete();
};

export const getOrdersByUser = async (userId: string) => {
  const snapshot = await ordersCollection.where('userId', '==', userId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
