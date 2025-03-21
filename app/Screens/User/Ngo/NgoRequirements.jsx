import { StyleSheet, Text, View, FlatList, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-virtualized-view";
import axios from "axios";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NgoRequirementUserScreen from "../../../../components/NgoRequirementUserScreen";

const NgoRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await axios.get(
          "http://192.168.56.92/phpProjects/donationApp_restapi/api/Ngo/ngorequirements.php"
        );
        if (response.data.status === "success") {
          setRequirements(response.data.data);
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
    <ScrollView>
      <Navbar />
      <View style={styles.container}>
        <Text style={styles.title}>Urgent NGO Requirements</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={requirements}
            keyExtractor={(item) => item.requirement_id.toString()}
            renderItem={({ item }) => <NgoRequirementUserScreen item={item} />}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
      <Footer />
    </ScrollView>
  );
};

export default NgoRequirements;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#333",
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});
