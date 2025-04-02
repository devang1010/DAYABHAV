import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, StatusBar, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const API_BASE_URL = "http://192.168.4.126/phpProjects/donationApp_restapi/api";
const IMAGE_BASE_URL = `${API_BASE_URL}/User/getimage.php?filename=`;

const WelcomeSectionNgo = ({ welcomeMessage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState(""); 
  const [donationData, setDonationData] = useState([]);

  useEffect(() => {
    const getUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("ngoname");
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
    const fetchDonationData = async () => {
      try {
        const response = await axios.get(
          "http://192.168.4.126/phpProjects/donationApp_restapi/api/Ngo/getAlldonations.php"
        )

        if (response.data.status === "success") {
          setDonationData(response.data.data);
        } else {
          console.log("Error: " + response.data.message);
        }
      } catch (error) {
        console.log ("Api error: " + error);
      }
    }

    fetchDonationData();
  }, [])

  // Filter donations based on search query
  const filteredData = donationData.filter((donation) =>
    donation.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.item_condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get status color
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pending': return '#FFA500'; // Orange
      case 'accepted': return '#4CAF50'; // Green
      case 'completed': return '#2196F3'; // Blue
      default: return '#9E9E9E'; // Grey
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.userName}>Hello, {username} 👋</Text>
        <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
      </View>

      {/* Searchbar */}
      <Searchbar
        placeholder="Search donated items, donors, status..."
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
          keyExtractor={(item) => item.item_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => {}}>
              <Image 
                source={{ uri: `${IMAGE_BASE_URL}${item.item_image}` }} 
                style={styles.itemImage} 
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.item_name}
                </Text>
                
                <View style={styles.itemDetailRow}>
                  <MaterialIcons name="person" size={16} color="#7f8c8d" style={styles.itemIcon} />
                  <Text style={styles.itemDonor}>Donor: {item.username}</Text>
                </View>
                
                <View style={styles.itemDetailRow}>
                  <MaterialIcons name="calendar-today" size={16} color="#7f8c8d" style={styles.itemIcon} />
                  <Text style={styles.itemDate}>Date: {item.created_at}</Text>
                </View>
                
                <View style={styles.itemDetailRow}>
                  <MaterialIcons name="info" size={16} color="#7f8c8d" style={styles.itemIcon} />
                  <Text 
                    style={[
                      styles.itemStatus, 
                      { 
                        backgroundColor: getStatusColor(item.status),
                        color: item.status.toLowerCase() === 'pending' ? '#333' : '#fff'
                      }
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="search-off" size={50} color="#bdc3c7" />
              <Text style={styles.noResult}>No items found</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.searchPrompt}>Start typing to search donated items...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default WelcomeSectionNgo;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
    paddingTop: 90
  },
  header: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
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
  item: {
    flexDirection: "row",
    alignItems: "center",
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
    borderLeftColor: "#4a90e2",
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemIcon: {
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 6,
  },
  itemDonor: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  itemDate: {
    fontSize: 13,
    color: "#7f8c8d",
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  noResult: {
    textAlign: "center",
    color: "#bdc3c7",
    marginTop: 10,
    fontSize: 16,
    fontStyle: "italic",
  },
  searchPrompt: {
    textAlign: "center",
    color: "#95a5a6",
    marginTop: 10,
    fontSize: 15,
  },
});