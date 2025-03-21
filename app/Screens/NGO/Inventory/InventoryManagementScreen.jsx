import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-virtualized-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import Navbar from "@/components/Navbar";
import NgoFooter from "@/components/NgoFooter";
import ConnectWithUs from "@/components/ConnectWithUs";

const API_URL =
  "http://192.168.56.92/phpProjects/donationApp_restapi/api/Ngo/inventory.php";

// Primary color: Steel Blue #4682B4
// Creating a color palette based on this primary color
const COLORS = {
  primary: "#4682B4",
  primaryLight: "#B3CFDE", // Lighter shade for badges, backgrounds
  primaryDark: "#2E5A88", // Darker shade for text, emphasis
  background: "#F5F9FC", // Very light blue-tinted background
  surface: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#5F6B7A",
  border: "#E1EBF2",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#E57373",
  disabled: "#CFD8DC",
};

const InventoryManagementScreen = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("accepted"); // Default to "accepted"

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const ngoId = await AsyncStorage.getItem("ngo_id");
  
        if (!ngoId) {
          setError("NGO ID not found");
          setLoading(false);
          return;
        }
  
        const response = await axios.get(`${API_URL}?ngo_id=${ngoId}`);
  
        if (response.data.status === "success") {
          // Sort the inventory by status and then by created_at
          const sortedInventory = response.data.data.sort((a, b) => {
            // Priority: accepted > completed > others
            if (a.status.toLowerCase() === "accepted" && b.status.toLowerCase() !== "accepted") {
              return -1; // a comes first
            } else if (b.status.toLowerCase() === "accepted" && a.status.toLowerCase() !== "accepted") {
              return 1; // b comes first
            } else if (a.status.toLowerCase() === "completed" && b.status.toLowerCase() !== "completed") {
              return -1; // a comes first
            } else if (b.status.toLowerCase() === "completed" && a.status.toLowerCase() !== "completed") {
              return 1; // b comes first
            } else {
              // If statuses are the same, sort by created_at in descending order
              return new Date(b.created_at) - new Date(a.created_at);
            }
          });
          setInventory(sortedInventory);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch inventory");
      } finally {
        setLoading(false);
      }
    };
  
    fetchInventory();
  }, []);

  const handleStatus = async (inventoryId, userId, itemId) => {
    try {
      // First update the inventory status
      const inventoryResponse = await axios.post(API_URL, {
        inventory_id: inventoryId,
      });
  
      if (inventoryResponse.data.status === "success") {
        // Now update the donated_items table using the item_id
        const donatedItemsUrl = "http://192.168.56.92/phpProjects/donationApp_restapi/api/Ngo/updateDonation.php";
        
        const donationResponse = await axios.post(donatedItemsUrl, {
          item_id: itemId,
          status: "Completed"
        });
  
        if (donationResponse.data.status === "success") {
          // Update the inventory state to reflect the change
          setInventory((prevInventory) =>
            prevInventory.map((item) =>
              item.inventory_id === inventoryId
                ? { ...item, status: "Completed" }
                : item
            )
          );
        } else {
          alert(donationResponse.data.message);
        }
      } else {
        alert(inventoryResponse.data.message);
      }
    } catch (error) {
      alert("Failed to update status");
      console.error(error);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    if (filter === "accepted") return item.status === "Accepted";
    if (filter === "completed") return item.status === "Completed";
    return true; // Show all items if no filter is applied
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return COLORS.success;
      case "completed":
        return COLORS.primary;
      default:
        return COLORS.warning;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "checkmark-circle";
      case "completed":
        return "trophy";
      default:
        return "time";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Navbar />
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Inventory Management</Text>
        <Text style={styles.subheading}>Track and manage your inventory</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "accepted" && styles.activeFilterTab]}
          onPress={() => setFilter("accepted")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "accepted" && styles.activeFilterText,
            ]}
          >
            Accepted
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "completed" && styles.activeFilterTab,
          ]}
          onPress={() => setFilter("completed")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "completed" && styles.activeFilterText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loader}
          />
          <Text style={styles.loaderText}>Loading inventory...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={40} color={COLORS.error} />
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item, index) => (
              <View
                key={item.inventory_id || `inventory-${index}`}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.item_name}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status) + "20" },
                      ]}
                    >
                      <Ionicons
                        name={getStatusIcon(item.status)}
                        size={14}
                        color={getStatusColor(item.status)}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(item.status) },
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardContent}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Username:</Text>
                    <Text style={styles.infoValue}>
                      {item.username}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Resident:</Text>
                    <Text style={styles.infoValue}>
                      {item.city}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Contact:</Text>
                    <Text style={styles.infoValue}>
                      {item.phonenumber}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>
                      {item.email}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Added on:</Text>
                    <Text style={styles.infoValue}>
                      {item.created_at || "Unknown"}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    onPress={() => handleStatus(item.inventory_id, item.user_id, item.item_id)}
                    style={[
                      styles.primaryButton,
                      item.status === "Completed" && styles.disabledButton,
                    ]}
                    disabled={item.status === "Completed"}
                  >
                    <Text
                      style={[
                        styles.primaryButtonText,
                        item.status === "Completed" &&
                          styles.disabledButtonText,
                      ]}
                    >
                      {item.status === "Completed"
                        ? "Completed"
                        : "Mark Complete"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons
                name="file-tray-outline"
                size={64}
                color={COLORS.primaryLight}
              />
              <Text style={styles.emptyStateTitle}>No items found</Text>
              <Text style={styles.emptyStateDescription}>
                There are no items in this category.
              </Text>
            </View>
          )}
        </View>
      )}

      <ConnectWithUs />
      <NgoFooter />
    </ScrollView>
  );
};

export default InventoryManagementScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.border,
  },
  activeFilterTab: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  activeFilterText: {
    color: COLORS.surface,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
    overflow: "hidden",
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 6,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
    textTransform: "capitalize",
  },
  quantityBadge: {
    backgroundColor: COLORS.primaryLight,
    height: 36,
    width: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.background,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtonText: {
    marginLeft: 4,
    color: COLORS.primary,
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
  },
  disabledButtonText: {
    color: COLORS.textSecondary,
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontWeight: "600",
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
  },
  disabledButtonText: {
    color: COLORS.textSecondary,
  },
  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loaderText: {
    marginTop: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  error: {
    color: COLORS.error,
    textAlign: "center",
    marginVertical: 8,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  retryButtonText: {
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});