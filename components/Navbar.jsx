import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from "@/assets/images/logo.png";
import { Ionicons } from '@expo/vector-icons';

const Navbar = () => {
  const router = useRouter();
  const [roleId, setRoleId] = useState(null);

  useEffect(() => {
    const fetchRoleId = async () => {
      try {
        const storedRoleId = await AsyncStorage.getItem("role_id");
        if (storedRoleId) {
          setRoleId(parseInt(storedRoleId)); // Convert string to integer
        }
      } catch (error) {
        console.error("Error fetching role_id:", error);
      }
    };

    fetchRoleId();
  }, []);

  // Navigate to the correct home screen
  const handleHomeNavigation = () => {
    if (roleId === 2) {
      router.push("/Screens/User/Home/HomeScreen");
    } else if (roleId === 3) {
      router.push("/Screens/NGO/Home/NgoHomeScreen");
    } else {
      alert("Error: Invalid Role. Please log in again.");
    }
  };

  // Navigate to the correct profile screen
  const handleProfileNavigation = () => {
    if (roleId === 2) {
      router.push("/Screens/User/Profile/Profile");
    } else if (roleId === 3) {
      router.push("/Screens/NGO/Profile/NgoProfile");
    } else {
      alert("Error: Invalid Role. Please log in again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <TouchableOpacity style={styles.heading} onPress={handleHomeNavigation}>
        <Text style={styles.headingText}>DAYABHAV</Text>
      </TouchableOpacity>

      <View style={styles.userProfile}>
        <TouchableOpacity onPress={handleProfileNavigation}>
          <Ionicons name="person-circle" size={35} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  logoContainer: {
    marginRight: 10,
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  heading: {
    flex: 1,
    alignItems: "center",
  },
  headingText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 1,
  },
  userProfile: {
    marginLeft: 10,
  },
});
