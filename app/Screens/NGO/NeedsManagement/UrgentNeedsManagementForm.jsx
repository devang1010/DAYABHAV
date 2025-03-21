import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Alert, ScrollView, ActivityIndicator 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '@/components/Navbar';
import NgoFooter from '@/components/NgoFooter';
import ConnectWithUs from '@/components/ConnectWithUs';

const API_URL = "http://192.168.56.92/phpProjects/donationApp_restapi/api/Ngo/ngorequirements.php"; 

const UrgentNeedsManagementForm = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [ngoId, setNgoId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNgoId = async () => {
      try {
        const storedNgoId = await AsyncStorage.getItem("ngo_id");
        if (storedNgoId) {
          setNgoId(parseInt(storedNgoId));
        }
      } catch (error) {
        console.error("Error fetching NGO ID:", error);
        Alert.alert("Error", "Failed to retrieve NGO ID.");
      }
    };
    fetchNgoId();
  }, []);

  const handleSubmit = async () => {
    if (!itemName || !quantity) {
      return Alert.alert("Error", "All fields are required!");
    }

    if (!ngoId) {
      return Alert.alert("Error", "NGO ID not found. Please log in again.");
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        ngo_id: ngoId,
        item_name: itemName.trim(),
        quantity: parseInt(quantity),
      });

      if (response.data.status === "success") {
        Alert.alert("Success", "Urgent need added successfully!");
        setItemName('');
        setQuantity('');
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error adding requirement:", error);
      Alert.alert("Error", "Failed to add urgent need. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView>
      <Navbar />
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Add Urgent Need</Text>
          <TextInput
            style={styles.input}
            placeholder="Item Name"
            placeholderTextColor="#A9A9A9"
            value={itemName}
            onChangeText={setItemName}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            placeholderTextColor="#A9A9A9"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ConnectWithUs />
      <NgoFooter />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Light gray-blue background
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFF', // White card
    padding: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black', // Steel Blue for title
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    // borderBottomWidth: 1,
    borderColor: 'black', // Steel Blue border
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#333',
    // backgroundColor: '#F0F8FF', // Light blue input background
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4682B4', // Steel Blue button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default UrgentNeedsManagementForm;