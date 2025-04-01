import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";

const NgoRequirementUserScreen = ({ item }) => {
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.itemName}>{item.item_name || "Unnamed Item"}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.quantity || "0"}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsLabel}>NGO name:</Text>
        <Text style={styles.detailsValue}>
          {item.ngo_name || item.ngoname || "Unknown NGO"}
        </Text>
      </View>
    </View>
  );
};

export default NgoRequirementUserScreen;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  card: {
    width: windowWidth - 30, // Account for outer padding
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    flex: 1,
    flexWrap: "wrap",
  },
  badge: {
    backgroundColor: "#3498db",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    marginTop: 6,
    alignItems: "center",
    flexWrap: "wrap",
  },
  detailsLabel: {
    fontSize: 15,
    color: "#7f8c8d",
    fontWeight: "500",
    marginRight: 6,
  },
  detailsValue: {
    fontSize: 16,
    color: "#34495e",
    fontWeight: "600",
    flex: 1,
    flexWrap: "wrap",
  },
});