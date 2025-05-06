import TextField from "@/components/text-field";
import { Product } from "@/types";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import ProductSection from "../../components/products";
import { Ionicons } from "@expo/vector-icons";
import ProductSelectionModal from "../../components/products-modal";

export default function Index() {
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Router A", quantity: 100 },
    { id: "2", name: "Router B", quantity: 150 },
    { id: "3", name: "Router C", quantity: 1 },
  ]);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const availableProducts: Product[] = [
    { id: "1", name: "Router A" },
    { id: "2", name: "Router B" },
    { id: "3", name: "Router C" },
    { id: "4", name: "Splicer" },
    { id: "5", name: "LAN Cable" },
  ];

  const handleSelectProduct = (product: Product): void => {
    const existingProduct = products.find((p) => p.id === product.id);

    if (existingProduct) {
      // Jika produk sudah ada, tambahkan quantity-nya
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity! + 1 } : p
        )
      );
    } else {
      // Jika produk belum ada, tambahkan dengan quantity 1
      setProducts([...products, { ...product, quantity: 1 }]);
    }

    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Product Section - Gunakan komponen dengan controlled state */}
        <ProductSection
          title="Sisa Produk"
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
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Selesai</Text>
        </TouchableOpacity>
      </View>

      {/* Product Selection Modal */}
      <ProductSelectionModal
        visible={modalVisible}
        title="Item Produk"
        products={availableProducts}
        onClose={() => setModalVisible(false)}
        onSelectProduct={handleSelectProduct}
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
