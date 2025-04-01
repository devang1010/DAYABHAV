import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Dimensions } from "react-native";
import React, { useState } from "react";
import { send } from "@emailjs/react-native";
import { useRouter } from "expo-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Ionicons } from '@expo/vector-icons';

const ContactUsScreen = () => {
  const router = useRouter();
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Navigate to feedback screen
  const navigateToFeedback = () => {
    router.push("/Screens/Misc/FeedbackScreen");
  };

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
    <View style={styles.mainContainer}>
      <Navbar />
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>We'd love to hear from you</Text>

          {/* Contact Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#4682B4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#4682B4" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Your Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="chatbubble-outline" size={20} color="#4682B4" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.reasonInput]}
                placeholder="Reason for contacting"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={4}
                placeholderTextColor="#888"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>

          {/* Feedback Button */}
          <TouchableOpacity style={styles.feedbackButton} onPress={navigateToFeedback}>
            <Ionicons name="star-outline" size={20} color="#FFF" />
            <Text style={styles.feedbackButtonText}>Share Feedback</Text>
          </TouchableOpacity>

          {/* Social Media Links */}
          <View style={styles.socialContainer}>
            <Text style={styles.socialTitle}>Connect With Us</Text>
            <View style={styles.socialLinks}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-twitter" size={22} color="#4682B4" />
                <Text style={styles.socialLink}>Twitter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={22} color="#4682B4" />
                <Text style={styles.socialLink}>Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-instagram" size={22} color="#4682B4" />
                <Text style={styles.socialLink}>Instagram</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-linkedin" size={22} color="#4682B4" />
                <Text style={styles.socialLink}>LinkedIn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* <Footer /> */}
    </View>
  );
};

export default ContactUsScreen;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
  },
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 120,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  formContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
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
    marginTop: 5,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackButton: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#008080",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  feedbackButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  socialContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  socialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#4682B4",
  },
  socialLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: windowWidth - 40,
  },
  socialButton: {
    flexDirection: "row",
    backgroundColor: "#E8E8E8",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  socialLink: {
    color: "#4682B4",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
});