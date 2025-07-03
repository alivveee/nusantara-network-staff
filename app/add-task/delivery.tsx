import ProductSection from "@/components/products";
import ProductSelectionModal from "@/components/products-modal";
import TextField from "@/components/text-field";
import { addDeliveryTask } from "@/lib/addTaskService";
import { readCustomerById } from "@/lib/customerService";
import { Customer, Product } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomerPickerModal from "./customer-picker-modal";

export default function Delivery() {
  const [modalCustomerVisible, setModalCustomerVisible] =
    useState<boolean>(false);
  const [modalProductVisible, setModalProductVisible] =
    useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    value: string;
    label: string;
  }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [customerDetail, setCustomerDetail] = useState<Customer | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchCustomerDetail() {
      if (!selectedCustomer) return;
      const customer = await readCustomerById(selectedCustomer?.value);
      setCustomerDetail(customer);
    }
    if (selectedCustomer?.value) {
      fetchCustomerDetail();
    }
  }, [selectedCustomer?.value]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!selectedCustomer) {
      Alert.alert("Silakan pilih customer terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    const result = await addDeliveryTask(selectedCustomer.value, products);
    setIsSubmitting(false);

    if (!result.success) {
      Alert.alert("Gagal", result.message || "Terjadi kesalahan");
      return;
    } else {
      Alert.alert("Sukses", "Tugas berhasil dibuat.");
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          {/* Customer Name */}
          <TextField
            label="Nama Customer"
            placeholder="Pilih Customer"
            value={selectedCustomer?.label || ""}
            rightIcon={(color) => (
              <Feather name="search" size={22} color={color} />
            )}
            onPressIcon={() => setModalCustomerVisible(true)}
          />

          {/* Phone Number */}
          <TextField
            label="Nomor Telepon"
            placeholder="08**********"
            value={customerDetail?.phone}
            editable={false}
          />

          {/* Address */}
          <TextField
            label="Alamat"
            placeholder="Alamat Customer"
            value={customerDetail?.address}
            multiline
            editable={false}
          />
        </View>
        {/* Product Section */}
        <ProductSection
          products={products} // Gunakan products, bukan initialProducts
          onProductsChange={setProducts} // Callback untuk update products
          containerStyle={{ flex: 1 }}
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
      {/* Customer Picker Modal */}
      <CustomerPickerModal
        visible={modalCustomerVisible}
        onClose={() => setModalCustomerVisible(false)}
        onSelectCustomer={setSelectedCustomer}
      />
      {/* Product Selection Modal */}
      <ProductSelectionModal
        visible={modalProductVisible}
        title="Item Produk"
        products={products}
        onClose={() => setModalProductVisible(false)}
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "600",
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
