import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  Avatar,
  Text,
  Card,
  Button,
  Divider,
  IconButton,
} from "react-native-paper";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [numberOfDonations, setNumberOfDonations] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
    memberSince: "Jan 2024",
    totalDonations: 0,
  });

  // Parse location into city and country
  const parseLocation = (location) => {
    if (!location) return { city: "", country: "" };
    const parts = location.split(", ");
    return {
      city: parts[0] || "",
      country: parts[1] || "",
    };
  };

  // Fetch user_id from AsyncStorage
  useEffect(() => {
    let isMounted = true; // Track if component is mounted

    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("user_id");
        if (storedUserId && isMounted) {
          setUserId(storedUserId);
          fetchUserData(storedUserId);
          fetchNumberOfDonations(storedUserId);
        } else if (isMounted) {
          console.log("User ID not found.");
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.log("Failed to retrieve user ID.");
          setLoading(false);
        }
      }
    };

    getUserId();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  // Number of Donations done by the user
  const fetchNumberOfDonations = async (userIdValue) => {
    try {
      const response = await axios.get(
        `http://192.168.4.126/phpProjects/donationApp_restapi/api/User/getuserdonationstats.php?user_id=${userIdValue}`
      );

      if (response.data.status === "success") {
        setNumberOfDonations(response.data.count);
      } else {
        console.log("Error fetching donation stats: " + response.data.message);
        console.error("Error: " + response.data.message);
      }
    } catch (e) {
      console.log("API error fetching donation stats: " + e.message);
      console.error("API error: " + e);
    }
  };

  const fetchUserData = async (userIdValue) => {
    try {
      const response = await axios.get(
        `http://192.168.4.126/phpProjects/donationApp_restapi/api/User/getUser.php?user_id=${userIdValue}`
      );

      if (response.data.status === "success") {
        const user = response.data.user;

        // Fetch donation count
        const donationResponse = await axios.get(
          `http://192.168.4.126/phpProjects/donationApp_restapi/api/User/getuserdonationstats.php?user_id=${userIdValue}`
        );

        let donationCount = 0;
        if (donationResponse.data.status === "success") {
          donationCount = donationResponse.data.count;
        }

        setProfileData({
          name: user.username,
          email: user.email,
          location: user.city + ", " + user.country,
          phone: user.phonenumber,
          memberSince: new Date(user.created_at).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          totalDonations: donationCount,
        });
      } else {
        console.log("User not found.");
      }
    } catch (err) {
      console.log("Failed to load user data: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    fetchUserData(userId);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setUpdating(true);
    try {
      const { city, country } = parseLocation(profileData.location);

      const updateData = {
        user_id: userId,
        username: profileData.name,
        email: profileData.email,
        phonenumber: profileData.phone,
        city: city,
        country: country,
      };

      const response = await axios.put(
        `http://192.168.4.126/phpProjects/donationApp_restapi/api/User/updateUser.php?user_id=${userId}`,
        updateData
      );

      if (response.data.status === "success") {
        Alert.alert("Success", "Profile updated successfully");
        setIsEditing(false);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to update profile"
        );
      }
    } catch (err) {
      Alert.alert("Error", "Failed to update profile: " + err.message);
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user_id");
    router.replace("/Screens/Auth/LoginScreen");
  };

  const deleteUser = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(
                `http://192.168.4.126/phpProjects/donationApp_restapi/api/User/deleteUser.php?user_id=${userId}`
              );

              if (response.data.status === "success") {
                Alert.alert("Success", "Account deleted successfully!");
                router.push("/Screens/Auth/RegisterScreen");
              } else {
                Alert.alert("Error", response.data.message);
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert(
                "Error",
                "Something went wrong. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4682B4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
    <ScrollView >
      <View style={styles.headerContainer}>
        <View style={styles.headerBackground} />
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.userProfile}>
          <Avatar.Text
            size={80}
            label={profileData.name.substring(0, 2).toUpperCase()}
            style={styles.avatar}
            color="#FFFFFF"
          />
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={profileData.name}
              onChangeText={(text) => handleChange("name", text)}
            />
          ) : (
            <Text style={styles.userName}>{profileData.name}</Text>
          )}
          {isEditing ? (
            <TextInput
              style={styles.emailInput}
              value={profileData.email}
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.userEmail}>{profileData.email}</Text>
          )}
        </View>
        <Card elevation={3} style={styles.userInfoContainer}>
          <Card.Title
            title="User Information"
            titleStyle={styles.cardTitle}
            right={() =>
              !isEditing ? (
                <IconButton
                  icon="pencil"
                  iconColor="#4682B4"
                  size={24}
                  onPress={() => setIsEditing(true)}
                />
              ) : null
            }
          />
          <Card.Content>
            <View style={styles.infoRow}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>📍 Location</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={profileData.location}
                  onChangeText={(text) => handleChange("location", text)}
                  placeholder="City, Country"
                />
              ) : (
                <Text style={styles.value}>{profileData.location}</Text>
              )}
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>📞 Phone</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={profileData.phone}
                  onChangeText={(text) => handleChange("phone", text)}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.value}>{profileData.phone}</Text>
              )}
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>📅 Member Since</Text>
              </View>
              <Text style={styles.value}>{profileData.memberSince}</Text>
            </View>
            {isEditing && (
              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  style={styles.cancelBtn}
                  textColor="#4682B4"
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={styles.saveBtn}
                  loading={updating}
                  disabled={updating}
                >
                  Update Profile
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
        <Card elevation={3} style={styles.userInfoContainer}>
          <Card.Title title="Donation Stats" titleStyle={styles.cardTitle} />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text style={styles.label}>🎁 Total Donations</Text>
              <Text style={styles.valueHighlight}>
                {profileData.totalDonations}
              </Text>
            </View>
          </Card.Content>
        </Card>
        <View style={styles.accountButtonsContainer}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutBtn}
            icon="logout"
          >
            Log Out
          </Button>
          <Button
            mode="contained"
            onPress={deleteUser}
            style={styles.deleteBtn}
            icon="delete"
          >
            Delete Profile
          </Button>
        </View>
      </View>
    </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FF3D00",
    fontSize: 16,
    textAlign: "center",
  },
  headerContainer: {
    marginTop: 40,
    height: 150,
    position: "relative",
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: "#4682B4",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: -80,
  },
  userProfile: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: "#4682B4",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    elevation: 5,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "black",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "black",
  },
  nameInput: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    width: 250,
    borderBottomWidth: 1,
    borderBottomColor: "#4682B4",
    backgroundColor: "#FFFFFF",
    marginBottom: 5,
    padding: 5,
    borderRadius: 5,
  },
  emailInput: {
    fontSize: 16,
    textAlign: "center",
    width: 250,
    borderBottomWidth: 1,
    borderBottomColor: "#4682B4",
    backgroundColor: "#FFFFFF",
    padding: 5,
    borderRadius: 5,
  },
  input: {
    fontSize: 16,
    flex: 1,
    textAlign: "right",
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#4682B4",
    padding: 0,
    marginLeft: 10,
  },
  userInfoContainer: {
    width: "90%",
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4682B4",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    width: "100%",
  },
  labelContainer: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    borderColor: "#4682B4",
  },
  saveBtn: {
    flex: 2,
    backgroundColor: "#4682B4",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  valueHighlight: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4682B4",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  accountButtonsContainer: {
    width: "90%",
    flexDirection: "column",
    marginBottom: 80,
  },
  logoutBtn: {
    marginTop: 10,
    backgroundColor: "#4682B4",
    borderRadius: 10,
    elevation: 2,
  },
  deleteBtn: {
    marginTop: 10,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    elevation: 2,
  },
});

export default Profile;