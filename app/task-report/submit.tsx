import TextField from "@/components/text-field";
import getCurrentLocation from "@/lib/location";
import { addReport, readProductsByTaskId } from "@/lib/reportTaskService";
import { Product } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductSection from "../../components/products";
import ProductSelectionModal from "../../components/products-modal";

export default function SubmitReport() {
  const [recipient, setRecipient] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { taskId, status, note, routeId } = useLocalSearchParams<{
    taskId: string;
    status: string;
    note: string;
    routeId: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const coords = await getCurrentLocation();

    if (!coords) {
      setIsSubmitting(false);
      Alert.alert("Gagal", "Gagal mendapatkan lokasi. Pastikan GPS aktif.");
      return;
    }

    const result = await addReport(
      taskId,
      routeId,
      note,
      recipient,
      status,
      products,
      coords
    );
    setIsSubmitting(false);

    if (!result.success) {
      Alert.alert("Gagal", result.message || "Terjadi kesalahan");
    } else {
      Alert.alert("Berhasil", "Laporan berhasil ditambahkan!");
      router.replace("/(tabs)");
    }
  };

  const fetchProducts = async () => {
    const data = await readProductsByTaskId(taskId);
    if (data) {
      setProducts(data);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content}>
        {/* Recipient */}
        <View style={styles.formContainer}>
          <TextField
            label="Penerima"
            placeholder="Masukkan nama penerima"
            value={recipient}
            onChangeText={setRecipient}
          />
        </View>

        {/* Product Section - Gunakan komponen dengan controlled state */}
        <ProductSection
          title="Produk"
          products={products} // Gunakan products, bukan initialProducts
          onProductsChange={setProducts} // Callback untuk update products
        />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Selesai</Text>
        </TouchableOpacity>
      </View>

      {/* Product Selection Modal */}
      <ProductSelectionModal
        visible={modalVisible}
        title="Item Produk"
        products={products}
        onClose={() => setModalVisible(false)}
        onSelectProduct={setProducts}
      />
    </SafeAreaView>
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
    padding: 20,
    paddingBottom: 0,
  },
  footer: {
    backgroundColor: "white",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  submitButton: {
    backgroundColor: "#4285F4",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 100,
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
