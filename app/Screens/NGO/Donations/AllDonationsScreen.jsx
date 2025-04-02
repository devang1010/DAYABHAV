  import { StyleSheet, Text, View, FlatList, ActivityIndicator, Dimensions } from "react-native";
  import React, { useState, useEffect } from "react";
  import { ScrollView } from "react-native-virtualized-view";
  import Navbar from "@/components/Navbar";
  import NgoFooter from "@/components/NgoFooter";
  import ConnectWithUs from "@/components/ConnectWithUs";
  import UserItemDonationNgoCard from "@/components/UserItemDonationNgoCard";
  import axios from "axios";

  const { height, width } = Dimensions.get('window');

  const API_BASE_URL = "http://192.168.4.126/phpProjects/donationApp_restapi/api";

  const AllDonationsScreen = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchDonations = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_BASE_URL}/Ngo/getAlldonations.php`);
          if (response.data.status === "success") {
            const sortedDonations = response.data.data.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setDonations(sortedDonations);
          } else {
            setError(response.data.message || "Failed to load donations");
            console.error("Error getting donations:", response.data.message);
          }
        } catch (error) {
          setError("Network error or server not responding");
          console.error("Error fetching donations:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchDonations();
    }, []);

    // Function to remove accepted donation from the list
    const handleRemoveAcceptedDonation = (item_id) => {
      setDonations((prevDonations) => prevDonations.filter((item) => item.item_id !== item_id));
    };

    return (
      <View style={styles.container}>
        <Navbar />
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Available Donations</Text>
          <Text style={styles.subheading}>
            {donations.length} items available for your organization
          </Text>
        </View>
        
        <View style={styles.flatlistContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Loading donations...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : donations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No donations available at the moment</Text>
            </View>
          ) : (
            <FlatList
              data={donations}
              renderItem={({ item }) => (
                <UserItemDonationNgoCard item={item} onStatusChange={handleRemoveAcceptedDonation} />
              )}
              keyExtractor={(item) => item.item_id.toString()}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={styles.listFooter} />}
            />
          )}
        </View>
        <ConnectWithUs />
      </View>
    );
  };

  export default AllDonationsScreen;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F9F9F9",
    },
    headerContainer: {
      marginTop: height * 0.15, // Dynamic top margin based on screen height
      backgroundColor: "#ffffff",
      paddingVertical: 15,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#EEEEEE",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#212121",
      marginBottom: 6,
    },
    subheading: {
      fontSize: 14,
      color: "#757575",
    },
    flatlistContainer: {
      flex: 1,
      marginTop: 10,
    },
    listContainer: {
      paddingHorizontal: 16,
      paddingBottom: 100, // Extra padding to avoid content being hidden behind bottom tabs
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: height * 0.2,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 16,
      color: "#757575",
    },
    errorContainer: {
      padding: 20,
      marginHorizontal: 16,
      borderRadius: 12,
      backgroundColor: "#FFEBEE",
      alignItems: "center",
    },
    errorText: {
      fontSize: 16,
      color: "#D32F2F",
      textAlign: "center",
    },
    emptyContainer: {
      padding: 20,
      marginHorizontal: 16,
      borderRadius: 12,
      backgroundColor: "#E8F5E9",
      alignItems: "center",
    },
    emptyText: {
      fontSize: 16,
      color: "#2E7D32",
      textAlign: "center",
    },
    listFooter: {
      height: 100, // Extra space at the bottom of the list
    },
  });