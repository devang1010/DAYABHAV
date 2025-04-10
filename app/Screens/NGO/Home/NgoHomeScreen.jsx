import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-virtualized-view";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import Navbar from "@/components/Navbar";
import WelcomeSectionNgo from "@/components/WelcomeSectionNgo";
import ConnectWithUs from "@/components/ConnectWithUs";
import RecentItemDonation from "@/components/RecentItemDonation";
import UrgentNeedsCard from "@/components/UrgentNeedsCard";
import NgoFooter from "@/components/NgoFooter";

const API_BASE_URL = "http://192.168.46.163/phpProjects/donationApp_restapi/api";

const NgoHomeScreen = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [urgentNeeds, setUrgentNeeds] = useState([]);
  const [recentDonations, setRecentDonations] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState(0);
  const [completedDonations, setCompletedDonations] = useState(0);
  const [ngoId, setNgoId] = useState(null);
  
  // Function to fetch all data
  const fetchAllData = useCallback(async () => {
    try {
      // Get NGO ID from AsyncStorage
      const storedNgoId = await AsyncStorage.getItem("ngo_id");
      setNgoId(storedNgoId);
      
      if (!storedNgoId) {
        console.log("NGO ID not found in AsyncStorage");
        return;
      }

      // Fetch pending donations count
      try {
        const pendingResponse = await axios.get(
          `${API_BASE_URL}/Ngo/homescreenstatspendingreq.php`
        );
        if (pendingResponse.data.status === "success") {
          setPendingCount(pendingResponse.data.count);
        }
      } catch (e) {
        console.error("API Error (pending count):", e.message);
      }

      // Fetch urgent needs
      try {
        const needsResponse = await axios.get(
          `${API_BASE_URL}/Ngo/ngorequirements.php?ngo_id=${storedNgoId}`
        );
        if (needsResponse.data.status === "success") {
          setUrgentNeeds(needsResponse.data.data);
        }
      } catch (e) {
        console.error("API Error (urgent needs):", e.message);
      }

      // Fetch recent donations
      try {
        const donationsResponse = await axios.get(
          `${API_BASE_URL}/Ngo/inventory.php?ngo_id=${storedNgoId}`
        );
        if (donationsResponse.data.status === "success") {
          const sortedRecentDonations = donationsResponse.data.data.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          });
          setRecentDonations(sortedRecentDonations);
        }
      } catch (e) {
        console.error("API Error (recent donations):", e.message);
      }

      // Fetch accepted and completed donations count
      try {
        const statusResponse = await axios.post(
          `${API_BASE_URL}/Ngo/homescreenstatsaccepte_complete.php`,
          { ngo_id: storedNgoId }
        );
        if (statusResponse.data.status === "success") {
          setAcceptedDonations(statusResponse.data.accepted_count);
          setCompletedDonations(statusResponse.data.completed_count);
        }
      } catch (e) {
        console.error("API Error (accepted/completed count):", e.message);
      }
    } catch (error) {
      console.error("Error in fetchAllData:", error);
    }
  }, []);

  // Use useFocusEffect to reload data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAllData();
      
      return () => {
        // Cleanup function if needed
      };
    }, [fetchAllData])
  );

  const handleRemoveRequirement = (requirementId) => {
    setUrgentNeeds((prevNeeds) =>
      prevNeeds.filter((item) => item.requirement_id !== requirementId)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <WelcomeSectionNgo
          username={"helpingNGO"}
          welcomeMessage={"Thanks for making the change in the world!"}
        />
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: "#FFF0E0" }]}>
            <MaterialIcons name="pending-actions" size={24} color="#FFA500" />
            <Text style={styles.statValue}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#E6F2FF" }]}>
            <MaterialIcons name="check-circle" size={24} color="#4682B4" />
            <Text style={styles.statValue}>{acceptedDonations}</Text>
            <Text style={styles.statLabel}>Accept</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#E0F5E9" }]}>
            <MaterialIcons name="done-all" size={24} color="#2E8B57" />
            <Text style={styles.statValue}>{completedDonations}</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              router.push("/Screens/NGO/Donations/AllDonationsScreen");
            }}
          >
            <FontAwesome5 name="hand-holding-heart" size={20} color="#FFF" />
            <Text style={styles.actionText}>View Donations</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              router.push(
                "/Screens/NGO/NeedsManagement/UrgentNeedsManagementForm"
              );
            }}
          >
            <FontAwesome5 name="list-alt" size={20} color="#FFF" />
            <Text style={styles.actionText}>Update Needs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inventoryContainer}>
          <TouchableOpacity
            style={styles.inventoryButton}
            onPress={() => {
              router.push("/Screens/NGO/Inventory/InventoryManagementScreen");
            }}
          >
            <FontAwesome5 name="boxes" size={24} color="#fff" />
            <Text style={styles.actionText}>My Inventory</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Donations */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Donations</Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/Screens/NGO/Inventory/InventoryManagementScreen");
              }}
            >
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentDonations.length > 0 ? (
            <FlatList
              data={recentDonations.slice(0, 3)}
              renderItem={({ item }) => <RecentItemDonation item={item} />}
              keyExtractor={(item) => item.inventory_id}
              horizontal={false}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <FontAwesome5 name="box-open" size={48} color="#DDE5ED" />
              <Text style={styles.emptyStateTitle}>No recent donations</Text>
              <Text style={styles.emptyStateDescription}>
                New donations will appear here once they are accepted.
              </Text>
            </View>
          )}
        </View>

        {/* Urgent Needs */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Urgent Needs</Text>
            <TouchableOpacity
              onPress={() => {
                router.push(
                  "/Screens/NGO/NeedsManagement/UrgentNeedsManagementForm"
                );
              }}
            >
              <Text style={styles.seeAllText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.needsContainer}>  
            <FlatList
              data={urgentNeeds}
              renderItem={({ item }) => (
                <UrgentNeedsCard
                  item={item}
                  onRemove={handleRemoveRequirement}
                />
              )}
              keyExtractor={(item) => item.requirement_id.toString()}
              horizontal={false}
              scrollEnabled={false}
            />
          </View>
        </View>

        {/* <NgoFooter /> */}
      </ScrollView>
      <ConnectWithUs />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
  },
  ngoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  notificationButton: {
    position: "relative",
    padding: 4,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF4757",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationCount: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
  },
  statCard: {
    flexBasis: "30%",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 6,
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4682B4",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
  },
  actionText: {
    color: "#FFF",
    marginLeft: 8,
    fontWeight: "600",
  },
  sectionContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F9FAFC",
    borderRadius: 8,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4682B4",
    marginTop: 12,
    marginBottom: 6,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#4682B4",
  },
  donationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  inventoryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  inventoryButton: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4682B4",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 0.48,
  },
  donationDetails: {
    flex: 1,
  },
  donationItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  donationDonor: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  donationDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  donationStatus: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  donationStatusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  needsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    marginBottom: 60
  },
  needItem: {
    backgroundColor: "#F5F7FA",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 10,
    marginBottom: 10,
    minWidth: "45%",
  },
  needItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  needItemQuantity: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});

export default NgoHomeScreen;