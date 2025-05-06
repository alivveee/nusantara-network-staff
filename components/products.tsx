import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Product } from "@/types";

interface ProductSectionProps {
  title?: string;
  initialProducts?: Product[];
  products?: Product[];
  onProductsChange?: (products: Product[]) => void;
  onUpdateQuantity?: (id: string, increment: number) => void;
  onDeleteProduct?: (id: string) => void;
  containerStyle?: ViewStyle;
  showDividers?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title = "Produk",
  initialProducts = [],
  products: externalProducts,
  onProductsChange,
  onUpdateQuantity: externalUpdateQuantity,
  onDeleteProduct: externalDeleteProduct,
  containerStyle,
  showDividers = true,
}) => {
  // Internal state untuk products jika tidak ada external state
  const [internalProducts, setInternalProducts] =
    useState<Product[]>(initialProducts);

  // State untuk menyimpan nilai input teks sementara
  const [editingValues, setEditingValues] = useState<Record<string, string>>(
    {}
  );

  // Gunakan external products jika disediakan, jika tidak gunakan internal state
  const products = externalProducts || internalProducts;

  // Update internal state jika initialProducts berubah dan tidak ada external products
  useEffect(() => {
    if (!externalProducts) {
      // Hanya update jika jumlah produk berbeda atau ada produk baru
      // Ini mencegah reset quantity saat menambah produk baru
      if (initialProducts.length !== internalProducts.length) {
        // Gabungkan produk yang ada dengan produk baru
        const updatedProducts = [...internalProducts];

        // Tambahkan produk baru yang belum ada di internalProducts
        initialProducts.forEach((newProduct) => {
          const existingProductIndex = updatedProducts.findIndex(
            (p) => p.id === newProduct.id
          );
          if (existingProductIndex === -1) {
            // Produk baru, tambahkan ke array
            updatedProducts.push(newProduct);
          }
        });

        setInternalProducts(updatedProducts);
      }
    }
  }, [initialProducts, externalProducts]);

  // Internal handler untuk update quantity
  const handleUpdateQuantity = (id: string, increment: number) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const newQuantity = Math.max(0, (product.quantity ?? 0) + increment);
        return { ...product, quantity: newQuantity };
      }
      return product;
    });

    if (externalProducts && onProductsChange) {
      // Jika menggunakan external state, panggil callback
      onProductsChange(updatedProducts);
    } else {
      // Jika menggunakan internal state, update state
      setInternalProducts(updatedProducts);
    }

    // Panggil external handler jika ada
    if (externalUpdateQuantity) {
      externalUpdateQuantity(id, increment);
    }
  };

  // Handler untuk mengubah quantity langsung dengan nilai tertentu
  const handleSetQuantity = (id: string, quantityText: string) => {
    // Simpan nilai input sementara
    setEditingValues({
      ...editingValues,
      [id]: quantityText,
    });
  };

  // Handler untuk menerapkan perubahan quantity saat selesai edit
  const handleQuantityInputBlur = (id: string) => {
    const quantityText = editingValues[id];
    if (quantityText === undefined) return;

    // Parse nilai input menjadi angka
    const quantity = parseInt(quantityText, 10);

    // Jika bukan angka yang valid, kembalikan ke nilai sebelumnya
    if (isNaN(quantity)) {
      const currentProduct = products.find((p) => p.id === id);
      if (currentProduct) {
        setEditingValues({
          ...editingValues,
          [id]: (currentProduct.quantity ?? 0).toString(),
        });
      }
      return;
    }

    // Update products dengan quantity baru
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        return { ...product, quantity: Math.max(0, quantity) };
      }
      return product;
    });

    if (externalProducts && onProductsChange) {
      onProductsChange(updatedProducts);
    } else {
      setInternalProducts(updatedProducts);
    }

    // Bersihkan nilai editing untuk id ini
    const newEditingValues = { ...editingValues };
    delete newEditingValues[id];
    setEditingValues(newEditingValues);
  };

  // Internal handler untuk delete product
  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id);

    if (externalProducts && onProductsChange) {
      // Jika menggunakan external state, panggil callback
      onProductsChange(updatedProducts);
    } else {
      // Jika menggunakan internal state, update state
      setInternalProducts(updatedProducts);
    }

    // Panggil external handler jika ada
    if (externalDeleteProduct) {
      externalDeleteProduct(id);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <ScrollView style={{ paddingHorizontal: 8 }} >
        {products.map((product, index) => (
          <View key={product.id}>
            <View style={styles.productItem}>
              <View style={styles.productLeft}>
                <TouchableOpacity
                  onPress={() => handleDeleteProduct(product.id)}
                  style={styles.deleteButton}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color="#6E6E6E"
                  />
                </TouchableOpacity>
                <Text style={styles.productName}>{product.name}</Text>
              </View>

              <View style={styles.quantityControls}>
                <TouchableOpacity
                  onPress={() => handleUpdateQuantity(product.id, -1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.quantityInput}
                  value={
                    editingValues[product.id] !== undefined
                      ? editingValues[product.id]
                      : (product.quantity ?? 0).toString()
                  }
                  onChangeText={(text) => handleSetQuantity(product.id, text)}
                  onBlur={() => handleQuantityInputBlur(product.id)}
                  keyboardType="numeric"
                  selectTextOnFocus
                />

                <TouchableOpacity
                  onPress={() => handleUpdateQuantity(product.id, 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDividers && index < products.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        ))}

        {products.length === 0 && (
          <Text style={styles.emptyText}>Belum ada produk</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    marginLeft: 4,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  productLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  productName: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4285F4",
  },
  quantityInput: {
    fontSize: 16,
    marginHorizontal: 8,
    minWidth: 40,
    textAlign: "center",
    padding: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#6E6E6E",
    marginTop: 16,
    marginBottom: 16,
  },
});

export default ProductSection;
