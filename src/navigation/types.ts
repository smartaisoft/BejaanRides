export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  PhoneLogin: undefined;
  Otp: {method: string; phone: string};
  Role: undefined;
  Name: undefined;
  Location: {name: string};
  DriverPersonalInfo: undefined;
  InviteFriend: undefined;
  Setting: undefined;
  ProfileSetting: undefined; // ✅ must be here
  Settings: undefined; // ✅ add this if not defined
  HomeMapScreen: undefined;
  Topup: undefined;
  Investment: {
    planTitle: string;
    planPrice: string;
  };
  MyWallet: undefined;
  Subscriptions: undefined;
  SubscriptionPlansScreen: undefined;
  DriverProfile:undefined;
};
