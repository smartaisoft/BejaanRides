// redux/actions/rideActions.js
export const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';
export const SET_PICKUP_LOCATION = 'SET_PICKUP_LOCATION';
export const SET_DROPOFF_LOCATION = 'SET_DROPOFF_LOCATION';
export const SET_ROUTE_INFO = 'SET_ROUTE_INFO';
export const SET_ROUTE_TO_PICKUP = 'SET_ROUTE_TO_PICKUP';
export const SET_SELECTED_VEHICLE = 'SET_SELECTED_VEHICLE';
export const SET_SELECTED_VEHICLE_OPTION = 'SET_SELECTED_VEHICLE_OPTION';
export const SET_FARE = 'SET_FARE';
export const SET_RIDE_ID = 'SET_RIDE_ID';
export const SET_DRIVER_INFO = 'SET_DRIVER_INFO';
export const SET_DRIVER_LIVE_COORDS = 'SET_DRIVER_LIVE_COORDS';
export const SET_SELECTED_OFFER = 'SET_SELECTED_OFFER';
export const SET_SEARCHING_DRIVER = 'SET_SEARCHING_DRIVER';
export const SET_DRIVER_ARRIVED = 'SET_DRIVER_ARRIVED';
export const SET_RIDE_STATUS = 'SET_RIDE_STATUS';
export const SET_REGION = 'SET_REGION';
export const SET_SHOW_SUMMARY = 'SET_SHOW_SUMMARY';
export const SET_SUMMARY = 'SET_SUMMARY';
export const SET_SEARCH_MODAL = 'SET_SEARCH_MODAL';
export const SET_DRIVER_INFO_MODAL = 'SET_DRIVER_INFO_MODAL';

export const setCurrentLocation = (location: {
  latitude: number;
  longitude: number;
}) => ({
  type: SET_CURRENT_LOCATION,
  payload: location,
});
export const setPickupLocation = (location: {
  latitude: number;
  longitude: number;
}) => ({
  type: SET_PICKUP_LOCATION,
  payload: location,
});
export const setDropoffLocation = (location: {
  latitude: number;
  longitude: number;
}) => ({
  type: SET_DROPOFF_LOCATION,
  payload: location,
});
export const setRouteInfo = route => ({type: SET_ROUTE_INFO, payload: route});
export const setRouteToPickup = route => ({
  type: SET_ROUTE_TO_PICKUP,
  payload: route,
});
export const setSelectedVehicle = vehicle => ({
  type: SET_SELECTED_VEHICLE,
  payload: vehicle,
});
export const setSelectedVehicleOption = option => ({
  type: SET_SELECTED_VEHICLE_OPTION,
  payload: option,
});
export const setFare = fare => ({type: SET_FARE, payload: fare});
export const setRideId = rideId => ({type: SET_RIDE_ID, payload: rideId});
export const setDriverInfo = info => ({type: SET_DRIVER_INFO, payload: info});
export const setDriverLiveCoords = coords => ({
  type: SET_DRIVER_LIVE_COORDS,
  payload: coords,
});
export const setSelectedOffer = offer => ({
  type: SET_SELECTED_OFFER,
  payload: offer,
});
export const setSearchingDriver = isSearching => ({
  type: SET_SEARCHING_DRIVER,
  payload: isSearching,
});
export const setDriverArrived = hasArrived => ({
  type: SET_DRIVER_ARRIVED,
  payload: hasArrived,
});
export const setRideStatus = status => ({
  type: SET_RIDE_STATUS,
  payload: status,
});
export const setRegion = region => ({
  type: SET_REGION,
  payload: region,
});
export const setShowSummary = (summary: any) => ({
  type: SET_SHOW_SUMMARY,
  payload: summary,
});
export const setSummary = (summary: any) => ({
  type: SET_SUMMARY,
  payload: summary,
});
export const setShowSearchModal = (summary: any) => ({
  type: SET_SEARCH_MODAL,
  payload: summary,
});
export const setDriverInfoModal = (summary: any) => ({
  type: SET_DRIVER_INFO_MODAL,
  payload: summary,
});