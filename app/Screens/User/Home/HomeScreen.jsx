import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-virtualized-view";
import { useState, useEffect } from "react";
import axios from "axios";

import userExpData from "@/data/userExpData";
import itemData from "@/data/itemData";

import Navbar from "@/components/Navbar";
import WelcomeSection from "@/components/WelcomeSection";
import DonationCard from "@/components/DonationCard";
import NgoCard from "@/components/NgoCard";
import UserExp from "@/components/UserExp";
import Footer from "@/components/Footer";
import ItemCard from "@/components/ItemCard";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [ngos, setNgos] = useState([]);
  const router = useRouter();

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
    <ScrollView >
      <WelcomeSection
        username={"Devang"}
        welcomeMessage={"We appreciate any kind of donations"}
      />
      <DonationCard />

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            router.push("/Screens/User/Ngo/NgoRequirements");
          }}
        >
          <Text style={styles.actionButtonText}>NGO Requirements</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            router.push("/Screens/User/Donation/DonationStats");
          }}
        >
          <Text style={styles.actionButtonText}>My Donations</Text>
        </TouchableOpacity>
      </View>

      {/* NGO Section */}
      <View style={styles.ngoCardContainer}>
        <View style={styles.ngoHeader}>
          <Text style={styles.ngoCardContainerTitle}>Our Top NGOs</Text>
          <TouchableOpacity
            onPress={() => router.push("/Screens/User/Ngo/NGOListScreen")}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={ngos.slice(0, 5)}
          keyExtractor={(item) => item.ngo_id.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal
          decelerationRate="fast"
          renderItem={({ item }) => <NgoCard ngo={item} />}
        />
      </View>

      {/* User Donations Section */}
      <View style={styles.ngoCardContainer}>
        <View style={styles.ngoHeader}>
          <Text style={styles.ngoCardContainerTitle}>
            Look what our users donate
          </Text>
        </View>
        <FlatList
          data={itemData}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal
          decelerationRate="fast"
          renderItem={({ item }) => <ItemCard item={item} />}
        />
      </View>

      {/* Testimonials Section */}
      <View style={styles.testimonialSection}>
        <Text style={styles.testimonialTitle}>What Our Users Say</Text>
        <FlatList
          data={userExpData}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal
          decelerationRate="fast"
          renderItem={({ item }) => <UserExp userExpData={item} />}
        />
      </View>

    </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  actionButton: {
    backgroundColor: "#4682B4",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    elevation: 3,
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  ngoCardContainer: {
    paddingTop: 20,
  },
  ngoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  ngoCardContainerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    paddingLeft: 12,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4682B4",
    paddingRight: 12,
  },
  testimonialSection: {
    marginVertical: 20,
    padding: 10,
    marginBottom: 80,
  },
  testimonialTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
});
