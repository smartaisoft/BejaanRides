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

const MLM_PERCENTAGES = [
  0.1, // 10% - Level 1
  0.07, // 7%
  0.05,
  0.03,
  0.02,
  0.015,
  0.01, // 1% - Level 7
];

export interface Wallet {
  rideBalance: number;
  commissionIncome: number;
  withdrawalBalance: number;
  totalCommission:number;
  totalDeposit: number; // ✅ new
  totalInvestment: number; // ✅ new
  totalWithdraw: number; // ✅ new
  totalReferral: number; // ✅ new
  referralBonus: number; // ✅ optional if not already included
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

export const approveSubscriptionAndDistributeMLM = async (
  subscriptionId: string,
) => {
  try {
    const subDoc = await firestore()
      .collection('subscriptions')
      .doc(subscriptionId)
      .get();

    if (!subDoc.exists) {
      throw new Error('❌ Subscription not found');
    }

    const subscription = subDoc.data();
    if (!subscription) {
      throw new Error('❌ Invalid subscription data');
    }

    if (subscription.status === 'approved') {
      return;
    }

    const userId = subscription.userId;
    let amount = subscription.selectedAmount ?? subscription.amount;

    amount = Number(amount); // ✅ Convert to number explicitly
    if (isNaN(amount) || amount <= 0) {
      throw new Error(`❌ Invalid amount: ${subscription.selectedAmount}`);
    }

    const userDoc = await firestore().collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new Error(`❌ User not found: ${userId}`);
    }

    const user = userDoc.data() as MLMUserData;
    const network = user.mlmNetwork || {};

    const updates: Promise<any>[] = [];

    // ✅ Step 1: Credit full amount to user's rideBalance
    updates.push(
      firestore()
        .collection('users')
        .doc(userId)
        .update({
          'wallet.rideBalance': firestore.FieldValue.increment(amount),
          isSubscribed: true,
          subscriptionExpiry: generateExpiryDate(),
        }),
    );

    // ✅ Step 2: Distribute commissions to 7-level MLM network
    for (let i = 0; i < 7; i++) {
      const levelKey = `level${i + 1}` as keyof MLMLevelNetwork;
      const referrerUid = network[levelKey]?.[0];

      if (!referrerUid) {
        continue;
      }

      const commission = parseFloat((amount * MLM_PERCENTAGES[i]).toFixed(2));
      if (isNaN(commission) || commission <= 0) {
        continue;
      }

      updates.push(
        firestore()
          .collection('users')
          .doc(referrerUid)
          .update({
            'wallet.commissionIncome':
              firestore.FieldValue.increment(commission),
            'wallet.transactionHistory': firestore.FieldValue.arrayUnion({
              type: 'commission',
              amount: commission,
              date: new Date().toISOString(),
              description: `Level ${i + 1} commission from UID ${userId}`,
            }),
          }),
      );
    }

    // ✅ Step 3: Mark subscription as approved
    updates.push(
      firestore().collection('subscriptions').doc(subscriptionId).update({
        status: 'approved',
      }),
    );

    await Promise.all(updates);
    console.log('✅ MLM commission distributed successfully!');
  } catch (err) {
    console.error('❌ MLM distribution error:', err);
  }
};

function generateExpiryDate(): string {
  const now = new Date();
  now.setMonth(now.getMonth() + 1);
  return now.toISOString();
} // 📅 One-month expiry for subscription
