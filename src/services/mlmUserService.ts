import firestore from '@react-native-firebase/firestore';
import {UserData} from './realTimeUserService';

export interface MLMLevelNetwork {
  level1: string[];
  level2: string[];
  level3: string[];
  level4: string[];
  level5: string[];
  level6: string[];
  level7: string[];
}

export interface Wallet {
  rideBalance: number;
  commissionIncome: number;
  withdrawalBalance: number;
  transactionHistory: Array<{
    type: string;
    amount: number;
    date: string;
    description: string;
  }>;
}

export interface MLMUserData extends UserData {
  referralCode?: string; // <-- ✅ ADD THIS
  referrerUid?: string | null; // UID of the referrer ✅ add this
  referredBy?: string | null;
  mlmNetwork?: MLMLevelNetwork;
  isSubscribed?: boolean;
  isApproved?: boolean;
  wallet?: Wallet;
}



export const createUserWithReferral = async (
  user: UserData,
  referrerUid?: string,
) => {
  try {
    // ✅ Check if the user already exists — prevent duplicate creation
    const existingDoc = await firestore()
      .collection('users')
      .doc(user.uid)
      .get();
    if (existingDoc.exists()) {
      console.log('User already exists, skipping referral generation');
      return;
    }

    const referralCode = generateReferralCode(user.name, user.uid);

    const mlmNetwork: MLMLevelNetwork = {
      level1: [],
      level2: [],
      level3: [],
      level4: [],
      level5: [],
      level6: [],
      level7: [],
    };

    if (referrerUid) {
      const refDoc = await firestore()
        .collection('users')
        .doc(referrerUid)
        .get();

      if (refDoc.exists()) {
        const refData = refDoc.data() as MLMUserData;

        mlmNetwork.level1.push(referrerUid);

        const parentNetwork = refData.mlmNetwork;
        if (parentNetwork) {
          if (parentNetwork.level1?.[0]) {
            mlmNetwork.level2.push(parentNetwork.level1[0]);
          }
          if (parentNetwork.level2?.[0]) {
            mlmNetwork.level3.push(parentNetwork.level2[0]);
          }
          if (parentNetwork.level3?.[0]) {
            mlmNetwork.level4.push(parentNetwork.level3[0]);
          }
          if (parentNetwork.level4?.[0]) {
            mlmNetwork.level5.push(parentNetwork.level4[0]);
          }
          if (parentNetwork.level5?.[0]) {
            mlmNetwork.level6.push(parentNetwork.level5[0]);
          }
          if (parentNetwork.level6?.[0]) {
            mlmNetwork.level7.push(parentNetwork.level6[0]);
          }
        }
      }
    }

    const fullUserData: MLMUserData = {
      ...user,
      referralCode,
      referredBy: referrerUid || null,
      mlmNetwork,
      isSubscribed: false,
      isApproved: false,
      wallet: {
        rideBalance: 0,
        commissionIncome: 0,
        withdrawalBalance: 0,
        transactionHistory: [],
      },
    };

    await firestore().collection('users').doc(user.uid).set(fullUserData);
    console.log('✅ User with referral and MLM network created');
  } catch (error) {
    console.error('❌ Failed to create user with referral:', error);
  }
};

export const generateReferralCode = (name: string, uid: string): string => {
  const cleanName = name.replace(/\s+/g, '').toLowerCase();
  const shortUid = uid.substring(0, 6).toUpperCase();
  return `${cleanName}_${shortUid}`;
};
