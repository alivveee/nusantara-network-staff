import * as Location from "expo-location";

const getCurrentLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    console.warn("Permission to access location was denied");
    return null;
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const coords = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };

  return coords;
};

export default getCurrentLocation;
