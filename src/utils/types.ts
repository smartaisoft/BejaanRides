// utils/types.ts

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type Region = Coordinate & {
  latitudeDelta: number;
  longitudeDelta: number;
};

export type VehicleOption = {
  id: string;
  name: string;
  icon: string;
  price: number;
  time: string;
  distance: string;
};

export type Suggestion = {
  id: string;
  name: string;
  isGooglePlace: boolean;
};
