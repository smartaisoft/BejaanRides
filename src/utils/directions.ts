export type Coordinate = { latitude: number; longitude: number };

export type RouteInfo = {
  path: Coordinate[];
  distanceKm: number;
  durationText: string;
};

const GOOGLE_MAPS_API_KEY = 'AIzaSyCb2ys2AD6NTFhnEGXNsDrjSXde6d569vU';

export const decodePolyline = (t: string): Coordinate[] => {
  let points: Coordinate[] = [];
  let index = 0, lat = 0, lng = 0;

  while (index < t.length) {
    let b, shift = 0, result = 0;
    do {
      b = t.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = t.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }

  return points;
};

export const getRouteDirections = async (
  origin: Coordinate,
  destination: Coordinate,
): Promise<RouteInfo | null> => {
  const originStr = `${origin.latitude},${origin.longitude}`;
  const destinationStr = `${destination.latitude},${destination.longitude}`;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&key=${GOOGLE_MAPS_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes.length > 0) {
      const points = decodePolyline(data.routes[0].overview_polyline.points);
      const leg = data.routes[0].legs[0];
      const distanceKm = leg.distance.value / 1000; // meters to km
      const durationText = leg.duration.text;
      return { path: points, distanceKm, durationText };
    } else {
      throw new Error('No route found');
    }
  } catch (err) {
    console.error('Directions API error:', err);
    return null;
  }
};
