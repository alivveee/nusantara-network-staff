import { Alert, Linking, Platform } from "react-native";

/**
 * Fungsi untuk membuka aplikasi Google Maps dengan navigasi ke koordinat tujuan
 *
 * @param {string} destination - Koordinat tujuan dalam format "latitude,longitude" (contoh: "-7.758113773966092, 113.22837119484377")
 * @param {string} [destinationName] - Nama lokasi tujuan (opsional)
 * @param {string} [travelMode="d"] - Mode perjalanan: driving (d), walking (w), bicycling (b), transit (r)
 * @returns {Promise<boolean>} - Promise yang bernilai true jika berhasil membuka Google Maps
 */
export const navigateToCoordinate = async (
  destination: string,
  destinationName?: string,
  travelMode: "d" | "w" | "b" | "r" = "d"
): Promise<boolean> => {
  try {
    // Bersihkan koordinat dari spasi yang tidak diinginkan
    const cleanDestination = destination.replace(/\s+/g, "");

    // Validasi format koordinat
    const coordRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
    if (!coordRegex.test(cleanDestination)) {
      throw new Error(
        'Format koordinat tidak valid. Format yang benar adalah "latitude,longitude"'
      );
    }

    // Tentukan URL scheme berdasarkan platform
    let url;

    if (Platform.OS === "android") {
      // URL untuk Android
      url = `google.navigation:q=${cleanDestination}&mode=${travelMode}`;

      // Tambahkan nama lokasi jika tersedia
      if (destinationName) {
        url += `&title=${encodeURIComponent(destinationName)}`;
      }
    } else {
      // URL untuk iOS
      // Konversi mode perjalanan ke format Apple Maps
      const mapsModes: Record<string, string> = {
        d: "driving",
        w: "walking",
        b: "bicycling",
        r: "transit",
      };

      // Gunakan Universal Link Google Maps untuk iOS
      url = `https://www.google.com/maps/dir/?api=1&destination=${cleanDestination}&travelmode=${mapsModes[travelMode]}`;

      // Tambahkan nama lokasi jika tersedia
      if (destinationName) {
        url += `&destination_name=${encodeURIComponent(destinationName)}`;
      }
    }

    // Periksa apakah URL dapat dibuka
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      throw new Error(
        "Tidak dapat membuka Google Maps. Pastikan aplikasi Google Maps terpasang."
      );
    }

    // Buka URL
    await Linking.openURL(url);
    return true;
  } catch (error) {
    // Tampilkan alert jika terjadi error
    Alert.alert(
      "Navigasi Gagal",
      error instanceof Error
        ? error.message
        : "Tidak dapat membuka Google Maps",
      [{ text: "OK" }]
    );
    console.error("Navigation error:", error);
    return false;
  }
};

