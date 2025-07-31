/* eslint-disable curly */

import {useEffect} from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AsyncStorage from '@react-native-async-storage/async-storage';

const extractQueryParams = (url: string): Record<string, string> => {
  const query = url.split('?')[1];
  return (
    query?.split('&').reduce((acc, part) => {
      const [key, value] = part.split('=');
      if (key && value)
        acc[decodeURIComponent(key)] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>) || {}
  );
};

const ReferralListener = () => {
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(async link => {
        if (link?.url) {
          const params = extractQueryParams(link.url);
          const referredBy = params.refCode;
          const referrUid = params.uid;

          if (referredBy && referrUid) {
            const referralInfo = {
              referredBy,
              referrUid,
            };

            try {
              await AsyncStorage.setItem(
                'referralInfo',
                JSON.stringify(referralInfo),
              );
              console.log(
                '✅ Referral info saved to AsyncStorage:',
                referralInfo,
              );
            } catch (error) {
              console.error('❌ Error saving referral info:', error);
            }
          }
        }
      });

    const unsubscribe = dynamicLinks().onLink(link => {
      if (link?.url) {
        const params = extractQueryParams(link.url);
        console.log('🔗 App received link while running:', params);
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default ReferralListener;
