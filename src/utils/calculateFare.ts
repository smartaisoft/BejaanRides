export const calculateFare = (
  distanceText: string | undefined,
  durationText: string | undefined,
  vehicleType: string,
): number => {
  const baseFare = 100;
  const perKm = 40;
  const perMin = 3;

  let vehicleMultiplier = 1;
  switch (vehicleType) {
    case 'Bike':
      vehicleMultiplier = 0.7;
      break;
    case 'Car':
      vehicleMultiplier = 1;
      break;
    case 'Luxury':
      vehicleMultiplier = 1.8;
      break;
    case 'ElectricCar':
      vehicleMultiplier = 1.3;
      break;
    case 'Limousine':
      vehicleMultiplier = 2.2;
      break;
    default:
      vehicleMultiplier = 1;
  }

  const distanceKm = distanceText
    ? parseFloat(parseFloat(distanceText.replace('km', '').trim()).toFixed(1))
    : 0;

  const durationMin = durationText
    ? parseInt(durationText.replace('min', '').trim(), 10)
    : 0;

  const fare =
    vehicleMultiplier * (baseFare + distanceKm * perKm + durationMin * perMin);

  return Math.round(fare);
};
