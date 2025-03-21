import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native-virtualized-view";
import Navbar from "@/components/Navbar";
import NgoFooter from "@/components/NgoFooter";
import ConnectWithUs from "@/components/ConnectWithUs";
import UserItemDonationNgoCard from "@/components/UserItemDonationNgoCard";
import axios from "axios";

const API_BASE_URL = "http://192.168.56.92/phpProjects/donationApp_restapi/api";

const AllDonationsScreen = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Ngo/getAlldonations.php`);
        if (response.data.status === "success") {
          const sortedDonations = response.data.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setDonations(sortedDonations);
        } else {
          console.error("Error getting donations:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, []);

  // Function to remove accepted donation from the list
  const handleRemoveAcceptedDonation = (item_id) => {
    setDonations((prevDonations) => prevDonations.filter((item) => item.item_id !== item_id));
  };

  return (
    <ScrollView style={styles.container}>
      <Navbar />
      <Text style={styles.heading}>All Donations</Text>
      <FlatList
        data={donations}
        renderItem={({ item }) => (
          <UserItemDonationNgoCard item={item} onStatusChange={handleRemoveAcceptedDonation} />
        )}
        keyExtractor={(item) => item.item_id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      <ConnectWithUs />
      <NgoFooter />
    </ScrollView>
  );
};

export default AllDonationsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#333",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
