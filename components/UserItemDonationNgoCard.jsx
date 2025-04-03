import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://192.168.46.163/phpProjects/donationApp_restapi/api";
const IMAGE_BASE_URL = `${API_BASE_URL}/User/getimage.php?filename=`;

export default function UserItemDonationNgoCard({ item, onStatusChange }) {
  const router = useRouter();
  const [activeStatus, setActiveStatus] = useState(
    item.status.trim().toLowerCase()
  );
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

  const handleStatusChange = async (newStatus) => {
    if (newStatus === "accepted" && ngoDetails.ngo_id) {
      const requestData = {
        ngo_id: ngoDetails.ngo_id,
        user_id: item.user_id,
        username: item.username,
        ngoname: ngoDetails.ngoname,
        item_name: item.item_name,
        quantity: item.quantity ?? "1",
        status: "Accepted",
        item_id: item.item_id
      };

      try {
        const response = await axios.post(
          `${API_BASE_URL}/Ngo/addToInventory.php`,
          requestData
        );

        if (response.data.status === "success") {
          console.log("Item successfully added to inventory");

          // Update donation status in donated_items table
          await axios.post(`${API_BASE_URL}/Ngo/updateDonationStatus.php`, {
            item_id: item.item_id,
            status: "Accepted",
            ngo_id: ngoDetails.ngo_id,
            ngoname: ngoDetails.ngoname,
          });

          setActiveStatus("accepted");
          onStatusChange(item.item_id); // Remove the accepted item from the list
          
          // Show success alert
          Alert.alert(
            "Success",
            "Item successfully added to inventory",
            [{ text: "OK" }]
          );
        } else {
          console.error("Failed to update status:", response.data.message);
          
          // Show error alert based on the specific error message
          if (response.data.message === "Item already exists in inventory") {
            Alert.alert(
              "Duplicate Item",
              "This item already accpeted by other NGOs! Please Refresh...",
              [{ text: "OK" }]
            );
            
            // Since the item is already in inventory, we should still update the status
            setActiveStatus("accepted");
            
            // Update donation status in donated_items table
            await axios.post(`${API_BASE_URL}/Ngo/updateDonationStatus.php`, {
              item_id: item.item_id,
              status: "Accepted",
              ngo_id: ngoDetails.ngo_id,
              ngoname: ngoDetails.ngoname,
            });
            
            onStatusChange(item.item_id); // Remove the item from the list
          } else {
            Alert.alert(
              "Error",
              response.data.message || "Failed to update status",
              [{ text: "OK" }]
            );
          }
        }
      } catch (error) {
        console.error("Error updating status:", error);
        Alert.alert(
          "Error",
          "Network error or server not responding",
          [{ text: "OK" }]
        );
      }
    } else {
      console.error("Missing NGO details or invalid status");
      Alert.alert(
        "Error",
        "Missing NGO details or invalid status",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/Screens/NGO/Donations/DonationDetailScreen",
          params: {
            item_name: item.item_name,
            donor: item.username,
            user_id: item.user_id,
            contact: item.contact || "+91 9876543210",
            image: item.item_image,
            status: activeStatus,
            item_id: item.item_id,
          },
        })
      }
    >
      <Image
        source={{ uri: `${IMAGE_BASE_URL}${item.item_image}` }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.itemName}>{item.item_name}</Text>
        {/* <Text style={styles.donorName}>Donor: {item.username}</Text> */}
        <Text style={styles.date}>Date: {item.created_at}</Text>

        <View style={styles.statusContainer}>
          {["pending", "accepted"].map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.statusButton,
                activeStatus === s && { backgroundColor: getStatusColor(s) },
              ]}
              onPress={() => handleStatusChange(s)}
            >
              <Text
                style={[
                  styles.statusText,
                  activeStatus === s && styles.selectedText,
                ]}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// And update your getStatusColor function for better colors:
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "#FF9800"; // Orange
    case "accepted":
      return "#4CAF50"; // Green
    default:
      return "#E0E0E0";
  }
};
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
    marginHorizontal: 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 16,
    resizeMode: 'contain',
    backgroundColor: '#f9f9f9',
  },
  details: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 2,
  },
  donorName: {
    fontSize: 14,
    color: "#424242",
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statusText: {
    fontSize: 12,
    color: "#424242",
    fontWeight: "600",
  },
  selectedText: {
    color: "#fff",
  },
});