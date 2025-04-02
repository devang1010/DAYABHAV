import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-virtualized-view';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import axios from 'axios';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DonationStatsCard from '../../../../components/DonationStatsCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const DonationStats = () => {
  const [userId, setUserId] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('user_id');
        if (storedUserId) {
          setUserId(storedUserId);
          fetchDonations(storedUserId);
        }
      } catch (error) {
        console.error('Error getting userId:', error);
      }
    };

    getUserId();
  }, []);

  const fetchDonations = async (userId) => {
    try {
      const response = await axios.get(
        `http://192.168.4.126/phpProjects/donationApp_restapi/api/User/itemdonation.php?user_id=${userId}`
      );
      if (response.data.status === 'success') {

        const sortedDonations = response.data.data.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setDonations(sortedDonations);
      } else {
        console.error('Error fetching donations:', response.data.message);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add this function to handle item removal
  const handleItemDelete = (deletedItemId) => {
    setDonations(currentDonations => 
      currentDonations.filter(donation => donation.item_id !== deletedItemId)
    );
  };

  return (
    <SafeAreaView>
      <Navbar />
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Your Donation Stats</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={donations}
            renderItem={({ item }) => (
              <DonationStatsCard 
                item={item} 
                onDeleteSuccess={handleItemDelete} 
              />
            )}
            keyExtractor={(item) => (item.item_id ? item.item_id.toString() : Math.random().toString())}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScrollView>
    <Footer />
    </SafeAreaView>
  );
};

export default DonationStats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingBottom: 20,
    marginTop: 80,
    marginBottom: 50
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    color: '#333',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
});