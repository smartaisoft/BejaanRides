import firestore from '@react-native-firebase/firestore';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {updateTopupList} from '../redux/actions/topupActions';

const useTopupListener = (userId: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = firestore()
      .collection('topups')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          if (!snapshot?.docs) {
            console.warn('⚠️ Snapshot has no docs');
            return;
          }

          const updatedTopups = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          dispatch(updateTopupList(updatedTopups));
        },
        error => {
          console.error('❌ Firestore onSnapshot error:', error);
        }
      );

    return () => unsubscribe();
  }, [userId]);
};

export default useTopupListener;
