import PickerField from "@/components/picker-field";
import TextField from "@/components/text-field";
import { readCustomerById } from "@/lib/customerService";
import getCurrentLocation from "@/lib/location";
import { addFailedReport } from "@/lib/reportTaskService";
import { Customer } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const statusOptions = [
  { label: "Berhasil", value: "berhasil" },
  { label: "Gagal", value: "gagal" },
];

export default function Index() {
  const [customerDetail, setCustomerDetail] = useState<Customer | undefined>();
  const [status, setStatus] = useState("berhasil");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const router = useRouter();
  const { taskId, customerId, routeId } = useLocalSearchParams<{
    taskId: string;
    customerId: string;
    routeId: string;
  }>();

  // Fetch customer detail from the server
  useEffect(() => {
    async function fetchCustomerDetail() {
      const customer = await readCustomerById(customerId);
      setCustomerDetail(customer);
    }
    if (customerId) {
      fetchCustomerDetail();
    }
  }, [customerId]);

  const handleFailedSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      setLoadingText?.("Mengambil lokasi...");

      const coords = await getCurrentLocation();
      if (!coords) {
        Alert.alert(
          "Gagal",
          "Tidak bisa mendapatkan lokasi. Pastikan GPS aktif."
        );
        return;
      }

      setLoadingText?.("Mengirim laporan...");

      const result = await addFailedReport(
        taskId,
        routeId,
        note,
        status,
        coords
      );

      if (!result.success) {
        Alert.alert(
          "Gagal",
          result.message || "Terjadi kesalahan saat mengirim laporan."
        );
      } else {
        Alert.alert("Berhasil", "Laporan berhasil ditambahkan!");
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      Alert.alert("Kesalahan", "Terjadi kesalahan tak terduga.");
    } finally {
      setLoadingText?.("");
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          {/* Recipient Name */}
          <Text style={styles.customerName}>{customerDetail?.name}</Text>

          {/* Phone Number */}
          <TextField
            label="Nomor Telepon"
            placeholder=""
            value={customerDetail?.phone}
            editable={false}
          />

          {/* Address */}
          <TextField
            label="Alamat"
            value={customerDetail?.address}
            multiline
            editable={false}
          />

          {/* Status */}
          <PickerField
            label="Status"
            selectedValue={status}
            onValueChange={setStatus}
            options={statusOptions}
          />

          {/* Notes */}
          <TextField
            label="Keterangan"
            placeholder="Masukkan keterangan"
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          disabled={isSubmitting}
          onPress={() => {
            if (status === "gagal") {
              handleFailedSubmit();
              return;
            } else {
              router.push({
                pathname: "/task-report/submit",
                params: { taskId, customerId, status, note, routeId },
              });
            }
          }}
        >
          <Text style={styles.continueButtonText}>
            {status === "gagal" ? "Selesai" : "Lanjut"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Loading Indicator */}
      {loadingText !== "" && (
        <Modal transparent={true} visible>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#00000055",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <ActivityIndicator size="large" />
              <Text style={{ marginTop: 10 }}>{loadingText}</Text>
            </View>
          </View>
        </Modal>
      )}
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
});
