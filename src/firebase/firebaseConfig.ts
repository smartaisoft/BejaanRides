// // firebase/firebaseConfig.ts
// import {initializeApp} from 'firebase/app';
// import {getAuth} from 'firebase/auth';
// import {getDatabase} from 'firebase/database';

// const firebaseConfig = {
//   apiKey: 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU',
//   authDomain: 'arryv-d.firebaseapp.com',
//   databaseURL: 'https://arryv-d-default-rtdb.firebaseio.com',
//   projectId: 'arryv-d',
//   storageBucket: 'arryv-d.appspot.com',
//   messagingSenderId: '611125770089',
//   appId: '1:956115761712:android:7eb5f619c5bd86fb3c4bf5',
// };
// const app = initializeApp(firebaseConfig);

// export const auth = getAuth(app);
// export const database = getDatabase(app);



import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: 'AIzaSyBVRWtK4l4kl4uWUNhqeA6bpmsVV-RPtMs',
  authDomain: 'beejan-3e0f9.firebaseapp.com',
  projectId: 'beejan-3e0f9',
  storageBucket: 'beejan-3e0f9.appspot.com',
  messagingSenderId: '956115761712',
  appId: '1:956115761712:android:7eb5f619c5bd86fb3c4bf5',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
