import Constants from "expo-constants";

export interface Coordinates {
  lat: number;
  lng: number;
}

// Expand short Google Maps links (e.g. maps.app.goo.gl)
export async function expandGoogleMapsShortLink(
  shortUrl: string
): Promise<string | null> {
  try {
    const response = await fetch(shortUrl, {
      method: "GET",
      redirect: "follow",
    });
    return response.url;
  } catch (error) {
    console.error("Failed to expand link:", error);
    return null;
  }
}

// Try to extract coordinates from known Google Maps URL formats
export function extractCoordinatesFromGMapsLink(
  url: string
): Coordinates | null {
  const atRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const qRegex = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;

  const atMatch = url.match(atRegex);
  if (atMatch) {
    return {
      lat: parseFloat(atMatch[1]),
      lng: parseFloat(atMatch[2]),
    };
  }

  const qMatch = url.match(qRegex);
  if (qMatch) {
    return {
      lat: parseFloat(qMatch[1]),
      lng: parseFloat(qMatch[2]),
    };
  }

  return null;
}

// Call reverse geocoding API to convert coordinates to address
export async function getAddressFromCoordinates(
  lat: number,
  lng: number
): Promise<string | null> {
  const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
  if (!apiKey) {
    console.error(
      "Google Maps API key not found in Constants.expoConfig.extra"
    );
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      console.warn("No address found:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
}

// Use Geocoding API to find coordinates from address string (fallback)
export async function getCoordinatesFromAddress(
  placeName: string
): Promise<Coordinates | null> {
  const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey;
  if (!apiKey) {
    console.error(
      "Google Maps API key not found in Constants.expoConfig.extra"
    );
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      placeName
    )}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].geometry.location;
    } else {
      console.warn("No coordinates found from address:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates from address:", error);
    return null;
  }
}

// Main handler: accepts short or long link and resolves coordinates + address
export async function extractLocationFromGoogleMapsShortLink(
  link: string
): Promise<
  | {
      coordinate: string;
      address: string | null;
    }
  | { error: string }
> {
  const isShortLink = link.includes("maps.app.goo.gl");

  const expanded = isShortLink ? await expandGoogleMapsShortLink(link) : link;
  if (!expanded) return { error: "Gagal expand link Google Maps." };

  const coords = extractCoordinatesFromGMapsLink(expanded);
  if (coords) {
    const address = await getAddressFromCoordinates(coords.lat, coords.lng);
    return {
      coordinate: `${coords.lat}, ${coords.lng}`,
      address,
    };
  }

  // Try to extract place name from URL
  const placeMatch = expanded.match(/\/place\/([^\/?]+)/);
  const placeName = placeMatch
    ? decodeURIComponent(placeMatch[1].replace(/\+/g, " "))
    : null;

  if (placeName) {
    const location = await getCoordinatesFromAddress(placeName);
    if (location) {
      const address = await getAddressFromCoordinates(
        location.lat,
        location.lng
      );
      return {
        coordinate: `${location.lat}, ${location.lng}`,
        address,
      };
    }
  }

  return { error: "Koordinat tidak ditemukan dalam URL atau nama tempat." };
}
