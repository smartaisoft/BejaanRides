import axios from 'axios';

export interface RouteInfo {
  distanceText: string;
  durationText: string;
}

export const getRouteInfo = async (
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  apiKey: string
): Promise<RouteInfo> => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/directions/json`,
    {
      params: {
        origin: `${originLat},${originLng}`,
        destination: `${destLat},${destLng}`,
        key: apiKey,
      },
    }
  );

  const leg = response.data.routes[0]?.legs[0];
  if (!leg) throw new Error('No route found.');

  return {
    distanceText: leg.distance.text,
    durationText: leg.duration.text,
  };
};
