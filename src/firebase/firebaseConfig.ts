// firebase/firebaseConfig.ts
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBm08IrroljcXSn1uD9DqRlUNtTtE6-kK8',
  authDomain: 'arryv-d.firebaseapp.com',
  databaseURL: 'https://arryv-d-default-rtdb.firebaseio.com',
  projectId: 'arryv-d',
  storageBucket: 'arryv-d.appspot.com',
  messagingSenderId: '611125770089',
  appId: '1:611125770089:android:7485a5cb864b118b3faff8',
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
