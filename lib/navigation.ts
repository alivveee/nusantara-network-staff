import { Alert, Linking } from "react-native";

export const navigateToCoordinate = async (
  destination: string,
  destinationName?: string,
  travelMode: "d" | "w" | "b" | "r" = "d"
): Promise<boolean> => {
  try {
    const cleanDestination = destination.replace(/\s+/g, "");

    // Validasi format koordinat
    const coordRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    if (!coordRegex.test(cleanDestination)) {
      throw new Error(
        'Format koordinat tidak valid. Format yang benar adalah "latitude,longitude"'
      );
    }

    // Langsung gunakan HTTPS URL yang universal
    const travelModes: Record<string, string> = {
      d: "driving",
      w: "walking",
      b: "bicycling",
      r: "transit",
    };

    let url = `https://www.google.com/maps/dir/?api=1&destination=${cleanDestination}&travelmode=${travelModes[travelMode]}`;

    if (destinationName) {
      url += `&destination_name=${encodeURIComponent(destinationName)}`;
    }

    // Langsung buka tanpa cek canOpenURL untuk HTTPS
    await Linking.openURL(url);
    return true;
  } catch (error) {
    Alert.alert("Navigasi Gagal", "Tidak dapat membuka Google Maps", [
      { text: "OK" },
    ]);
    console.error("Navigation error:", error);
    return false;
  }
};
