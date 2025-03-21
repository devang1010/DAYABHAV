import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const DonationCard = () => {
  const router = useRouter();
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Make a Difference!</Text>
      <Text style={styles.cardText}>
      Your unused clothes and personal belongings can bring joy to someone in need.
      Donate today and be a part of the change! 🤍
      </Text>
      <TouchableOpacity style={styles.donateBtn} onPress={() => {router.navigate('/Screens/User/Donation/DonateItemScreen')}}>
        <Text style={styles.donateText}>Donate Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DonationCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#4682B4",
    borderWidth: 1, // Lighter border thickness
    borderColor: "#BB86FC", 
    borderRadius: 15,
    padding: 20,
    marginTop: 30, // Spacing from WelcomeSection
    marginHorizontal: 15, // Spacing from screen edges
    shadowColor: "black", // Primary color for shadow
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6, // Smooth shadow effect for Android
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  donateBtn: {
    backgroundColor: "#fff", // Primary theme color
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    shadowColor: "#BB86FC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  donateText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
});
