import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { openURL } from "expo-linking";

const { width } = Dimensions.get("window");

const NGOCard = ({ ngo }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.ngoName}>{ngo.ngoname}</Text>

      <View style={styles.textContainer}>
        <Text style={styles.description} numberOfLines={3}>
          {ngo.description}
        </Text>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={18} color="#4682B4" />
          <Text style={styles.location}>{ngo.address}</Text>
        </View>

        <TouchableOpacity 
          style={styles.knowMoreBtn} 
          onPress={() => openURL(ngo.website)}
        >
          <Text style={styles.knowMoreText}>Know More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NGOCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.9, // Responsive width
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginVertical: 12,
    marginHorizontal: width * 0.05, // Centered spacing
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  ngoName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  textContainer: {
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  bottomContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  location: {
    fontSize: 15,
    color: "#4682B4",
    marginLeft: 8,
  },
  knowMoreBtn: {
    width: "100%",
    backgroundColor: "#4682B4",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#4682B4",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  knowMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});