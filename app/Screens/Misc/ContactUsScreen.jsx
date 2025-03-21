import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { send, EmailJSResponseStatus } from "@emailjs/react-native";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContactUsScreen = () => {
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !email || !message) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
  
    console.log("Form data:", { name, email, message }); // Debugging
  
    try {
      // Create template params with EXACT matching keys
      const templateParams = {
        name: name,
        email: email,
        message: message
      };
      
      await send(
        "service_f87v82e", 
        "template_zechngv",
        templateParams,
        {
          publicKey: "YW9MC1CaPkxYBJHRl",
        }
      );
  
      Alert.alert("Success", "Your message has been sent!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("Error details:", JSON.stringify(err)); // More complete error logging
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Navbar />

      <View style={styles.content}>
        <Text style={styles.title}>Contact Us</Text>

        {/* Contact Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#888"
          />

          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#888"
          />

          <TextInput
            style={[styles.input, styles.reasonInput]}
            placeholder="Reason for contacting"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            placeholderTextColor="#888"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* Social Media Links */}
        <View style={styles.socialContainer}>
          <Text style={styles.socialTitle}>Follow Us</Text>
          <View style={styles.socialLinks}>
            {["Twitter", "Facebook", "Instagram", "LinkedIn"].map((platform, index) => (
              <TouchableOpacity key={index} style={styles.socialButton}>
                <Text style={styles.socialLink}>{platform}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <Footer />
    </ScrollView>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5", // Light Gray Background
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reasonInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4682B4",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  socialContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4682B4",
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginLeft: -20
  },
  socialButton: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  socialLink: {
    color: "#4682B4",
    fontSize: 16,
    fontWeight: "bold",
  },
});