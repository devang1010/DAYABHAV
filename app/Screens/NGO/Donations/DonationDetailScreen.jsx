import { StyleSheet, View, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import DonationDetailCard from "@/components/DonationDetailCard";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Navbar from "@/components/Navbar";
import NgoFooter from "@/components/NgoFooter";
import ConnectWithUs from "@/components/ConnectWithUs";
import { ScrollView } from "react-native-virtualized-view";

const API_BASE_URL = "http://192.168.56.92/phpProjects/donationApp_restapi/api";
const IMAGE_BASE_URL = `${API_BASE_URL}/User/getimage.php?filename=`;

const DonationDetailScreen = () => {
  const router = useRouter();
  const { item_name, donor, contact, image, status, user_id, quantity, item_id } = useLocalSearchParams();
  const [ngoDetails, setNgoDetails] = useState({ ngo_id: null, ngoname: "" });

  useEffect(() => {
    const fetchNgoDetails = async () => {
      try {
        const ngo_id = await AsyncStorage.getItem("ngo_id");
        const ngoname = await AsyncStorage.getItem("ngoname");
        setNgoDetails({ ngo_id, ngoname });
      } catch (error) {
        console.error("Error fetching NGO details:", error);
      }
    };
    fetchNgoDetails();
  }, []);

  const handleAcceptDonation = async () => {
    if (!ngoDetails.ngo_id) {
      Alert.alert("Error", "NGO details are missing!");
      return;
    }

    const requestData = {
      ngo_id: ngoDetails.ngo_id,
      user_id: user_id,
      username: donor,
      ngoname: ngoDetails.ngoname,
      item_name: item_name,
      quantity: quantity ?? "1", // Default to 1 if undefined
      status: "Accepted",
    };

    console.log("Sending data to API:", requestData);

    try {
      const response = await axios.post(`${API_BASE_URL}/Ngo/addToInventory.php`, requestData);

      if (response.data.status === "success") {
        Alert.alert("Success", "Donation accepted and added to inventory!");
        router.back(); // Go back to previous screen
      } else {
        console.error("Failed to accept donation:", response.data.message);
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error accepting donation:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ScrollView>
      <Navbar />
      <View style={styles.container}>
        <DonationDetailCard
          item={item_name}
          donor={donor}
          contact={contact}
          image={{ uri: `${IMAGE_BASE_URL}${image}` }}
          status={status}
          onAccept={handleAcceptDonation} // Call function on Accept
        />
      </View>
      <ConnectWithUs />
      <NgoFooter />
    </ScrollView>
  );
};

export default DonationDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
});
