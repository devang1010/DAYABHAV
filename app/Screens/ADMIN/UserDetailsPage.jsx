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

const { width } = Dimensions.get("window");

const API_BASE_URL = "http://192.168.46.163/phpProjects/donationApp_restapi/api";
const IMAGE_BASE_URL = `${API_BASE_URL}/User/getimage.php?filename=`;

const UserDetailsPage = () => {
  const router = useRouter();
  const { user_id } = useLocalSearchParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numberOfDonations, setNumberOfDonations] = useState(null);
  const [donations, setDonations] = useState([]);

  const logoutHandler = () => {
    router.replace("/Screens/Auth/LoginScreen");
  };

  // Helper function to get status styles
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { backgroundColor: '#FFA500' };
      case 'accepted':
        return { backgroundColor: '#4682B4' };
      case 'completed':
        return { backgroundColor: '#2ECC71' };
      default:
        return { backgroundColor: '#95A5A6' };
    }
  };

  const getTextStyle = (status) => {
    return { color: '#FFFFFF' };
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Fetch number of donations
  useEffect(() => {
    const fetchNumberOfDonations = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/User/getuserdonationstats.php?user_id=${user_id}`
        );
  
        if (response.data.status === "success") {
          setNumberOfDonations(response.data.count);
        } else {
          console.log("Error fetching donation stats: " + response.data.message);
        }
      } catch (e) {
        console.log("API error fetching donation stats: " + e.message);
      }
    };

    fetchNumberOfDonations();
  }, [user_id]);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/User/getUser.php?user_id=${user_id}`
      );

      if (response.data.status === "success") {
        setUserData(response.data.user);
      } else {
        console.error("Error getting user: ", response.data.message);
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("API error: ", error);
      Alert.alert("Error", "Unable to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch donations
  const fetchDonations = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/User/itemdonation.php?user_id=${user_id}`
      );
      if (response.data.status === 'success') {
        const sortedDonations = response.data.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setDonations(sortedDonations);
      } else {
        console.error('Error fetching donations:', response.data.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user_id) {
      fetchUserData();
      fetchDonations();
    }
  }, [user_id]);

  // Handle user deletion
  const handleDeleteUser = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(
                `${API_BASE_URL}/User/deleteUser.php?user_id=${user_id}`
              );

              if (response.data.status === "success") {
                router.replace("/Screens/Auth/LoginScreen");
                Alert.alert("Success", "Account deleted successfully!");
              } else {
                Alert.alert("Error", response.data.message);
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Donation Item Component
  const DonationItem = ({ item }) => {
    const normalizedStatus = item.status ? item.status.toLowerCase() : "";

    return (
      <View style={styles.cardContainer}>
        <View style={[
          styles.card,
          (normalizedStatus === "accepted" || normalizedStatus === "completed") && styles.acceptedCard
        ]}>
          {/* Status Badge */}
          {(normalizedStatus === "accepted" || normalizedStatus === "completed") && (
            <View style={[
              styles.statusBadge, 
              getStatusStyle(normalizedStatus)
            ]}>
              <Text style={[styles.statusBadgeText, getTextStyle(normalizedStatus)]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
              </Text>
            </View>
          )}

          <View style={styles.contentContainer}>
            <Image 
              source={{ uri: `${IMAGE_BASE_URL}${item.item_image}` }} 
              style={styles.image} 
              resizeMode="contain"
            />
            
            <View style={styles.details}>
              <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
                {item.item_name}
              </Text>
              
              <Text style={styles.date}>Donated on: {formatDate(item.created_at)}</Text>
            </View>
          </View>

          {/* NGO Details */}
          {(normalizedStatus === "accepted" || normalizedStatus === "completed") && (
            <View style={styles.ngoDetailsContainer}>
              <View style={styles.ngoHeader}>
                <Ionicons name="business-outline" size={20} color="#4682B4" />
                <Text style={styles.ngoTitle}>NGO Information</Text>
              </View>
              
              <View style={styles.ngoDetailRow}>
                <Text style={styles.ngoLabel}>Organization:</Text>
                <Text style={styles.ngoValue} numberOfLines={1} ellipsizeMode="tail">
                  {item.ngoname}
                </Text>
              </View>

              <View style={styles.ngoDetailRow}>
                <Text style={styles.ngoLabel}>Address:</Text>
                <Text style={styles.ngoValue} numberOfLines={2} ellipsizeMode="tail">
                  {item.address}
                </Text>
              </View>

              <View style={styles.ngoDetailRow}>
                <Text style={styles.ngoLabel}>Phone:</Text>
                <Text style={styles.ngoValue} numberOfLines={1} ellipsizeMode="tail">
                  {item.phonenumber}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading user data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>User Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logoutHandler}>
          <MaterialIcons name="logout" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* Rest of the component remains the same */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {userData && (
          <View style={styles.userProfileCard}>
            <View style={styles.userProfileHeader}>
              <View style={styles.userInitials}>
                <Text style={styles.userInitialsText}>
                  {userData.username[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.userMainInfo}>
                <Text style={styles.userName}>{userData.username}</Text>
                <Text style={styles.userEmail}>{userData.email}</Text>
              </View>
            </View>

            <View style={styles.userDetailsContainer}>
              <View style={styles.userInfoRow}>
                <MaterialIcons name="phone" size={18} color="#3498db" />
                <Text style={styles.userInfoText}>{userData.phonenumber}</Text>
              </View>

              <View style={styles.userInfoRow}>
                <MaterialIcons name="location-on" size={18} color="#e74c3c" />
                <Text style={styles.userInfoText}>
                  {userData.city}, {userData.country}
                </Text>
              </View>

              <View style={styles.userInfoRow}>
                <MaterialIcons
                  name="calendar-today"
                  size={18}
                  color="#27ae60"
                />
                <Text style={styles.userInfoText}>
                  Joined: {new Date(userData.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Donation Stats */}
        <View style={styles.donationStatsCard}>
          <Text style={styles.donationStatsTitle}>Total Donations</Text>
          <Text style={styles.donationStatsValue}>{numberOfDonations} Items</Text>
        </View>

        {/* Donation List */}
        <View style={styles.donationListContainer}>
          <Text style={styles.sectionTitle}>Donation History</Text>
          {donations.length > 0 ? (
            <FlatList
              data={donations}
              renderItem={({ item }) => <DonationItem item={item} />}
              keyExtractor={(item) => item.item_id?.toString()}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noDataText}>No donations yet</Text>
          )}
        </View>

        {/* Delete Account Button */}
        <TouchableOpacity
          style={styles.deleteAccountButton}
          onPress={handleDeleteUser}
        >
          <MaterialIcons name="delete-forever" size={24} color="#fff" />
          <Text style={styles.deleteAccountButtonText}>Delete User</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDetailsPage;

// Styles remain exactly the same as in the previous implementation
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
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 5,
  },
  userInfoText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#2c3e50",
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
  donationItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  donationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  donationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  donationDate: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  donationDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  donationQuantity: {
    fontSize: 16,
    color: "#2ecc71",
  },
  donationLocation: {
    fontSize: 16,
    color: "#3498db",
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
  deleteAccountButton: {
    flexDirection: "row",
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  deleteAccountButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cardContainer: {
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#eee',
  },
  acceptedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4682B4',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    padding: 5,
    zIndex: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: '#f9f9f9',
    resizeMode: "contain"
  },
  details: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  ngoDetailsContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  ngoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ngoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4682B4',
    marginLeft: 8,
  },
  ngoDetailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  ngoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    width: 100,
  },
  ngoValue: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    fontWeight: '500',
  },
  deliveryInstructions: {
    flexDirection: 'row',
    backgroundColor: '#E0F0FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 0,
    // alignItems: 'flex-start',
  },
  deliveryText: {
    fontSize: 14,
    color: '#0066CC',
    marginLeft: 8,
    flex: 1,
  },
  thankYouContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0FFE0',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 14,
    color: '#008800',
    marginLeft: 8,
    fontWeight: '500',
  },
});
