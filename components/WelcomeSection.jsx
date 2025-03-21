import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import ngosData from "@/data/ngosData"; // Import your data file

const WelcomeSection = ({ welcomeMessage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState("User"); // Default username

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

  // Filter NGOs based on search query
  const filteredData = ngosData.filter(
    (ngo) =>
      ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ngo.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.userName}>Hello, {username} 👋</Text>
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => {}}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text style={styles.itemLocation}>{item.location}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
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
    paddingTop: -28
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
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemLocation: {
    fontSize: 14,
    color: "#666",
  },
  itemDescription: {
    fontSize: 12,
    color: "#999",
  },
  noResult: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  searchPrompt: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
    fontSize: 14,
  },
});
