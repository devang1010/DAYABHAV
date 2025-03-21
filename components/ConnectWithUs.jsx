import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ConnectWithUs = () => {
  const router = useRouter();
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Connect With Us</Text>
      <View style={styles.connectContainer}>
        <TouchableOpacity style={styles.connectButton} activeOpacity={0.7} onPress={() => {router.push('/Screens/Misc/AboutUsScreen')}}>
          <MaterialIcons name="info" size={28} color="#2E86C1" />
          <Text style={styles.connectText}>About Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.connectButton} activeOpacity={0.7} onPress={() => {router.push('/Screens/Misc/ContactUsScreen')}}>
          <MaterialIcons name="phone" size={28} color="#28B463" />
          <Text style={styles.connectText}>Contact Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.connectButton} activeOpacity={0.7} onPress={() => {router.push('/Screens/Misc/FeedbackScreen')}}>
          <MaterialIcons name="feedback" size={28} color="#F39C12" />
          <Text style={styles.connectText}>Feedback</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConnectWithUs;

const styles = StyleSheet.create({
  sectionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 5,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  connectContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  connectButton: {
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  connectText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#2C3E50",
    textAlign: "center",
  },
});
