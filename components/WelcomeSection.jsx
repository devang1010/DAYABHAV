import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from "expo-router";

const WelcomeSection = ({ welcomeMessage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("User");
  const [ngosData, setNgosData] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  // const navigation = useNavigation();
  const router = useRouter();

  // Fetch username from AsyncStorage
  useEffect(() => {
    const getUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    getUsername();
  }, []);

  useEffect(() => {
    const fetchNgosData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/getngos.php"
        )

        if (response.data.status === "success") {
          setNgosData(response.data.data);
        } else {
          console.log("Error: " + response.data.message);
        }
      } catch (error) {
        console.log("Api error: " + error);
      }
    }

    fetchNgosData();
  }, []);

  // Navigate to notification page
  const handleNotificationPress = () => {
    router.push("/Screens/User/Notification/Notification");
  };

  // Filter NGOs based on search query
  const filteredData = ngosData.filter(
    (ngo) =>
      ngo.ngoname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.phonenumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.userNameContainer}>
          <Text style={styles.userName}>Hello, {username.split(" ")[0]} 👋</Text>
          
          {/* Notification bell icon */}
          <TouchableOpacity onPress={handleNotificationPress} style={styles.notificationIcon}>
            <MaterialIcons name="notifications" size={24} color="#333" />
            {hasUnreadNotifications && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
        </View>
        <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
      </View>

      {/* React Native Paper Searchbar */}
      <Searchbar
        placeholder="Search NGOs by name, location, or description..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
        iconColor="#333"
        inputStyle={{ fontSize: 14 }}
      />

      {/* Show results ONLY if user has typed something */}
      {searchQuery.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.ngo_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemTitle}>{item.ngoname}</Text>
              
              <View style={styles.contactInfo}>
                <MaterialIcons name="location-on" size={16} color="#7f8c8d" style={styles.itemLocationIcon} />
                <Text style={styles.itemLocation}>{item.address}</Text>
              </View>
              
              <View style={styles.contactInfo}>
                <MaterialIcons name="email" size={16} color="#2980b9" style={styles.itemLocationIcon} />
                <Text style={styles.contactInfoText}>{item.email}</Text>
              </View>
              
              <View style={styles.contactInfo}>
                <MaterialIcons name="phone" size={16} color="#2980b9" style={styles.itemLocationIcon} />
                <Text style={styles.contactInfoText}>{item.phonenumber}</Text>
              </View>
              
              <Text style={styles.itemDescription} numberOfLines={3}>
                {item.description}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noResult}>No NGOs found</Text>}
        />
      ) : (
        <Text style={styles.searchPrompt}>Start typing to search for NGOs...</Text>
      )}
    </SafeAreaView>
  );
};

export default WelcomeSection;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    paddingTop: -28,
    marginTop: 80
  },
  header: {
    marginBottom: 15,
  },
  userNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  notificationIcon: {
    position: 'relative',
    padding: 5,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  welcomeMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  searchBar: {
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    elevation: 3,
    marginBottom: 10,
  },
  // Enhanced NGO Card Styles
  item: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#4a90e2", // Accent color
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 6,
  },
  itemLocation: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  itemLocationIcon: {
    marginRight: 8,
  },
  itemDescription: {
    fontSize: 13,
    color: "#34495e",
    lineHeight: 20,
    marginTop: 6,
  },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  contactInfoText: {
    fontSize: 13,
    color: "#2980b9",
    marginLeft: 8,
  },
  noResult: {
    textAlign: "center",
    color: "#bdc3c7",
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
  },
  searchPrompt: {
    textAlign: "center",
    color: "#95a5a6",
    marginTop: 20,
    fontSize: 15,
  },
});
