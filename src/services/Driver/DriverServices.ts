import database from '@react-native-firebase/database';
export const listenForPendingRideRequests = (
  driverId: string,
  driverVehicleType: string,
  onUpdate: (rides: any[]) => void,
): (() => void) => {
  const ref = database().ref('/rideRequests');
  console.log('ref🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥', ref, 'in listener of drviver');
  const listener = ref.on('value', snapshot => {
    console.log('🔥 Firebase listener triggered');

    const data = snapshot.val();
    console.log('🔥 Raw rideRequests snapshot:', data);

    if (!data) {
      console.warn('⚠️ No data found in rideRequests');
      onUpdate([]);
      return;
    }

    const filtered = Object.entries(data)
      .filter(([_, ride]: any) => {
        const statusMatch = ride.status === 'pending';
        const typeMatch =
          ride.vehicleType?.toLowerCase() === driverVehicleType.toLowerCase();
        const notRejected = !ride.rejectedDrivers?.[driverId];

        console.log('🔍 Ride:', ride);
        console.log(`  Status match: ${statusMatch}`);
        console.log(`  Type match: ${typeMatch}`);
        console.log(`  Not rejected: ${notRejected}`);

        return statusMatch && typeMatch && notRejected;
      })
      .map(([id, ride]: any) => ({
        id,
        ...ride,
      }));

    console.log('✅ Filtered pending rides:', filtered);
    onUpdate(filtered);
  });

  return () => ref.off('value', listener);
};
