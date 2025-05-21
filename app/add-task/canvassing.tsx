import ProductSection from "@/components/products";
import ProductSelectionModal from "@/components/products-modal";
import TextField from "@/components/text-field";
import { addCanvassingTask } from "@/lib/addTaskService";
import { extractLocationFromGoogleMapsShortLink } from "@/lib/helper/extractLocation";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import Fontisto from "@expo/vector-icons/Fontisto";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Canvassing() {
  const [customerName, setCustomerName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [googleMapsLink, setGoogleMapsLink] = useState<string>("");
  const [coordinate, setCoordinate] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [modalProductVisible, setModalProductVisible] =
    useState<boolean>(false);

  const router = useRouter();

  const handleOnChangeGoogleMapLink = async (link: string) => {
    setGoogleMapsLink(link); // update state field-nya

    const data = await extractLocationFromGoogleMapsShortLink(link);

    if ("error" in data) {
      console.error(data.error);
      return;
    }

    setCoordinate(data.coordinate);
    setAddress(data.address || "");
  };

  const handleSubmit = async () => {
    if (!customerName || !phoneNumber || !googleMapsLink) {
      Alert.alert("Semua field harus diisi.");
    }
    const result = await addCanvassingTask(
      { name: customerName, phone: phoneNumber, coordinate, address },
      products
    );

    if (result.success) {
      Alert.alert("Berhasil", "Tugas berhasil ditambahkan.");
      router.replace("/(tabs)/tasks");
    } else {
      Alert.alert("Gagal", result.message || "Terjadi kesalahan");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          {/* Customer Name */}
          <TextField
            label="Nama Customer"
            placeholder="CV Sumber Makmur"
            value={customerName}
            onChangeText={setCustomerName}
          />

          {/* Phone Number */}
          <TextField
            label="Nomor Telepon"
            placeholder="08**********"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          {/* Google Maps Link */}
          <TextField
            label="Link Google Maps"
            placeholder="https://maps.app.goo.gl/abcde123"
            value={googleMapsLink}
            onChangeText={handleOnChangeGoogleMapLink}
            rightIcon={(color) => (
              <Fontisto name="paste" size={22} color={color} />
            )}
            onPressIcon={async () => {
              const text = await Clipboard.getStringAsync();
              handleOnChangeGoogleMapLink(text); // paste dan langsung proses
            }}
          />

          {/* Coordinate */}
          <TextField
            label="Koordinat"
            placeholder="0.0000, 0.0000"
            value={coordinate}
            onChangeText={setCoordinate}
          />

          {/* Address */}
          <TextField
            label="Alamat"
            placeholder="Jl. Raya No. 123, Probolinggo"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>
        {/* Product Section */}
        <ProductSection
          products={products} // Gunakan products, bukan initialProducts
          onProductsChange={setProducts} // Callback untuk update products
          containerStyle={{ flex: 1 }} // Tambahkan margin top
        />
      </View>
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalProductVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleSubmit}>
          <Text style={styles.continueButtonText}>Buat Tugas</Text>
        </TouchableOpacity>
      </View>

      {/* Product Selection Modal */}
      <ProductSelectionModal
        visible={modalProductVisible}
        title="Item Produk"
        products={products}
        onClose={() => setModalProductVisible(false)}
        onSelectProduct={setProducts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
  },
  footer: {
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  continueButton: {
    backgroundColor: "#4285F4",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4285F4",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
