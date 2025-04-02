import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '@/components/Navbar';
import NgoFooter from '@/components/NgoFooter';
import ConnectWithUs from '@/components/ConnectWithUs';
import { ScrollView } from 'react-native-virtualized-view';

const API_URL = "http://192.168.4.126/phpProjects/donationApp_restapi/api/Ngo/ngorequirements.php"; 

const UrgentNeedsManagementForm = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [ngoId, setNgoId] = useState(null);
  const [ngoName, setNgoName] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNgoId = async () => {
      try {
        const storedNgoId = await AsyncStorage.getItem("ngo_id");
        const storedNgoName = await AsyncStorage.getItem("ngoname");
        if (storedNgoId) {
          setNgoId(parseInt(storedNgoId));
          setNgoName(storedNgoName);
        }
      } catch (error) {
        console.error("Error fetching NGO ID:", error);
        Alert.alert("Error", "Failed to retrieve NGO ID.");
      }
    };
    fetchNgoId();
  }, []);

  const handleSubmit = async () => {
    if (!itemName || !quantity || !ngoName) {
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
        ngoname: ngoName.trim(),
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoid}
    >
        <Navbar />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Urgent Needs</Text>
            <Text style={styles.headerSubtitle}>
              Add items that your organization urgently needs
            </Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.title}>New Request</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Item Name</Text>
              <TextInput
                style={styles.input}
                placeholder="What do you need?"
                placeholderTextColor="#A0AEC0"
                value={itemName}
                onChangeText={setItemName}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="How many?"
                placeholderTextColor="#A0AEC0"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Organization</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={ngoName}
                editable={false}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSubmit} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
        <ConnectWithUs />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    marginTop: 110,
    marginBottom: 50,
  },
  container: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#718096',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  formHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  inputGroup: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2D3748',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  disabledInput: {
    backgroundColor: '#F7FAFC',
    color: 'black',
  },
  button: {
    backgroundColor: '#2B6CB0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UrgentNeedsManagementForm;