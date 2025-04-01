import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { Searchbar } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { router } from "expo-router";

const NgoList = () => {
  const [ngos, setNgos] = useState([]);
  const [displayedNgos, setDisplayedNgos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const ngosPerPage = 5;

  useEffect(() => {
    const fetchAllNgos = async () => {
      try {
        const response = await axios.get(
          "http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/getngos.php"
        );

        if (response.data.status === "success") {
          const sortedNgos = response.data.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setNgos(sortedNgos);
          
          // Initially display first 5 ngos
          setDisplayedNgos(sortedNgos.slice(0, ngosPerPage));
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("Api error: ", error);
      }
    };

    fetchAllNgos();
  }, []);

  // Filter ngos based on search query
  const filteredNgos = ngos.filter((ngo) =>
    ngo.ngoname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ngo.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ngo.phonenumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ngo.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const startIndex = nextPage * ngosPerPage - ngosPerPage;
    const endIndex = nextPage * ngosPerPage;
    
    const newDisplayedNgos = filteredNgos.slice(startIndex, endIndex);
    
    setDisplayedNgos(prev => [...prev, ...newDisplayedNgos]);
    setPage(nextPage);
  };

  const handleDeleteNgo = async (ngoId) => {
    Alert.alert(
      "Delete NGO",
      "Are you sure you want to delete this NGO? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await axios.delete(
                `http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/deleteNgo.php`,
                { data: { ngo_id: ngoId } }
              );

              if (response.data.status === "success") {
                // Remove from both full ngos list and displayed ngos
                setNgos((currentNgos) =>
                  currentNgos.filter((ngo) => ngo.ngo_id !== ngoId)
                );
                setDisplayedNgos((currentNgos) =>
                  currentNgos.filter((ngo) => ngo.ngo_id !== ngoId)
                );
                Alert.alert("Success", "NGO deleted successfully!");
              } else {
                Alert.alert("Error", response.data.message);
              }
            } catch (error) {
              console.error("Error deleting NGO:", error);
              Alert.alert("Error", "Something went wrong. Please try again.");
            }
          },
        },
      ]
    );
  };

  const NgoCard = ({ item }) => (
    <TouchableOpacity onPress={() => {
      router.push(`/Screens/ADMIN/NgoDetailsPage?ngo_id=${item.ngo_id}`)
    }}>
    <View style={styles.ngoCard}>
      <View style={styles.ngoInfo}>
        <Text style={styles.ngoName}>{item.ngoname}</Text>
        <Text style={styles.ngoEmail}>{item.email}</Text>
        <Text style={styles.ngoPhone}>+91 {item.phonenumber}</Text>
        <Text style={styles.ngoLocation}>{item.location}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteNgo(item.ngo_id)}
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
        placeholder="Search NGOs by name, email, phone, location..."
        value={searchQuery}
        onChangeText={(query) => {
          setSearchQuery(query);
          setPage(1);
          setDisplayedNgos(filteredNgos.slice(0, ngosPerPage));
        }}
        style={styles.searchBar}
        iconColor="#333"
        inputStyle={{ fontSize: 14 }}
      />

      {/* Show results */}
      {searchQuery.length > 0 && filteredNgos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={50} color="#bdc3c7" />
          <Text style={styles.noResult}>No NGOs found</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
        >
          {displayedNgos.map((ngo) => (
            <NgoCard key={ngo.ngo_id} item={ngo} />
          ))}
        </ScrollView>
      )}
      
      {displayedNgos.length < filteredNgos.length && (
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
    width: "auto",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    elevation: 3,
    marginBottom: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "black",
    marginHorizontal: 15,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  ngoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
    borderWidth: 1,
    borderColor: "#e3e3e3",
  },
  ngoInfo: {
    flex: 1,
    justifyContent: "center",
  },
  ngoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  ngoEmail: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 3,
  },
  ngoPhone: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 3,
  },
  ngoLocation: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  deleteButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#fff3f3",
  },
  loadMoreButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,
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

export default NgoList;