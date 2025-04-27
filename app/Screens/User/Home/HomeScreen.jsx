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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [localNgos, setLocalNgos] = useState([]);
  const router = useRouter();
  const [userData, setUserData] = useState({
    city: "", // This should come from your user data/authentication system
  });

  useEffect(() => {
    const getUserData = async () => {
      try {
        const city = (await AsyncStorage.getItem("city"));

        setUserData({
          city,
        });
      } catch (error) {
        console.error("Error fetching user data from AsyncStorage:", error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    ngosList();
    localNgosList();
  }, [userData.city]);

  const ngosList = async () => {
    try {
      const response = await axios.get(
        "http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/getngos.php"
      );
      if (response.data.status === "success") {
        setNgos(response.data.data);
      } else {
        console.error("Error getting Ngos:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching Ngos:", err);
    }
  };

  const localNgosList = async () => {
    try {
      if (!userData.city) {
        console.log("No city data available, skipping local NGOs fetch");
        return;
      }

      const url = `http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/getngos.php?city=${encodeURIComponent(
        userData.city
      )}`;

      const response = await axios.get(url);

      if (response.data.status === "success") {
        setLocalNgos(response.data.data);
        // console.log(`Found ${response.data.data.length} local NGOs`);
      } else {
        console.error("Error getting local Ngos:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching local Ngos:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Navbar />
      <ScrollView>
        <WelcomeSection
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

        {/* Local NGOs Section */}
        <View style={styles.ngoCardContainer}>
          <View style={styles.ngoHeader}>
            <Text style={styles.ngoCardContainerTitle}>
              {userData.city ? `NGOs in ${userData.city}` : "Local NGOs"}
            </Text>
            {userData.city && (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/Screens/User/Ngo/NGOListScreen",
                    params: { city: userData.city },
                  })
                }
              >
                {/* <Text style={styles.viewAllText}>View All</Text> */}
              </TouchableOpacity>
            )}
          </View>
          {userData.city ? (
            <FlatList
              data={localNgos.slice(0, 5)}
              keyExtractor={(item) => item.ngo_id.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal
              decelerationRate="fast"
              renderItem={({ item }) => <NgoCard ngo={item} />}
              ListEmptyComponent={
                <Text style={styles.emptyList}>No NGOs found in your city</Text>
              }
            />
          ) : (
            <Text style={styles.emptyList}>
              Set your city to see local NGOs
            </Text>
          )}
        </View>

        {/* All NGOs Section */}
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
  emptyList: {
    textAlign: "center",
    padding: 20,
    color: "#666",
    fontStyle: "italic",
  },
});
