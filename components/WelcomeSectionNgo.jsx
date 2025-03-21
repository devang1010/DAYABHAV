import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, StatusBar, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Searchbar } from "react-native-paper";
import ngoRecivedDonation from "@/data/ngoRecivedDonation";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const WelcomeSectionNgo = ({ welcomeMessage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState(""); // Default username

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

  // Filter donations based on search query
  const filteredData = ngoRecivedDonation.filter((donation) =>
    donation.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.item} onPress={() => {}}>
              <Image source={item.image} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.item}</Text>
                <Text style={styles.itemDonor}>Donor: {item.donor}</Text>
                <Text style={styles.itemDate}>Date: {item.date}</Text>
                <Text style={[styles.itemStatus, styles[item.status]]}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noResult}>No items found</Text>}
        />
      ) : (
        <Text style={styles.searchPrompt}>Start typing to search donated items...</Text>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  itemDonor: {
    fontSize: 14,
    color: "#666",
  },
  itemDate: {
    fontSize: 12,
    color: "#777",
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  pending: {
    backgroundColor: "#ffcc00",
    color: "#333",
  },
  accepted: {
    backgroundColor: "#4caf50",
    color: "#fff",
  },
  completed: {
    backgroundColor: "#008cba",
    color: "#fff",
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
