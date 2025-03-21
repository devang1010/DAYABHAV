import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const RecentItemDonation = ({ item }) => {
  const router = useRouter();
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "Accepted":
        return "#2E8B57";
      default:
        return "#000000";
    }
  };

  return (
    <View style={styles.donationItem} onPress={() => {router.push('/Screens/NGO/Donations/DonationDetailScreen')}}>
      <View style={styles.donationDetails}>
        <Text style={styles.donationItemName}>{item.item_name}</Text>
        <Text style={styles.donationDonor}>From: {item.username}</Text>
        <Text style={styles.donationDate}>date: {item.created_at}</Text>
      </View>
      <View
        style={[
          styles.donationStatus,
          { backgroundColor: getStatusColor(item.status) },
        ]}
      >
        <Text style={styles.donationStatusText}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  donationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
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
});

export default RecentItemDonation;
