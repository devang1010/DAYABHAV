import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { openURL } from "expo-linking";

const Footer = () => {
  const router = useRouter();
  return (
    <View style={styles.footerContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <TouchableOpacity onPress={() => {router.push('/Screens/Misc/AboutUsScreen')}}>
          <Text style={styles.linkText}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {router.push('/Screens/User/Donation/DonateItemScreen')}}>
          <Text style={styles.linkText}>Donate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {router.push('/Screens/User/Ngo/NGOListScreen')}}>
          <Text style={styles.linkText}>Our NGOs</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {router.push('/Screens/Misc/ContactUsScreen')}}>
          <Text style={styles.linkText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {router.push('/Screens/Misc/FeedbackScreen')}}>
          <Text style={styles.linkText}>Feedback</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reach out to Us</Text>
        <Text style={styles.infoText}>📍 Ahmedabad, India</Text>
        <Text style={styles.infoText}>📧 support@charityapp.com</Text>
        <Text style={styles.infoText}>📞 +91 9876543210</Text>
      </View>

      <View style={styles.socialIcons}>
        <TouchableOpacity  onPress={() => {openURL("https://www.facebook.com")}}>
          <Ionicons name="logo-facebook" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {openURL("https://www.instagram.com")}}>
          <Ionicons name="logo-instagram" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {openURL("https://www.x.com")}}>
          <Ionicons name="logo-twitter" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {openURL("https://www.linkdin.com")}}>
          <Ionicons name="logo-linkedin" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.copyrightText}>© 2025 Charity App. All Rights Reserved.</Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#ddd",
    padding: 20,
    alignItems: "center",
  },
  section: {
    marginBottom: 15,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  linkText: {
    fontSize: 14,
    color: "black",
    marginBottom: 3,
  },
  infoText: {
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },
  socialIcons: {
    flexDirection: "row",
    gap: 15,
    marginVertical: 10,
  },
  copyrightText: {
    fontSize: 12,
    color: "black",
    marginTop: 10,
  },
});
