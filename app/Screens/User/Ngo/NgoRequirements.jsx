import { StyleSheet, Text, View, Dimensions, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ScrollView } from "react-native-virtualized-view";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NgoRequirementUserScreen from "../../../../components/NgoRequirementUserScreen";
import { SafeAreaView } from "react-native-safe-area-context";

const NgoRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await axios.get(
          "http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/ngorequirements.php"
        );
        
        if (response.data.status === "success") {
          // Sort requirements by priority (highest to lowest)
          const sortedRequirements = response.data.data.sort((a, b) => {
            // Handle cases where priority might not exist in older records
            const priorityA = a.priority ? parseInt(a.priority) : 1;
            const priorityB = b.priority ? parseInt(b.priority) : 1;
            return priorityB - priorityA; // Descending order (5 to 1)
          });
          
          setRequirements(sortedRequirements);
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching requirements:", error);
        Alert.alert("Error", "Failed to fetch requirements");
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Navbar />
      <ScrollView>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Urgent NGO Requirements</Text>
          
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : (
            <View style={styles.cardsContainer}>
              {requirements.map((item) => (
                <NgoRequirementUserScreen 
                  key={item.requirement_id.toString()} 
                  item={item} 
                />
              ))}
              
              {requirements.length === 0 && (
                <Text style={styles.noDataText}>No requirements available</Text>
              )}
            </View>
          )}
          
        </ScrollView>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

export default NgoRequirements;

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  title: {
    marginTop: 100,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  cardsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 90
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 30,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 30,
  },
  footerSpace: {
    height: 20,
  }
});