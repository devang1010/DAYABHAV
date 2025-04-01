import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { openURL } from "expo-linking";

const { width } = Dimensions.get("window");

const NGOCard = ({ ngo }) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerContainer}>
        <Text style={styles.ngoName}>{ngo.ngoname}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.textContainer}>
        <Text style={styles.description} numberOfLines={3}>
          {ngo.description}
        </Text>

        <View style={styles.contactInfo}>
          <View style={styles.contactRow}>
            <Ionicons name="mail-outline" size={16} color="#666" />
            <Text style={styles.contactText}>{ngo.email}</Text>
          </View>
          
          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.contactText}>{ngo.phonenumber}</Text>
          </View>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={18} color="#4682B4" />
        <Text style={styles.location}>{ngo.address}</Text>
      </View>

      <TouchableOpacity 
        style={styles.knowMoreBtn} 
        onPress={() => openURL(ngo.website)}
      >
        <Text style={styles.knowMoreText}>Know More</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default NGOCard;

const styles = StyleSheet.create({
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    marginHorizontal: width * 0.05,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderColor: "#f0f0f0",
    borderWidth: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4682B4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logoInitial: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  ngoName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 15,
  },
  textContainer: {
    marginBottom: 20,
  },
  description: {
    fontSize: 15,
    color: "#555",
    lineHeight: 24,
    marginBottom: 15,
  },
  contactInfo: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginTop: 5,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  location: {
    fontSize: 14,
    color: "#4682B4",
    marginLeft: 10,
    flex: 1,
  },
  knowMoreBtn: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#4682B4",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4682B4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  knowMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginRight: 8,
  },
});