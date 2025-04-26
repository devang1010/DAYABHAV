import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Alert, ActivityIndicator, SafeAreaView, Keyboard, Platform
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '@/components/Navbar';
import ConnectWithUs from '@/components/ConnectWithUs';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const API_URL = "http://192.168.46.163/phpProjects/donationApp_restapi/api/Ngo/ngorequirements.php"; 

const UrgentNeedsManagementForm = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [priority, setPriority] = useState('1'); // Default priority is 1 (lowest)
  const [ngoId, setNgoId] = useState(null);
  const [ngoName, setNgoName] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Refs for input fields
  const quantityInputRef = useRef(null);
  const priorityInputRef = useRef(null);

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

    // Validate priority (should be between 1 and 5)
    const priorityNum = parseInt(priority);
    if (isNaN(priorityNum) || priorityNum < 1 || priorityNum > 5) {
      return Alert.alert("Error", "Priority must be a number between 1 and 5.");
    }

    setLoading(true);
    try {
      const response = await axios.post(API_URL, {
        ngo_id: ngoId,
        item_name: itemName.trim(),
        quantity: parseInt(quantity),
        priority: priorityNum,
        ngoname: ngoName.trim(),
      });

      if (response.data.status === "success") {
        Alert.alert("Success", "Urgent need added successfully!");
        setItemName('');
        setQuantity('');
        setPriority('1'); // Reset to default
        Keyboard.dismiss();
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

  // Function to focus on quantity input
  const focusQuantityInput = () => {
    if (quantityInputRef.current) {
      quantityInputRef.current.focus();
    }
  };

  // Function to focus on priority input
  const focusPriorityInput = () => {
    if (priorityInputRef.current) {
      priorityInputRef.current.focus();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Navbar />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        enableOnAndroid={true}
        enableResetScrollToCoords={false}
        extraHeight={150}
        extraScrollHeight={80}
        bounces={false}
      >
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
          
          <View style={styles.formBody}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Item Name</Text>
              <TextInput
                style={styles.input}
                placeholder="What do you need?"
                placeholderTextColor="#A0AEC0"
                value={itemName}
                onChangeText={setItemName}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={focusQuantityInput}
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                ref={quantityInputRef}
                style={styles.input}
                placeholder="How many?"
                placeholderTextColor="#A0AEC0"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={focusPriorityInput}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Priority (1-5)</Text>
              <View style={styles.priorityContainer}>
                <TextInput
                  ref={priorityInputRef}
                  style={styles.input}
                  placeholder="Priority level (1-5)"
                  placeholderTextColor="#A0AEC0"
                  value={priority}
                  onChangeText={setPriority}
                  keyboardType="numeric"
                  returnKeyType="done"
                  maxLength={1}
                  onSubmitEditing={handleSubmit}
                />
                <Text style={styles.priorityHelper}>5 = Highest Priority, 1 = Lowest Priority</Text>
              </View>
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
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.buttonText}>Submit Request</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <ConnectWithUs />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  scrollView: {
    flex: 1,
    marginTop: 110, // Adjust based on your Navbar height
    marginBottom: 50, // Adjust based on ConnectWithUs height
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 17,
    color: '#718096',
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 30,
    overflow: 'hidden',
  },
  formHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: '#F8FAFC',
  },
  formBody: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D3748',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2D3748',
    backgroundColor: '#FFFFFF',
  },
  priorityContainer: {
    width: '100%',
  },
  priorityHelper: {
    fontSize: 14,
    color: '#718096',
    marginTop: 8,
    fontStyle: 'italic',
  },
  disabledInput: {
    backgroundColor: '#F7FAFC',
    color: '#4A5568',
    borderColor: '#CBD5E0',
  },
  button: {
    backgroundColor: '#2B6CB0',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#2B6CB0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default UrgentNeedsManagementForm;