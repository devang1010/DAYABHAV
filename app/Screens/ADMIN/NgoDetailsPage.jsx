import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';


const { width } = Dimensions.get("window");

const API_URL = "http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/inventory.php";
const API_BASE_URL = "http://192.168.46.163/phpProjects/donationApp_restapi/api";
const IMAGE_BASE_URL = `${API_BASE_URL}/User/getimage.php?filename=`;

// Color palette from InventoryManagementScreen
const COLORS = {
  primary: "#4682B4",
  primaryLight: "#B3CFDE",
  primaryDark: "#2E5A88",
  background: "#F5F9FC",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  textSecondary: "#5F6B7A",
  border: "#E1EBF2",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#E57373",
  disabled: "#CFD8DC",
};

const NgoDetailsPage = () => {
  const router = useRouter();
  const { ngo_id } = useLocalSearchParams();
  const [ngoData, setNgoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState(0);
  const [completedDonations, setCompletedDonations] = useState(0);

  const logoutHandler = () => {
    router.replace("/Screens/Auth/LoginScreen");
  };

  // Helper function to get status color
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

  // Helper function to get status icon
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

  // Add this function inside the existing useEffect
  const fetchNgoData = async (ngoId) => {
    try {
      const response = await axios.get(
        `http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/getngos.php?ngo_id=${ngoId}`
      );
      if (response.data.status === "success") {
        setNgoData(response.data.ngo);
      } else {
        console.error("Error fetching NGO data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching NGO data:", error);
    }
  };

  const handleDelete = async () => {
    Alert.alert("Delete Profile", "Are you sure you want to delete your profile?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          try {
            const response = await axios.delete(
              "http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/deletengo.php",
              { data: { ngo_id: ngo_id } }
            );
  
            if (response.data.status === "success") {
              Alert.alert("Deleted", "Your profile has been deleted.");
              await AsyncStorage.removeItem("ngo_id");
              router.replace("/Screens/Auth/LoginScreen");
            } else {
              Alert.alert("Error", response.data.message);
            }
          } catch (error) {
            console.error("Error deleting NGO profile:", error);
            Alert.alert("Error", "Failed to delete profile.");
          }
        }
      }
    ]);
  };

  // Fetch donation statistics
  useEffect(() => {
    const fetchNumberOfStatusRows = async (ngo_id) => {
      try {
        const response = await axios.post(
          `http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/homescreenstatsaccepte_complete.php?ngo_id=${ngo_id}`
        );

        if (response.data.status === "success") {
          setAcceptedDonations(response.data.accepted_count);
          setCompletedDonations(response.data.completed_count);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    // Fetch inventory
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${API_URL}?ngo_id=${ngo_id}`);

        if (response.data.status === "success") {
          // Sort the inventory by status and then by created_at
          const sortedInventory = response.data.data.sort((a, b) => {
            // Priority: accepted > completed > others
            if (
              a.status.toLowerCase() === "accepted" &&
              b.status.toLowerCase() !== "accepted"
            ) {
              return -1;
            } else if (
              b.status.toLowerCase() === "accepted" &&
              a.status.toLowerCase() !== "accepted"
            ) {
              return 1;
            } else if (
              a.status.toLowerCase() === "completed" &&
              b.status.toLowerCase() !== "completed"
            ) {
              return -1;
            } else if (
              b.status.toLowerCase() === "completed" &&
              a.status.toLowerCase() !== "completed"
            ) {
              return 1;
            } else {
              // If statuses are the same, sort by created_at in descending order
              return new Date(b.created_at) - new Date(a.created_at);
            }
          });
          setInventory(sortedInventory);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (err) {
        Alert.alert("Error", "Failed to fetch inventory");
      } finally {
        setLoading(false);
      }
    };

    if (ngo_id) {
      fetchNgoData(ngo_id);
      fetchNumberOfStatusRows(ngo_id);
      fetchInventory();
    }
  }, [ngo_id]);

  // Donation Item Component
  const DonationItem = ({ item }) => {
    return (
      <View style={styles.card}>
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
            <Text style={styles.quantityText}>{item.quantity || "1"}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Username:</Text>
            <Text style={styles.infoValue}>{item.username}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Resident:</Text>
            <Text style={styles.infoValue}>
              {item.city}, {item.country}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact:</Text>
            <Text style={styles.infoValue}>{item.phonenumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{item.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Added on:</Text>
            <Text style={styles.infoValue}>{item.created_at || "Unknown"}</Text>
          </View>
        </View>
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading NGO data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>NGO Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logoutHandler}>
          <MaterialIcons name="logout" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {ngoData && (
          <View style={styles.userProfileCard}>
            <View style={styles.userProfileHeader}>
              <View style={styles.userInitials}>
                <Text style={styles.userInitialsText}>
                  {ngoData.ngoname[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.userMainInfo}>
                <Text style={styles.userName}>{ngoData.ngoname}</Text>
                <Text style={styles.userEmail}>{ngoData.email}</Text>
              </View>
            </View>

            <View style={styles.userDetailsContainer}>
              <View style={styles.userInfoRow}>
                <MaterialIcons name="phone" size={18} color="#3498db" />
                <Text style={styles.userInfoText}>{ngoData.phonenumber}</Text>
              </View>

              <View style={styles.userInfoRow}>
                <MaterialIcons name="location-on" size={18} color="#e74c3c" />
                <Text style={styles.userInfoText}>{ngoData.address}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Donation Stats */}
        <View style={styles.donationStatsCard}>
          <Text style={styles.donationStatsTitle}>
            Total Received Donations
          </Text>
          <Text style={styles.donationStatsValue}>
            {acceptedDonations} Items
          </Text>
        </View>

        <View style={styles.donationStatsCard}>
          <Text style={styles.donationStatsTitle}>
            Total Completed Donations
          </Text>
          <Text style={styles.donationStatsValue}>
            {completedDonations} Items
          </Text>
        </View>

        {/* Donation List */}
        <View style={styles.donationListContainer}>
          <Text style={styles.sectionTitle}>Donation History</Text>
          {inventory.length > 0 ? (
            <FlatList
              data={inventory}
              renderItem={({ item }) => <DonationItem item={item} />}
              keyExtractor={(item) => item.item_id?.toString()}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noDataText}>No donations received yet</Text>
          )}
        </View>

        {/* Delete Account Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <LinearGradient
                  colors={['#FF6347', '#FF4500']}
                  style={styles.gradientButton}
                >
                  <Ionicons name="trash-outline" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Delete Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NgoDetailsPage;

// Reuse styles from UserDetailsPage
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  logoutButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e74c3c",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  userProfileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  userInitials: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInitialsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  userMainInfo: {
    flex: 1,
  },
  userDetailsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userInfoText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#2c3e50",
  },
  userProfileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  donationStatsCard: {
    backgroundColor: "#3498db",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  donationStatsTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  donationStatsValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  donationListContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  loadingText: {
    textAlign: "center",
    color: "#7f8c8d",
    fontSize: 16,
  },
  noDataText: {
    textAlign: "center",
    color: "#7f8c8d",
    fontSize: 16,
    marginTop: 20,
  },
  cardContainer: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#eee",
  },
  acceptedCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#4682B4",
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  contentContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    backgroundColor: "#f9f9f9",
    resizeMode: "contain",
  },
  details: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
  },
  ngoDetailsContainer: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  ngoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ngoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4682B4",
    marginLeft: 8,
  },
  ngoDetailRow: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  ngoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    width: 100,
  },
  ngoValue: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    fontWeight: "500",
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
  deleteButton: {
    marginTop: 20,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#4682B4',
    textAlign: 'center',
    marginTop: 20,
  },
});
