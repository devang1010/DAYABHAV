import { StyleSheet, Text, View, FlatList, ScrollView } from "react-native";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

import ngosData from "@/data/ngosData";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NgoListCard from "@/components/NgoListCard";
import { SafeAreaView } from "react-native-safe-area-context";

const NGOListScreen = () => {
  const [ngos, setNgos] = useState([]);
  useEffect(() => {
    ngosList();
  }, []);

  const ngosList = async () => {
    try {
      const response = await axios.get("http://192.168.4.126/phpProjects/donationApp_restapi/api/Ngo/getngos.php");
      if (response.data.status === "success") {
        setNgos(response.data.data);
      } else {
        console.error('Error getting Ngos:', response.data.message);
      }
    } catch (err) {
      console.error('Error fetching Ngos:', err);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
    <ScrollView  showsVerticalScrollIndicator={false}>
      <View style={styles.ngoCardContainer}>
        <Text style={styles.ngoCardContainerTitle}>Our NGOs</Text>
        <FlatList
          data={ngos}
          keyExtractor={(item) => item.ngo_id.toString()}
          renderItem={({ item }) => <NgoListCard ngo={item} />}
          scrollEnabled={false} 
        />
      </View>
    </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

export default NGOListScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
  },
  ngoCardContainer: {
    paddingTop: 20,
    marginTop: 70,
    marginBottom: 80
  },
  ngoCardContainerTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    paddingLeft: 12,
    marginBottom: 10,
  },
});
