import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SafeAreaView } from "react-native-safe-area-context";

// Base URL for your API
const API_BASE_URL = "http://192.168.46.163/phpProjects/donationApp_restapi/api";
const IMAGE_BASE_URL = `${API_BASE_URL}/User/getimage.php?filename=`;

const DonateItemScreen = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemCondition, setItemCondition] = useState("");
  const [userSection, setUserSection] = useState("");
  const [numberOfItems, setNumberOfItems] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [uploadedImageFilename, setUploadedImageFilename] = useState(null);
  const [submitStatus, setSubmitStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset the form state
  const resetForm = () => {
    setItemName("");
    setItemCondition("");
    setUserSection("");
    setNumberOfItems("");
    setItemImage(null);
    setUploadedImageFilename(null);
    setSubmitStatus("");
  };

  // Refresh the screen every time it comes into focus
  useFocusEffect(
    useCallback(() => {
      resetForm(); // Reset the form state
      getUserData(); // Fetch user data again if needed
    }, [])
  );

  // get user id
  const getUserData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("user_id");
      const storedUsername = await AsyncStorage.getItem("username");

      if (storedUserId) {
        setUserId(storedUserId);

        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          // Fetch username from API if not in AsyncStorage
          const response = await axios.get(
            `${API_BASE_URL}/User/getUser.php?user_id=${storedUserId}`
          );
          if (response.data.username) {
            setUsername(response.data.username);
            await AsyncStorage.setItem("username", response.data.username);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // get image
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to the gallery."
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setItemImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const uploadImage = async (uri) => {
    setIsLoading(true);

    try {
      // Create form data
      const formData = new FormData();
      const fileExtension = uri.split(".").pop();
      const fileName = `image.${fileExtension}`;

      formData.append("image", {
        uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
        type: `image/${fileExtension}`,
        name: fileName,
      });

      // Upload image to server
      const uploadResponse = await axios.post(
        `${API_BASE_URL}/User/uploadimage.php`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.data.status === "success") {
        setUploadedImageFilename(uploadResponse.data.filename);
        console.log("Image uploaded successfully:", uploadResponse.data.filename);
      } else {
        Alert.alert("Error", "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !userId ||
      !username ||
      !itemName ||
      !itemCondition ||
      !userSection ||
      !numberOfItems ||
      !uploadedImageFilename
    ) {
      Alert.alert("Error", "Please fill all fields and upload an image");
      return;
    }

    setIsLoading(true);

    const formData = {
      user_id: userId,
      username: username,
      item_name: itemName,
      item_condition: itemCondition.trim().toLowerCase(),
      user_section: userSection,
      number_of_items: numberOfItems,
      image_filename: uploadedImageFilename,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/User/itemdonation.php`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === "success") {
        setSubmitStatus(response.data.message);
        Alert.alert("Success", response.data.message);

        // Reset form
        resetForm();
      } else {
        Alert.alert("Error", response.data.message || "Failed to submit donation");
      }
    } catch (error) {
      console.error("Error submitting donation:", error);
      Alert.alert("Error", "Failed to submit donation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
    <ScrollView>
      <View >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Donate an Item</Text>
          <TextInput
            label="Item Name"
            value={itemName}
            onChangeText={setItemName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Item Condition (New/Used)"
            value={itemCondition}
            onChangeText={setItemCondition}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Your Section (Donor/NGO)"
            value={userSection}
            onChangeText={setUserSection}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Number of Items"
            value={numberOfItems}
            onChangeText={setNumberOfItems}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Username"
            value={username}
            mode="outlined"
            style={styles.input}
            editable={false} // User cannot edit username manually
          />

          <TouchableOpacity
            style={[styles.imagePicker, isLoading && styles.disabledButton]}
            onPress={pickImage}
            disabled={isLoading}
          >
            <Text style={styles.imagePickerText}>
              {itemImage ? "Change Image" : "Upload Item Picture"}
            </Text>
          </TouchableOpacity>

          {isLoading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#4682B4" />
              <Text style={styles.loaderText}>Uploading...</Text>
            </View>
          )}

          {itemImage && (
            <Image source={{ uri: itemImage }} style={styles.imagePreview} />
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            disabled={isLoading}
            loading={isLoading}
          >
            Submit Donation
          </Button>

          {submitStatus ? (
            <Text style={styles.successText}>{submitStatus}</Text>
          ) : null}
        </ScrollView>
      </View>
    </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", backgroundColor: "#F8F9FA", flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 50, marginTop: 80,},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#4682B4",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
  },
  imagePicker: {
    backgroundColor: "#4682B4",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  imagePickerText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  imagePreview: {
    width: 140,
    height: 140,
    alignSelf: "center",
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#4A148C",
  },
  button: {
    fontSize: 20,
    marginTop: 10,
    backgroundColor: "#4682B4",
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  successText: {
    color: "green",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
  },
  loaderContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4682B4",
  },
});

export default DonateItemScreen;