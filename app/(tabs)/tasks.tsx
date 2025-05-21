import { navigateToCoordinate } from "@/lib/navigation";
import { readTodayRoute } from "@/lib/reportTaskService";
import { RouteTask } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { RelativePathString, Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function Index() {
  const [activeTab, setActiveTab] = useState("running");
  const [refreshing, setRefreshing] = useState(false);

  const [runningTasks, setRunningTasks] = useState<RouteTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<RouteTask[]>([]);
  const [routeId, setRouteId] = useState<string>("");
  const [activeDestination, setActiveDestination] = useState<string>("");

  const router = useRouter();
  // Animated value untuk slide effect
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchTodayRoute();
  }, []);

  const fetchTodayRoute = async () => {
    setRefreshing(true);
    const data = await readTodayRoute("c02182f4-9397-4763-85fd-9f70725bcf70");
    if (data) {
      setRouteId(data.id);
      setRunningTasks(data.running_task);
      setCompletedTasks(data.completed_task);
      setActiveDestination(data.running_task[0]?.task_info.customer.coordinate);
    }
    setRefreshing(false);
  };

  const changeTab = (tab: string) => {
    // Tentukan arah slide (kiri atau kanan) berdasarkan tab yang dipilih
    const toValue = tab === "running" ? 0 : 1;

    // Animasi slide
    Animated.timing(slideAnimation, {
      toValue: toValue,
      duration: 150,
      useNativeDriver: true,
    }).start();

    setActiveTab(tab);
  };

  // Menghitung transformasi untuk efek slide
  const translateX = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  function handlePress(type: string, taskId: string, customerId: string) {
    const typeMapping: Record<string, string> = {
      pengiriman: "/task-report",
      kanvassing: "/task-report",
      selesai: "/done-report",
    };

    router.push({
      pathname: typeMapping[type] as RelativePathString,
      params: { taskId, customerId, routeId },
    });
  }

  const navigateToActiveDestination = () => {
    navigateToCoordinate(activeDestination);
  };

  const renderItem = (item: RouteTask, isDisabled: boolean) => {
    const { type, customer } = item.task_info;
    const isDelivery = type === "pengiriman";
    const iconName = isDelivery ? "cube-outline" : "walk-outline";
    const iconColor = isDelivery ? "#007aff" : "#27ae60";

    return (
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => handlePress(type, item.task_id, customer.id)}
        disabled={isDisabled}
      >
        <View style={styles.taskHeader}>
          <Ionicons name={iconName} size={24} color={iconColor} />
          <Text style={styles.taskTypeText}>
            {isDelivery ? "Pengiriman" : "Kanvassing"}
          </Text>
        </View>
        <Text style={styles.taskTitle}>{customer.name}</Text>
        <Text style={styles.taskSubText}>
          {item.task_info.customer.address}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Stack.Screen
        options={{
          headerTitle: "Tugas",
          headerRight: () => (
            <TouchableOpacity
              style={styles.locationButton}
              onPress={navigateToActiveDestination}
            >
              <FontAwesome5 name="route" size={22} color="#34495e" />
            </TouchableOpacity>
          ),
        }}
      />
      {/* Header Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "running" && styles.activeTab]}
          onPress={() => changeTab("running")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "running" && styles.activeTabText,
            ]}
          >
            Berjalan ({runningTasks.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => changeTab("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Selesai ({completedTasks.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Container untuk konten tab */}
      <View style={styles.contentContainer}>
        <Animated.View
          style={[styles.tabContent, { transform: [{ translateX }] }]}
        >
          {/* Running Tasks */}
          <View style={{ width }}>
            <FlatList
              data={runningTasks}
              renderItem={({ item }) => renderItem(item, false)}
              keyExtractor={(item) => item.task_id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Tidak ada tugas berjalan</Text>
              }
              refreshing={refreshing}
              onRefresh={fetchTodayRoute}
            />
          </View>

          {/* Completed Tasks */}
          <View style={{ width }}>
            <FlatList
              data={completedTasks}
              renderItem={({ item }) => renderItem(item, true)}
              keyExtractor={(item) => item.task_id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Tidak ada tugas selesai</Text>
              }
              refreshing={refreshing}
              onRefresh={fetchTodayRoute}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#ffffff",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007aff",
  },
  tabText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  activeTabText: {
    color: "#007aff",
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    overflow: "hidden",
  },
  tabContent: {
    flexDirection: "row",
    width: width * 2, // Ruang untuk dua tab
  },
  content: {
    flex: 1,
    width,
  },
  listContainer: {
    padding: 15,
  },
  taskItem: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTypeText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    color: "#34495e",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
  },
  taskSubText: {
    fontSize: 13,
    color: "#95a5a6",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#7f8c8d",
  },
  locationButton: {
    padding: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  locationButtonText: {
    fontSize: 14,
    color: "#34495e",
    marginTop: 4,
  },
});
