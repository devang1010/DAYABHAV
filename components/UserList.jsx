import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Pressable, Button } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { Searchbar } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { router } from "expo-router";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(
          "http://192.168.46.163/phpProjects/donationApp_restapi/api/Admin/getallusers.php"
        );

        if (response.data.status === "success") {
          const sortedUsers = response.data.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setUsers(sortedUsers);
          
          // Initially display first 10 users
          setDisplayedUsers(sortedUsers.slice(0, usersPerPage));
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("Api error: ", error);
      }
    };

    fetchAllUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phonenumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const startIndex = nextPage * usersPerPage - usersPerPage;
    const endIndex = nextPage * usersPerPage;
    
    const newDisplayedUsers = filteredUsers.slice(startIndex, endIndex);
    
    setDisplayedUsers(prev => [...prev, ...newDisplayedUsers]);
    setPage(nextPage);
  };

  const handleDeleteUser = async (userId) => {
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
                `http://192.168.46.163/phpProjects/donationApp_restapi/api/User/deleteUser.php?user_id=${userId}`
              );

              if (response.data.status === "success") {
                // Remove from both full users list and displayed users
                setUsers((currentUsers) =>
                  currentUsers.filter((user) => user.user_id !== userId)
                );
                setDisplayedUsers((currentUsers) =>
                  currentUsers.filter((user) => user.user_id !== userId)
                );
                Alert.alert("Success", "Account deleted successfully!");
              } else {
                Alert.alert("Error", response.data.message);
              }
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          },
        },
      ]
    );
  };

  const UserCard = ({ item }) => (
    <TouchableOpacity onPress={() => {router.push(`/Screens/ADMIN/UserDetailsPage?user_id=${item.user_id}`)}}>
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.username}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userPhone}>+91 {item.phonenumber}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteUser(item.user_id)}
      >
        <MaterialIcons name="delete" size={24} color="#ff6b6b" />
      </TouchableOpacity>
    </View>
      </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Searchbar */}
      <Searchbar
        placeholder="Search users by name, email, phone..."
        value={searchQuery}
        onChangeText={(query) => {
          setSearchQuery(query);
          setPage(1);
          setDisplayedUsers(filteredUsers.slice(0, usersPerPage));
        }}
        style={styles.searchBar}
        iconColor="#333"
        inputStyle={{ fontSize: 14 }}
      />

      {/* Show results */}
      {searchQuery.length > 0 && filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={50} color="#bdc3c7" />
          <Text style={styles.noResult}>No users found</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          {displayedUsers.map((user) => (
            <UserCard key={user.user_id} item={user} />
          ))}
        </ScrollView>
      )}
      
      {displayedUsers.length < filteredUsers.length && (
        <TouchableOpacity 
          style={styles.loadMoreButton} 
          onPress={handleLoadMore}
        >
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  searchBar: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    elevation: 5,
    marginBottom: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  userCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.12,
    // shadowRadius: 6,
    // elevation: 6,
    borderWidth: 1,
    borderColor: "#e3e3e3",
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 3,
  },
  userPhone: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  deleteButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#fff3f3",
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  loadMoreButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  noResult: {
    textAlign: "center",
    color: "#bdc3c7",
    marginTop: 10,
    fontSize: 16,
    fontStyle: "italic",
  },
});


export default UserList;