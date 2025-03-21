import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { openURL } from "expo-linking";

const NGOCard = ({ ngo }) => {
  return (
    <View style={styles.card}>
      {/* NGO Name */}
      <Text style={styles.ngoName}>{ngo.ngoname}</Text>

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {ngo.description}
      </Text>

      {/* Location */}
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={18} color="#4682B4" />
        <Text style={styles.location}>{ngo.address}</Text>
      </View>

      {/* Know More Button */}
      <TouchableOpacity
        style={styles.knowMoreBtn}
        onPress={() => openURL(ngo.website)}
      >
        <Text style={styles.knowMoreText}>Know More</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NGOCard;

const styles = StyleSheet.create({
  card: {
    width: 260,
    height: 250,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    justifyContent: "space-between",
  },
  ngoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  location: {
    fontSize: 14,
    color: "#4682B4",
    marginLeft: 5,
  },
  knowMoreBtn: {
    width: "100%",
    backgroundColor: "#4682B4",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  knowMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});
